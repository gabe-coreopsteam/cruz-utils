import React, { useState } from 'react';
// Note: 'react-native' imports will show an error in this web-based
// preview environment. This code is correct for a real React Native project.
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  GestureResponderEvent,
} from 'react-native';
import RNFS from 'react-native-fs';

// --- Type Definitions ---
type Page = 'downloader' | 'about';
type Theme = 'light' | 'dark';
interface MessageState {
  type: 'info' | 'success' | 'error' | '';
  text: string;
}

// --- Page Definitions ---
const PAGE_DOWNLOADER: Page = 'downloader';
const PAGE_ABOUT: Page = 'about';

// --- Icon Components (Mocked as Text) ---
// In a real app, you'd use @expo/vector-icons or react-native-svg
const DownloadIcon = () => <Text style={styles.icon}>D</Text>;
const InfoIcon = () => <Text style={styles.icon}>i</Text>;
const MoonIcon = () => <Text style={styles.icon}>M</Text>;
const SunIcon = () => <Text style={styles.icon}>S</Text>;
const AlertIcon = () => <Text style={styles.icon}>!</Text>;
const CheckIcon = () => <Text style={styles.icon}>✓</Text>;

// --- App Component ---
const App = () => {
  const [page, setPage] = useState<Page>(PAGE_DOWNLOADER);
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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
          />
          <NavButton
            icon={<InfoIcon />}
            active={page === PAGE_ABOUT}
            onPress={() => setPage(PAGE_ABOUT)}
            isDark={isDark}
          />
          <View style={{ flex: 1 }} />
          <NavButton
            icon={isDark ? <SunIcon /> : <MoonIcon />}
            onPress={toggleTheme}
            isDark={isDark}
          />
        </View>

        {/* --- Page Content --- */}
        <View style={styles.mainContent}>
          {page === PAGE_DOWNLOADER && <DownloaderPage isDark={isDark} />}
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
}

const NavButton = ({ icon, active, onPress, isDark }: NavButtonProps) => {
  const btnStyles = [
    styles.navButton,
    active
      ? styles.navButtonActive
      : isDark
      ? styles.navButtonDark
      : styles.navButtonLight,
  ];
  const iconStyles = [
    styles.icon,
    active
      ? styles.navIconActive
      : isDark
      ? styles.navIconDark
      : styles.navIconLight,
  ];

  // We clone the element to pass in the computed style
  return (
    <TouchableOpacity onPress={onPress} style={btnStyles}>
      {React.cloneElement(icon, { style: iconStyles })}
    </TouchableOpacity>
  );
};

// --- Page Props ---
interface PageProps {
  isDark: boolean;
}

// --- 1. Downloader Page Component ---
const DownloaderPage = ({ isDark }: PageProps) => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });

  const handleDownload = async () => {
    setIsLoading(true);
    setMessage({ type: 'info', text: 'Initializing...' });

    try {
      // --- 1. Parse Publisher and Extension Name ---
      let publisher, extensionName;
      try {
        // Basic validation
        if (!url.includes('marketplace.visualstudio.com')) {
           throw new Error('Not a valid Visual Studio Marketplace URL.');
        }

        // Extract query params manually since URL object might be polyfilled differently in RN
        const queryString = url.split('?')[1];
        if (!queryString) throw new Error('No query parameters found.');
        
        const params = new URLSearchParams(queryString);
        const itemName = params.get('itemName');
        
        if (!itemName || !itemName.includes('.')) {
          throw new Error("Invalid URL. Does not contain valid 'itemName' parameter.");
        }
        [publisher, extensionName] = itemName.split('.');
      } catch (e) {
        throw new Error((e as Error).message || 'Invalid Marketplace URL.');
      }

      // --- 2. Fetch Page Content to Find Version ---
      setMessage({ type: 'info', text: `Fetching info for ${extensionName}...` });
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch page. Status: ${response.status}`);
      }
      
      const pageContent = await response.text();
      
      // --- 3. Find Version using Regex ---
      // Look for "version":"1.2.3"
      const versionMatch = pageContent.match(/"version":"([\d\.]+)"/);
      
      if (!versionMatch || !versionMatch[1]) {
        throw new Error('Could not find version information on the page. The marketplace structure may have changed.');
      }
      
      const version = versionMatch[1];
      setMessage({ type: 'info', text: `Found version: ${version}. Starting download...` });

      // --- 4. Construct Final URL ---
      const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage`;

      // --- 5. Download File ---
      const fileName = `${extensionName}-${version}.vsix`;
      // For macOS, we save to the user's Downloads folder
      // RNFS.DownloadDirectoryPath points to ~/Downloads on macOS
      const downloadDest = `${RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath}/${fileName}`;

      const downloadResult = RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: downloadDest,
        begin: (res) => {
           console.log('Download has begun', res);
        },
        progress: (res) => {
           const progress = (res.bytesWritten / res.contentLength) * 100;
           console.log(`Progress: ${progress.toFixed(0)}%`);
        }
      });

      const result = await downloadResult.promise;

      if (result.statusCode === 200) {
        setMessage({ 
          type: 'success', 
          text: `Success! Downloaded to: ${downloadDest}` 
        });
        setUrl(''); // Clear input on success
      } else {
        throw new Error(`Download failed with status code: ${result.statusCode}`);
      }

    } catch (e) {
      const error = e as Error;
      console.error(error);
      setMessage({ 
        type: 'error', 
        text: `Error: ${error.message}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        Paste the VSCode Marketplace URL below to download the `.vsix` file.
      </Text>

      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="https://marketplace.visualstudio.com/..."
        placeholderTextColor={isDark ? '#888' : '#aaa'}
        style={inputStyles}
        editable={!isLoading}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        onPress={handleDownload}
        disabled={isLoading || !url}
        style={[styles.button, (isLoading || !url) && styles.buttonDisabled]}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Download .vsix</Text>
        )}
      </TouchableOpacity>

      {message.text && (
        <Message type={message.type} text={message.text} isDark={isDark} />
      )}
    </View>
  );
};

// --- 2. About Page Component ---
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
      <Text style={titleStyles}>About This Tool</Text>
      <Text style={textStyles}>
        This is a native utility to download VSCode extensions directly from the marketplace.
      </Text>

      <Text style={headingStyles}>How It Works</Text>
      <Text style={textStyles}>
        1. It parses the publisher and extension name from the URL.
        {'\n'}2. It fetches the marketplace page to find the latest version.
        {'\n'}3. It constructs the official download link.
        {'\n'}4. It downloads the .vsix file to your device's storage.
      </Text>

      <Text style={headingStyles}>Storage Location</Text>
      <Text style={textStyles}>
        Files are saved to your ~/Downloads folder by default.
      </Text>
    </View>
  );
};

// --- Message Component ---
interface MessageProps {
  type: MessageState['type'];
  text: string;
  isDark: boolean;
}

const Message = ({ type, text, isDark }: MessageProps) => {
  const msgStyles = [
    styles.message,
    type === 'error' ? styles.messageError : 
    type ==='success' ? styles.messageSuccess : 
    styles.messageInfo,
  ];
  const msgTextStyles = [
    styles.messageText, // Base text style
    isDark ? styles.messageTextDark : styles.messageTextLight,
  ];
  const Icon = type === 'error' ? AlertIcon : type === 'success' ? CheckIcon : InfoIcon;

  return (
    <View style={msgStyles}>
      <Icon />
      <Text style={msgTextStyles}>{text}</Text>
    </View>
  );
};

// --- Stylesheet ---
// This is the React Native equivalent of CSS
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    // No paddingTop needed for macOS - StatusBar.currentHeight is Android-specific
  },
  containerLight: { backgroundColor: '#f3f4f6' },
  containerDark: { backgroundColor: '#111827' },
  layout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 80,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 16,
    borderRightWidth: 1,
  },
  sidebarLight: { backgroundColor: '#fff', borderRightColor: '#e5e7eb' },
  sidebarDark: { backgroundColor: '#1f2937', borderRightColor: '#374151' },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonLight: { backgroundColor: 'transparent' },
  navButtonDark: { backgroundColor: 'transparent' },
  navButtonActive: { backgroundColor: '#4f46e5' },
  icon: { fontSize: 24 },
  navIconLight: { color: '#4b5563' },
  navIconDark: { color: '#d1d5db' },
  navIconActive: { color: '#fff' },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  pageContainer: {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  pageContainerLight: { backgroundColor: '#fff', borderColor: '#e5e7eb' },
  pageContainerDark: { backgroundColor: '#1f2937', borderColor: '#374151' },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  textLight: { color: '#374151' },
  textDark: { color: '#d1d5db' },
  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  inputLight: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
    color: '#111',
  },
  inputDark: {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    color: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  messageError: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  messageSuccess: { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
  messageInfo: { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  messageText: {
    flex: 1, // Allow text to wrap
  },
  messageTextLight: { color: '#374151' },
  messageTextDark: { color: '#d1d5db' },
});

export default App;

