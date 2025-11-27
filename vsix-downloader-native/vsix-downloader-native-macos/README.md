# VSIX Downloader Native (macOS)

This is a React Native for macOS application that downloads VSIX extensions from the Visual Studio Marketplace.

## Project Status
*   **Project Initialized**: The React Native macOS project structure is set up.
*   **Code Implemented**: The `App.tsx` contains the full logic to parse URLs, fetch versions, and download files using `react-native-fs`.
*   **Dependencies**: `react-native-macos`, `react-native-fs`, and TypeScript are configured.

## ⚠️ Action Required: Install CocoaPods
The automated setup could not run `pod install` because the `pod` command was not found in this environment. You **MUST** run this manually.

### 1. Install Native Dependencies
Open your terminal, navigate to the `macos` folder, and run:

```bash
cd vsix-downloader-native-macos/macos
pod install
cd ..
```

*If you don't have CocoaPods installed, run `sudo gem install cocoapods` first.*

### 2. Run the App
Once pods are installed, start the app:

```bash
npm run macos
```

## Features
*   **Dark Mode Support**: Automatically adapts or can be toggled.
*   **VSIX Downloading**:
    *   Past a Marketplace URL.
    *   App fetches the latest version.
    *   Downloads the `.vsix` to your Downloads folder.

## Troubleshooting
*   **Permission Errors**: If you see permission errors during `npm install`, try running `sudo chown -R $USER ~/.npm`.
*   **Build Failures**: Ensure you have the latest Xcode and Command Line Tools installed.
