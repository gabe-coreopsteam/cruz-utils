import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';

// --- Page Definitions ---
const PAGE_DOWNLOADER = 'downloader';
const PAGE_ABOUT = 'about';

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
  const [page, setPage] = useState(PAGE_DOWNLOADER);
  const [theme, setTheme] = useState('light');

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
const NavButton = ({ icon, active, onPress, isDark }) => {
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

  return (
    <TouchableOpacity onPress={onPress} style={btnStyles}>
      {React.cloneElement(icon, { style: iconStyles })}
    </TouchableOpacity>
  );
};

// --- 1. Downloader Page Component ---
const DownloaderPage = ({ isDark }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleDownload = async () => {
    setIsLoading(true);
    setMessage({ type: 'info', text: 'Starting download...' });

    // --- NATIVE DOWNLOAD LOGIC (PLACEHOLDER) ---
    // This part is complex and requires native modules.
    // 1. You would parse the `url` to get publisher/name.
    // 2. You would `fetch` the marketplace page (maybe via proxy).
    // 3. You would parse the `version` from the page content.
    // 4. You would use a library like `react-native-fs` or `react-native-fetch-blob`
    //    to download the constructed VSIX URL to the device's
    //    Downloads folder, which requires platform-specific permissions.
    
    // Simulate a network request and error
    setTimeout(() => {
      setMessage({
        type: 'error',
        text: 'Download failed. Native download logic is not implemented in this template.',
      });
      setIsLoading(false);
    }, 2000);
    // --- END PLACEHOLDER ---
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
const AboutPage = ({ isDark }) => {
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
        This is a React Native template for a VSIX downloader app.
      </Text>

      <Text style={headingStyles}>How It Works (Placeholder)</Text>
      <Text style={textStyles}>
        - This app demonstrates the UI layout.
        - The download logic requires native modules (like `react-native-fs`) to
          save files to the device.
      </Text>

      <Text style={headingStyles}>Limitations</Text>
      <Text style={textStyles}>
        - Styling is with StyleSheet, not CSS.
        - Native file I/O is not implemented.
        - CORS rules still apply to `fetch`.
      </Text>
    </View>
  );
};

// --- Message Component ---
const Message = ({ type, text, isDark }) => {
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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

