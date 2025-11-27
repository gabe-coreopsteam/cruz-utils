/**
 * App.tsx
 * 
 * VSIX Downloader - A native macOS app to download VS Code extensions
 * from the Microsoft Marketplace.
 * 
 * Part of CruzUtils - Tools for the DevOps Community
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  GestureResponderEvent,
} from 'react-native';

// Utilities
import { getExtensionDetails, generateFileName } from './src/utils/marketplace';
import { downloadFile, formatFileSize, DownloadProgress } from './src/utils/downloader';
import { useAppSettings } from './src/hooks/useAppSettings';

// Components
import { SettingsPage } from './src/components/SettingsPage';

// --- Type Definitions ---
type Page = 'downloader' | 'settings' | 'about';
type Theme = 'light' | 'dark';

interface MessageState {
  type: 'info' | 'success' | 'error' | 'progress' | '';
  text: string;
  progress?: number; // 0-100
}

// --- Page Definitions ---
const PAGE_DOWNLOADER: Page = 'downloader';
const PAGE_SETTINGS: Page = 'settings';
const PAGE_ABOUT: Page = 'about';

// --- Icon Components ---
// Using text-based icons for simplicity. In production, use react-native-vector-icons
const DownloadIcon = ({ style }: { style?: object }) => <Text style={style}>↓</Text>;
const SettingsIcon = ({ style }: { style?: object }) => <Text style={style}>⚙</Text>;
const InfoIcon = ({ style }: { style?: object }) => <Text style={style}>ℹ</Text>;
const MoonIcon = ({ style }: { style?: object }) => <Text style={style}>☾</Text>;
const SunIcon = ({ style }: { style?: object }) => <Text style={style}>☀</Text>;
const AlertIcon = () => <Text style={iconStyles.alert}>⚠</Text>;
const CheckIcon = () => <Text style={iconStyles.success}>✓</Text>;
const SpinnerIcon = () => <Text style={iconStyles.info}>◌</Text>;

const iconStyles = StyleSheet.create({
  alert: { fontSize: 18, color: '#ef4444' },
  success: { fontSize: 18, color: '#10b981' },
  info: { fontSize: 18, color: '#3b82f6' },
});

// --- Main App Component ---
const App = () => {
  const [page, setPage] = useState<Page>(PAGE_DOWNLOADER);
  const [theme, setTheme] = useState<Theme>('light');
  
  // Settings hook
  const { settings, updateSetting, resetSettings } = useAppSettings();

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const isDark = theme === 'dark';
  
  const containerStyles = [
    styles.appContainer,
    isDark ? styles.containerDark : styles.containerLight,
  ];
  
  const navStyles = [
    styles.sidebar,
    isDark ? styles.sidebarDark : styles.sidebarLight,
  ];

  return (
    <SafeAreaView style={containerStyles}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.layout}>
        {/* --- Sidebar Navigation --- */}
        <View style={navStyles}>
          <NavButton
            icon={<DownloadIcon />}
            active={page === PAGE_DOWNLOADER}
            onPress={() => setPage(PAGE_DOWNLOADER)}
            isDark={isDark}
            title="Downloader"
          />
          <NavButton
            icon={<SettingsIcon />}
            active={page === PAGE_SETTINGS}
            onPress={() => setPage(PAGE_SETTINGS)}
            isDark={isDark}
            title="Settings"
          />
          <NavButton
            icon={<InfoIcon />}
            active={page === PAGE_ABOUT}
            onPress={() => setPage(PAGE_ABOUT)}
            isDark={isDark}
            title="About"
          />
          
          {/* Spacer */}
          <View style={{ flex: 1 }} />
          
          {/* Theme Toggle */}
          <NavButton
            icon={isDark ? <SunIcon /> : <MoonIcon />}
            onPress={toggleTheme}
            isDark={isDark}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          />
        </View>

        {/* --- Page Content --- */}
        <View style={styles.mainContent}>
          {page === PAGE_DOWNLOADER && (
            <DownloaderPage isDark={isDark} downloadPath={settings.downloadPath} />
          )}
          {page === PAGE_SETTINGS && (
            <SettingsPage
              isDark={isDark}
              settings={settings}
              onUpdateSetting={updateSetting}
              onResetSettings={resetSettings}
            />
          )}
          {page === PAGE_ABOUT && <AboutPage isDark={isDark} />}
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Navigation Button Component ---
interface NavButtonProps {
  icon: React.ReactElement;
  active?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  isDark: boolean;
  title?: string;
}

const NavButton = ({ icon, active, onPress, isDark, title }: NavButtonProps) => {
  const btnStyles = [
    styles.navButton,
    active
      ? styles.navButtonActive
      : isDark
      ? styles.navButtonDark
      : styles.navButtonLight,
  ];
  
  const iconStyle = {
    fontSize: 24,
    color: active ? '#fff' : isDark ? '#d1d5db' : '#4b5563',
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={btnStyles}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      {React.cloneElement(icon, { style: iconStyle })}
    </TouchableOpacity>
  );
};

// --- Page Props ---
interface PageProps {
  isDark: boolean;
}

interface DownloaderPageProps extends PageProps {
  downloadPath: string;
}

// --- Downloader Page Component ---
const DownloaderPage = ({ isDark, downloadPath }: DownloaderPageProps) => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });

  const handleDownload = useCallback(async () => {
    if (!url.trim()) {
      setMessage({ type: 'error', text: 'Please enter a marketplace URL.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Validating URL...' });

    try {
      // Step 1: Get extension details (parses URL, fetches version)
      const extensionResult = await getExtensionDetails(url, (msg) => {
        setMessage({ type: 'info', text: msg });
      });

      if (!extensionResult.success || !extensionResult.data) {
        throw new Error(extensionResult.error || 'Failed to get extension details.');
      }

      const { extensionName, version, downloadUrl } = extensionResult.data;
      const fileName = generateFileName(extensionName, version);

      // Step 2: Start download with progress
      setMessage({ 
        type: 'progress', 
        text: `Downloading ${fileName}...`, 
        progress: 0 
      });

      const downloadResult = await downloadFile({
        url: downloadUrl,
        fileName,
        downloadPath,
        onBegin: () => {
          setMessage({ 
            type: 'progress', 
            text: `Downloading ${fileName}...`, 
            progress: 0 
          });
        },
        onProgress: (progress: DownloadProgress) => {
          const sizeInfo = progress.contentLength > 0
            ? ` (${formatFileSize(progress.bytesWritten)} / ${formatFileSize(progress.contentLength)})`
            : '';
          
          setMessage({
            type: 'progress',
            text: `Downloading ${fileName}${sizeInfo}`,
            progress: progress.percentage,
          });
        },
      });

      if (!downloadResult.success) {
        throw new Error(downloadResult.error || 'Download failed.');
      }

      // Success!
      const sizeInfo = downloadResult.fileSize 
        ? ` (${formatFileSize(downloadResult.fileSize)})`
        : '';
      
      setMessage({
        type: 'success',
        text: `✓ Downloaded successfully!${sizeInfo}\n${downloadResult.filePath}`,
      });
      
      setUrl(''); // Clear input on success

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('[Downloader] Error:', error);
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [url, downloadPath]);

  // Themed styles
  const pageStyles = [
    styles.pageContainer,
    isDark ? styles.pageContainerDark : styles.pageContainerLight,
  ];
  const textStyles = [styles.text, isDark ? styles.textDark : styles.textLight];
  const titleStyles = [styles.title, isDark ? styles.textDark : styles.textLight];
  const inputStyles = [
    styles.input,
    isDark ? styles.inputDark : styles.inputLight,
  ];

  return (
    <View style={pageStyles}>
      <Text style={titleStyles}>VSIX Downloader</Text>
      <Text style={textStyles}>
        Paste a VS Code Marketplace URL below to download the extension as a .vsix file.
      </Text>

      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="https://marketplace.visualstudio.com/items?itemName=publisher.extension"
        placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
        style={inputStyles}
        editable={!isLoading}
        autoCapitalize="none"
        autoCorrect={false}
        selectTextOnFocus
      />

      <TouchableOpacity
        onPress={handleDownload}
        disabled={isLoading || !url.trim()}
        style={[
          styles.button,
          (isLoading || !url.trim()) && styles.buttonDisabled,
        ]}
        accessibilityLabel="Download extension"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Downloading...' : 'Download .vsix'}
        </Text>
      </TouchableOpacity>

      {/* Progress Bar (shown during download) */}
      {message.type === 'progress' && typeof message.progress === 'number' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${message.progress}%` },
              ]} 
            />
          </View>
          <Text style={[styles.progressText, isDark && styles.progressTextDark]}>
            {message.progress}%
          </Text>
        </View>
      )}

      {/* Message Display */}
      {message.text && (
        <MessageBox type={message.type} text={message.text} isDark={isDark} />
      )}
    </View>
  );
};

// --- About Page Component ---
const AboutPage = ({ isDark }: PageProps) => {
  const pageStyles = [
    styles.pageContainer,
    isDark ? styles.pageContainerDark : styles.pageContainerLight,
  ];
  const textStyles = [styles.text, isDark ? styles.textDark : styles.textLight];
  const titleStyles = [styles.title, isDark ? styles.textDark : styles.textLight];
  const headingStyles = [styles.heading, isDark ? styles.textDark : styles.textLight];

  return (
    <View style={pageStyles}>
      <Text style={titleStyles}>About VSIX Downloader</Text>
      
      <Text style={textStyles}>
        A native macOS utility to download Visual Studio Code extensions directly 
        from the Microsoft Marketplace. Part of the CruzUtils toolkit.
      </Text>

      <Text style={headingStyles}>How It Works</Text>
      <Text style={textStyles}>
        1. Paste a Marketplace URL (e.g., marketplace.visualstudio.com/items?itemName=...)
        {'\n'}2. The app validates the URL and extracts the publisher/extension info
        {'\n'}3. It fetches the latest version from the Marketplace
        {'\n'}4. It downloads the .vsix file to your configured location
      </Text>

      <Text style={headingStyles}>Why Native?</Text>
      <Text style={textStyles}>
        Browser-based tools face CORS restrictions when fetching from the Marketplace.
        This native app bypasses those restrictions, providing a seamless experience.
      </Text>

      <Text style={headingStyles}>Credits</Text>
      <Text style={textStyles}>
        Built with React Native for macOS{'\n'}
        A CruzUtils project for the DevOps community{'\n'}
        MIT License © 2025
      </Text>
    </View>
  );
};

// --- Message Box Component ---
interface MessageBoxProps {
  type: MessageState['type'];
  text: string;
  isDark: boolean;
}

const MessageBox = ({ type, text, isDark }: MessageBoxProps) => {
  const messageStyles = [
    styles.message,
    type === 'error' && styles.messageError,
    type === 'success' && styles.messageSuccess,
    (type === 'info' || type === 'progress') && styles.messageInfo,
  ];
  
  const textStyles = [
    styles.messageText,
    isDark ? styles.messageTextDark : styles.messageTextLight,
  ];

  const Icon = type === 'error' ? AlertIcon 
    : type === 'success' ? CheckIcon 
    : SpinnerIcon;

  return (
    <View style={messageStyles}>
      <Icon />
      <Text style={textStyles}>{text}</Text>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  // App Container
  appContainer: {
    flex: 1,
  },
  containerLight: { 
    backgroundColor: '#f3f4f6' 
  },
  containerDark: { 
    backgroundColor: '#111827' 
  },
  
  // Layout
  layout: {
    flex: 1,
    flexDirection: 'row',
  },
  
  // Sidebar
  sidebar: {
    width: 70,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 8,
    borderRightWidth: 1,
  },
  sidebarLight: { 
    backgroundColor: '#ffffff', 
    borderRightColor: '#e5e7eb' 
  },
  sidebarDark: { 
    backgroundColor: '#1f2937', 
    borderRightColor: '#374151' 
  },
  
  // Navigation Button
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonLight: { 
    backgroundColor: 'transparent' 
  },
  navButtonDark: { 
    backgroundColor: 'transparent' 
  },
  navButtonActive: { 
    backgroundColor: '#4f46e5' 
  },
  
  // Main Content
  mainContent: {
    flex: 1,
    padding: 24,
  },
  
  // Page Container
  pageContainer: {
    flex: 1,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
  },
  pageContainerLight: { 
    backgroundColor: '#ffffff', 
    borderColor: '#e5e7eb' 
  },
  pageContainerDark: { 
    backgroundColor: '#1f2937', 
    borderColor: '#374151' 
  },
  
  // Typography
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  textLight: { 
    color: '#374151' 
  },
  textDark: { 
    color: '#d1d5db' 
  },
  
  // Input
  input: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  inputLight: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    color: '#f9fafb',
  },
  
  // Button
  button: {
    height: 48,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  
  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    minWidth: 40,
    textAlign: 'right',
  },
  progressTextDark: {
    color: '#d1d5db',
  },
  
  // Message
  message: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  messageError: { 
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  messageSuccess: { 
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  messageInfo: { 
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextLight: { 
    color: '#374151' 
  },
  messageTextDark: { 
    color: '#d1d5db' 
  },
});

export default App;
