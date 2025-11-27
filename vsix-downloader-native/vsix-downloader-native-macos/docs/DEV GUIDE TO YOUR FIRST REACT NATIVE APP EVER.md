# DEV GUIDE TO YOUR FIRST REACT NATIVE APP EVER

**Building the VSIX Downloader for macOS**  
**Version:** 1.0  
**Last Updated:** 2025-11-27

---

## Abstract

### Why This Guide Exists

Learning a new technology stack can feel overwhelming, especially when you're already a competent developer in other languages. The React Native ecosystem has its own conventions, tools, and mental models that differ significantly from traditional desktop or backend development.

This guide was written by a developer with 30+ years of Java and Python experience who was in exactly your position—wanting to build a native macOS application but facing a steep learning curve with React Native, TypeScript, and the JavaScript ecosystem.

**The solution?** Break down the learning process into small, achievable victories.

### What Are Nano Projects?

**Nano Projects** are deliberately chunked, quick-to-follow building blocks of a larger project. Each Nano Project:

1. **Reduces Fear of Failure** — Small, achievable goals build confidence
2. **Produces Working Artifacts** — At the end of each Nano Project, you have something that works
3. **Teaches Through Doing** — You learn by building, not just reading
4. **Provides Clear Checkpoints** — You always know where you are and what's next

Think of Nano Projects as the "lego bricks" of software development learning. Individually, they're small and manageable. Combined, they create something remarkable.

### How to Use This Guide

1. **Go in Order** — Each Nano Project builds on the previous one
2. **Don't Skip Steps** — Every command and file has a purpose
3. **Verify Your Work** — Each Nano Project ends with verification steps
4. **Take Breaks** — If you're stuck, walk away and come back fresh
5. **Use the Documentation Links** — They're there to deepen your understanding

### Prerequisites for This Guide

Before starting Nano Project 1, ensure you have:

- [ ] A Mac running macOS 12.0 (Monterey) or later
- [ ] Administrator access to install software
- [ ] At least 25GB of free disk space (Xcode is large)
- [ ] A stable internet connection
- [ ] Basic terminal/command line familiarity (you know what `cd` and `ls` do)

### What You'll Build

By the end of this guide, you'll have built **VSIX Downloader** — a native macOS application that:

- Downloads Visual Studio Code extensions (.vsix files) from the Microsoft Marketplace
- Provides a clean, modern UI with dark mode support
- Saves files directly to your Downloads folder
- Runs natively on macOS without a web browser

More importantly, you'll understand **how** you built it and be ready to tackle your own React Native projects.

---

# The Nano Projects

---

## Nano Project 1: Setting Up Your Development Environment

### Overview

Before building any React Native application, you need the right tools installed on your machine. This Nano Project walks you through installing and verifying Node.js, npm, Xcode, and CocoaPods. These are the foundational tools that all React Native development on macOS depends on.

Think of this as preparing your workbench before starting a woodworking project — you need the right tools in the right places before you can create anything.

### What You'll Have at the End

- ✅ Node.js (JavaScript runtime) installed and verified
- ✅ npm (Node Package Manager) installed and verified
- ✅ Xcode (Apple's development environment) installed with Command Line Tools
- ✅ CocoaPods (iOS/macOS dependency manager) installed
- ✅ A terminal ready for React Native macOS development

### Prerequisites

- [ ] A Mac running macOS 12.0 or later
- [ ] Administrator access to install software
- [ ] At least 25GB of free disk space
- [ ] Apple ID (for Xcode download)

---

### Tasks

#### Task 1: Install Node.js and npm

**What is Node.js?**

Node.js is a JavaScript runtime that allows you to run JavaScript outside of a web browser. While JavaScript was originally designed for browsers, Node.js lets you run JavaScript on your computer — which is essential for React Native's build tools.

**What is npm?**

npm (Node Package Manager) comes bundled with Node.js. It's like Maven for Java or pip for Python — a tool that downloads and manages libraries (called "packages" in the JavaScript world) that your project depends on.

##### Step 1.1: Check if Node.js is Already Installed

Open your terminal and run:

```bash
$ node --version
```

**If you see a version number (like `v22.18.0`):** You already have Node.js installed. Skip to Step 1.3.

**If you see "command not found":** Continue to Step 1.2.

##### Step 1.2: Install Node.js

The recommended way to install Node.js on macOS is via the official installer:

1. Visit https://nodejs.org/
2. Download the **LTS (Long Term Support)** version (the button on the left)
3. Run the downloaded `.pkg` installer
4. Follow the installation wizard (accept defaults)

📚 **Documentation:** [Node.js Downloads](https://nodejs.org/en/download/)

🔗 **Additional Resources:**
- [Node.js Official Website](https://nodejs.org/) — The official source for Node.js downloads
- [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) — Alternative installation method that allows multiple Node versions

##### Step 1.3: Verify Node.js Installation

After installation, **close your terminal and open a new one** (this ensures your PATH is updated), then run:

```bash
$ node --version
```

**Expected Output:**
```
v22.18.0
```

💡 **Tip:** Your version might be slightly different, and that's okay. Any version 18.x or higher will work.

##### Step 1.4: Verify npm Installation

npm is automatically installed with Node.js. Verify it:

```bash
$ npm --version
```

**Expected Output:**
```
11.6.1
```

💡 **Tip:** Again, your version might differ slightly. Any version 9.x or higher will work.

📚 **Documentation:** [npm Documentation](https://docs.npmjs.com/)

---

#### Task 2: Install Xcode

**What is Xcode?**

Xcode is Apple's integrated development environment (IDE) for building macOS, iOS, iPadOS, watchOS, and tvOS applications. Even though we'll write our code in TypeScript, React Native needs Xcode's compiler and build tools to create the native macOS application.

##### Step 2.1: Check if Xcode is Already Installed

Run:

```bash
$ xcode-select -p
```

**If you see a path (like `/Applications/Xcode.app/Contents/Developer`):** Xcode is installed. Skip to Step 2.3.

**If you see "xcode-select: error: unable to get active developer directory":** Continue to Step 2.2.

##### Step 2.2: Install Xcode from the App Store

1. Open the **App Store** on your Mac
2. Search for "Xcode"
3. Click **Get** then **Install**
4. Wait for the download and installation to complete (this can take 30-60 minutes depending on your internet speed)

⚠️ **Important:** Xcode is approximately 12-15GB. Ensure you have sufficient disk space and a stable internet connection.

📚 **Documentation:** [Xcode on the App Store](https://apps.apple.com/us/app/xcode/id497799835)

##### Step 2.3: Install Xcode Command Line Tools

Even with Xcode installed, you need to explicitly install the Command Line Tools:

```bash
$ xcode-select --install
```

A dialog will appear asking you to install the tools. Click **Install** and wait for completion.

**Expected Result:** A message indicating the installation was successful.

##### Step 2.4: Accept Xcode License Agreement

The first time you use Xcode's tools, you must accept the license:

```bash
$ sudo xcodebuild -license accept
```

You'll be prompted for your password (the one you use to log into your Mac).

##### Step 2.5: Verify Xcode Installation

```bash
$ xcodebuild -version
```

**Expected Output:**
```
Xcode 16.0.1
Build version 16A1016
```

💡 **Tip:** Your version may differ. Xcode 14.0 or later is recommended for React Native macOS development.

📚 **Documentation:** [Apple Developer - Xcode](https://developer.apple.com/xcode/)

🔗 **Additional Resources:**
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) — Official React Native setup guide

---

#### Task 3: Install CocoaPods

**What is CocoaPods?**

CocoaPods is a dependency manager for Swift and Objective-C projects. In the React Native ecosystem, CocoaPods manages the native macOS/iOS libraries that React Native and its plugins depend on. Think of it as npm, but for native code.

##### Step 3.1: Check if CocoaPods is Already Installed

```bash
$ pod --version
```

**If you see a version number (like `1.15.2`):** CocoaPods is installed. Skip to Step 3.3.

**If you see "command not found":** Continue to Step 3.2.

##### Step 3.2: Install CocoaPods

CocoaPods is written in Ruby, which comes pre-installed on macOS. Install CocoaPods using:

```bash
$ sudo gem install cocoapods
```

You'll be prompted for your password.

**Expected Output (abbreviated):**
```
Fetching cocoapods-1.15.2.gem
...
Successfully installed cocoapods-1.15.2
```

⚠️ **If you encounter permission errors:**

Try this alternative approach:

```bash
$ gem install --user-install cocoapods
```

Then add Ruby gems to your PATH by adding this line to your `~/.zshrc`:

```bash
export PATH="$HOME/.gem/ruby/3.0.0/bin:$PATH"
```

(The version number `3.0.0` may vary — check with `ruby --version`)

📚 **Documentation:** [CocoaPods Getting Started](https://guides.cocoapods.org/using/getting-started.html)

##### Step 3.3: Verify CocoaPods Installation

```bash
$ pod --version
```

**Expected Output:**
```
1.15.2
```

---

#### Task 4: Verify Your Complete Development Environment

Let's run a final verification to ensure everything is properly installed.

##### Step 4.1: Create a Verification Script

Create a temporary script to check all tools at once:

```bash
$ echo "Node.js: $(node --version)" && \
  echo "npm: $(npm --version)" && \
  echo "Xcode: $(xcodebuild -version | head -1)" && \
  echo "CocoaPods: $(pod --version)"
```

**Expected Output:**
```
Node.js: v22.18.0
npm: 11.6.1
Xcode: Xcode 16.0.1
CocoaPods: 1.15.2
```

If all four lines display version numbers (yours may differ slightly), your development environment is ready!

---

### Summary & Verification

**Congratulations!** You have completed Nano Project 1: Setting Up Your Development Environment.

At this point, you should have:

- ✅ **Node.js** version 18.x or higher installed
- ✅ **npm** version 9.x or higher installed
- ✅ **Xcode** version 14.x or higher installed with Command Line Tools
- ✅ **CocoaPods** version 1.14.x or higher installed

**Verification Checklist:**

| Tool | Command | Expected |
|------|---------|----------|
| Node.js | `node --version` | v18.0.0 or higher |
| npm | `npm --version` | 9.0.0 or higher |
| Xcode | `xcodebuild -version` | Xcode 14.0 or higher |
| CocoaPods | `pod --version` | 1.14.0 or higher |

**🛠️ Troubleshooting**

If something isn't working:

1. **Node.js not found after installation:** Close and reopen your terminal. The PATH update requires a new terminal session.

2. **Xcode Command Line Tools won't install:** Try running `sudo rm -rf /Library/Developer/CommandLineTools` first, then run `xcode-select --install` again.

3. **CocoaPods permission denied:** Use the `--user-install` flag or consider using Homebrew: `brew install cocoapods`.

4. **General issues:** Restart your Mac and try the verification steps again. A fresh boot resolves many environment issues.

---

**What's Next?**

In **Nano Project 2**, you'll initialize your first React Native macOS project and understand the structure of a React Native application.

---

## Nano Project 2: Creating Your First React Native macOS Project

### Overview

Now that your development environment is ready, it's time to create your first React Native macOS project. In this Nano Project, you'll learn how to initialize a new project, understand its structure, install dependencies, and run the app for the first time.

This is where things get exciting — by the end of this Nano Project, you'll have a working macOS application!

### What You'll Have at the End

- ✅ A new React Native macOS project created and initialized
- ✅ All npm dependencies installed
- ✅ All CocoaPods dependencies installed
- ✅ A running "Hello World" macOS application
- ✅ Understanding of the project structure

### Prerequisites

- [x] Completed Nano Project 1 (all tools installed)
- [ ] A folder where you want to create your project

---

### Tasks

#### Task 1: Create the Project Directory Structure

##### Step 1.1: Navigate to Your Workspace

First, decide where you want to create your project. For this guide, we'll use a folder called `projects` in your home directory:

```bash
$ mkdir -p ~/projects
$ cd ~/projects
```

📚 **Documentation:** [Bash mkdir command](https://www.gnu.org/software/bash/manual/bash.html)

##### Step 1.2: Create the Project Folder

```bash
$ mkdir vsix-downloader-native-macos
$ cd vsix-downloader-native-macos
```

You should now be in: `~/projects/vsix-downloader-native-macos`

---

#### Task 2: Initialize a React Native Project

**What happens during initialization?**

When you initialize a React Native project, it creates a standard project structure with configuration files for TypeScript, Metro (the JavaScript bundler), and platform-specific folders for iOS, Android, or macOS.

##### Step 2.1: Initialize with npm

Create a `package.json` file, which is the manifest for your project (similar to `pom.xml` in Maven or `build.gradle` in Gradle):

```bash
$ npm init -y
```

**Expected Output:**
```json
{
  "name": "vsix-downloader-native-macos",
  "version": "1.0.0",
  "main": "index.js",
  ...
}
```

📚 **Documentation:** [npm init](https://docs.npmjs.com/cli/v10/commands/npm-init)

##### Step 2.2: Install React Native Core Dependencies

Install React, React Native, and the macOS-specific React Native package:

```bash
$ npm install react@18.2.0 react-native@0.71.0 react-native-macos@0.71.36
```

**What are these packages?**

| Package | Purpose |
|---------|---------|
| `react` | The core React library for building UI components |
| `react-native` | The framework that bridges JavaScript to native code |
| `react-native-macos` | Microsoft's fork of React Native specifically for macOS |

**Expected Output (abbreviated):**
```
added 150 packages in 30s
```

📚 **Documentation:** [React Native for macOS](https://microsoft.github.io/react-native-windows/docs/rnm-getting-started)

##### Step 2.3: Install Development Dependencies

These are tools needed during development but not shipped with the final app:

```bash
$ npm install --save-dev typescript @types/react @types/react-native @babel/core @babel/preset-env @babel/runtime metro-react-native-babel-preset
```

**What are these packages?**

| Package | Purpose |
|---------|---------|
| `typescript` | Enables TypeScript support |
| `@types/react` | TypeScript type definitions for React |
| `@types/react-native` | TypeScript type definitions for React Native |
| `@babel/core` | JavaScript compiler |
| `metro-react-native-babel-preset` | Babel configuration for React Native |

📚 **Documentation:** [TypeScript with React Native](https://reactnative.dev/docs/typescript)

---

#### Task 3: Create Configuration Files

##### Step 3.1: Create tsconfig.json

Create a TypeScript configuration file:

```bash
$ cat > tsconfig.json << 'EOF'
{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2019"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "babel.config.js", "metro.config.js"]
}
EOF
```

📚 **Documentation:** [TypeScript tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

##### Step 3.2: Create babel.config.js

Create the Babel configuration:

```bash
$ cat > babel.config.js << 'EOF'
module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
};
EOF
```

📚 **Documentation:** [Babel Configuration](https://babeljs.io/docs/configuration)

##### Step 3.3: Create metro.config.js

Metro is React Native's JavaScript bundler (like Webpack for web apps):

```bash
$ cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
    const {
        resolver: { sourceExts, assetExts },
    } = await getDefaultConfig();
    return {
        transformer: {
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: true,
                },
            }),
        },
        resolver: {
            assetExts: assetExts.filter(ext => ext !== 'svg'),
            sourceExts: [...sourceExts, 'svg'],
        },
    };
})();
EOF
```

📚 **Documentation:** [Metro Bundler](https://facebook.github.io/metro/docs/configuration)

##### Step 3.4: Create index.js (Entry Point)

This is the entry point of your application:

```bash
$ cat > index.js << 'EOF'
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './package.json';

AppRegistry.registerComponent(appName, () => App);
EOF
```

📚 **Documentation:** [React Native AppRegistry](https://reactnative.dev/docs/appregistry)

##### Step 3.5: Create App.tsx (Your First Component!)

This is where your application code lives:

```bash
$ cat > App.tsx << 'EOF'
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>VSIX Downloader</Text>
        <Text style={styles.subtitle}>Your first React Native macOS app!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});

export default App;
EOF
```

📚 **Documentation:** [React Native Components](https://reactnative.dev/docs/intro-react-native-components)

---

#### Task 4: Initialize macOS-Specific Files

##### Step 4.1: Install the macOS Init Tool

```bash
$ npm install --save-dev react-native-macos-init
```

##### Step 4.2: Run macOS Initialization

This command creates the `macos/` folder with all the Xcode project files:

```bash
$ npx react-native-macos-init
```

**Expected Output:**
```
info Generating macos project...
info Installing pods...
success Generated macos project
```

💡 **Tip:** If this command fails with permission errors, try: `./node_modules/.bin/react-native-macos-init`

📚 **Documentation:** [react-native-macos-init](https://github.com/nickreynolds/react-native-macos-init)

##### Step 4.3: Update package.json Scripts

Open `package.json` and add these scripts (or create the file fresh):

```json
{
  "name": "vsix-downloader-native-macos",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "react-native start",
    "macos": "react-native run-macos"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.71.0",
    "react-native-macos": "^0.71.36"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "@babel/runtime": "^7.20.0",
    "@types/react": "^18.0.24",
    "metro-react-native-babel-preset": "0.73.9",
    "react-native-macos-init": "^2.1.3",
    "typescript": "4.8.4"
  }
}
```

---

#### Task 5: Install CocoaPods Dependencies

##### Step 5.1: Navigate to the macos Folder

```bash
$ cd macos
```

##### Step 5.2: Install Pods

```bash
$ pod install
```

**Expected Output:**
```
Analyzing dependencies
Downloading dependencies
Installing boost (1.76.0)
Installing React-Core (0.71.0)
...
Pod installation complete!
```

⚠️ **This may take several minutes** on the first run as it downloads many native dependencies.

##### Step 5.3: Return to Project Root

```bash
$ cd ..
```

📚 **Documentation:** [CocoaPods pod install](https://guides.cocoapods.org/using/pod-install-vs-update.html)

---

#### Task 6: Run Your First React Native macOS App!

##### Step 6.1: Start the Metro Bundler

In one terminal window, start Metro (this must keep running):

```bash
$ npm start
```

**Expected Output:**
```
               ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
             ▄▀░░░░░░░░░░░░░░░▀▄
            ▐░░░░░░░░░░░░░░░░░░░▐
           ▐░░░░░░░░░░░░░░░░░░░░░▐
           ▐░░░░░░░░░░░░░░░░░░░░░░▐
            ▀▄░░░░░░░░░░░░░░░░░░▄▀
              ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  info Metro waiting on exp://...
```

##### Step 6.2: Run the macOS App

Open a **new terminal window** (keep Metro running in the first one), navigate to your project, and run:

```bash
$ npm run macos
```

**What happens:**
1. Xcode compiles the native macOS code
2. The app launches on your Mac
3. You should see "VSIX Downloader" and "Your first React Native macOS app!"

⚠️ **First build takes time:** The initial build may take 5-10 minutes as Xcode compiles all native dependencies. Subsequent builds are much faster.

📚 **Documentation:** [Running On Device](https://reactnative.dev/docs/running-on-device)

---

### Summary & Verification

**Congratulations!** You have completed Nano Project 2: Creating Your First React Native macOS Project.

At this point, you should have:

- ✅ A complete React Native macOS project structure
- ✅ All npm dependencies installed in `node_modules/`
- ✅ All CocoaPods installed in `macos/Pods/`
- ✅ A running macOS application showing "VSIX Downloader"

**Project Structure:**
```
vsix-downloader-native-macos/
├── App.tsx              # Your React component
├── index.js             # Entry point
├── package.json         # Project manifest
├── package-lock.json    # Locked dependencies
├── tsconfig.json        # TypeScript config
├── babel.config.js      # Babel config
├── metro.config.js      # Metro bundler config
├── node_modules/        # npm packages
└── macos/               # macOS-specific code
    ├── Podfile          # CocoaPods manifest
    ├── Podfile.lock     # Locked pod versions
    └── Pods/            # Native dependencies
```

**Verification Checklist:**

| Check | How to Verify |
|-------|---------------|
| Metro runs | `npm start` shows Metro UI |
| App builds | `npm run macos` opens app window |
| App displays | Window shows "VSIX Downloader" |

**🛠️ Troubleshooting**

1. **"Unable to find Xcode project":** Run `npx react-native-macos-init` again.

2. **Pod install fails:** Try `cd macos && pod repo update && pod install`.

3. **Metro bundler crashes:** Delete `node_modules` and run `npm install` again.

4. **App won't build:** Open `macos/vsix-downloader-native-macos.xcworkspace` in Xcode and check for errors.

---

**What's Next?**

In **Nano Project 3**, you'll build a modular architecture with utility functions, implement the core download logic, and add a progress indicator.

---

## Nano Project 3: Building a Modular Architecture with Core Download Logic

### Overview

Now that you have a running React Native macOS app, it's time to build real functionality. In this Nano Project, you'll learn a fundamental software engineering principle: **separation of concerns**. Instead of putting all your code in one file, you'll create dedicated modules for specific tasks.

You'll create:
- A **URL parsing utility** that validates and extracts information from Marketplace URLs
- A **download utility** that handles file downloads with progress tracking
- A **settings hook** for managing user preferences with persistence
- A **Settings page component** for configuring the download location

This modular approach makes your code easier to test, maintain, and extend.

### What You'll Have at the End

- ✅ A `src/utils/marketplace.ts` module for URL parsing and validation
- ✅ A `src/utils/downloader.ts` module for file download operations
- ✅ A `src/hooks/useAppSettings.ts` custom hook for settings management
- ✅ A `src/components/SettingsPage.tsx` component for user preferences
- ✅ A visual download progress bar with percentage
- ✅ Robust error handling with user-friendly messages

### Prerequisites

- [x] Completed Nano Project 2 (running React Native macOS app)
- [ ] Understanding of TypeScript basics (interfaces, types, async/await)

---

### Tasks

#### Task 1: Create the Project Structure

**Why organize code into folders?**

As your app grows, having all code in one file becomes unmanageable. A common React Native pattern is:
- `src/utils/` — Pure utility functions (no React dependencies)
- `src/hooks/` — Custom React hooks
- `src/components/` — Reusable UI components

##### Step 1.1: Create the Directory Structure

```bash
$ mkdir -p src/utils src/hooks src/components
```

**Expected Result:** Three new folders inside your project:
```
vsix-downloader-native-macos/
├── src/
│   ├── utils/
│   ├── hooks/
│   └── components/
├── App.tsx
└── ...
```

📚 **Documentation:** [React Native Project Structure Best Practices](https://reactnative.dev/docs/typescript#using-custom-path-aliases-with-typescript)

---

#### Task 2: Create the Marketplace URL Parser

This module handles all the logic for parsing VS Code Marketplace URLs and constructing download links.

##### Step 2.1: Create marketplace.ts

Create the file `src/utils/marketplace.ts`:

```typescript
/**
 * marketplace.ts
 * 
 * Utility functions for parsing and validating VS Code Marketplace URLs
 * and constructing download links.
 */

// --- Type Definitions ---

export interface ExtensionInfo {
  publisher: string;
  extensionName: string;
  itemName: string; // Combined: publisher.extensionName
}

export interface ExtensionDetails extends ExtensionInfo {
  version: string;
  downloadUrl: string;
}

export interface ParseResult {
  success: boolean;
  data?: ExtensionInfo;
  error?: string;
}

// --- Constants ---
const MARKETPLACE_DOMAIN = 'marketplace.visualstudio.com';
const MARKETPLACE_API_BASE = 'https://marketplace.visualstudio.com/_apis/public/gallery';

// --- URL Validation ---

/**
 * Validates that a URL is a proper VS Code Marketplace URL
 */
export function isValidMarketplaceUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  const trimmedUrl = url.trim().toLowerCase();
  return trimmedUrl.includes(MARKETPLACE_DOMAIN) && 
         trimmedUrl.includes('/items') && 
         trimmedUrl.includes('itemname=');
}

/**
 * Parses a VS Code Marketplace URL and extracts extension information
 */
export function parseMarketplaceUrl(url: string): ParseResult {
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return { success: false, error: 'Please enter a URL.' };
  }
  
  if (!isValidMarketplaceUrl(trimmedUrl)) {
    return {
      success: false,
      error: 'Not a valid VS Code Marketplace URL. Expected format: https://marketplace.visualstudio.com/items?itemName=publisher.extension',
    };
  }
  
  // Extract itemName from query string
  const queryString = trimmedUrl.split('?')[1];
  const params = new URLSearchParams(queryString);
  const itemName = params.get('itemName');
  
  if (!itemName || !itemName.includes('.')) {
    return { success: false, error: 'Invalid extension identifier format.' };
  }
  
  const parts = itemName.split('.');
  const publisher = parts[0];
  const extensionName = parts.slice(1).join('.');
  
  return {
    success: true,
    data: { publisher, extensionName, itemName },
  };
}

/**
 * Fetches the extension version from the marketplace page
 */
export async function fetchExtensionVersion(url: string): Promise<{
  success: boolean;
  version?: string;
  error?: string;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    });
    
    if (!response.ok) {
      return {
        success: false,
        error: response.status === 404 
          ? 'Extension not found.' 
          : `HTTP error ${response.status}`,
      };
    }
    
    const pageContent = await response.text();
    const versionMatch = pageContent.match(/"version"\s*:\s*"([\d.]+)"/);
    
    if (!versionMatch) {
      return { success: false, error: 'Could not find version information.' };
    }
    
    return { success: true, version: versionMatch[1] };
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown'}`,
    };
  }
}

/**
 * Constructs the direct download URL for a VSIX file
 */
export function buildDownloadUrl(
  publisher: string, 
  extensionName: string, 
  version: string
): string {
  return `${MARKETPLACE_API_BASE}/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage`;
}

/**
 * Generates a filename for the downloaded VSIX
 */
export function generateFileName(extensionName: string, version: string): string {
  return `${extensionName}-${version}.vsix`;
}
```

📚 **Documentation:** 
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

🔗 **Additional Resources:**
- [VS Code Marketplace API](https://github.com/nickmomrik/vsce#publishing-extensions) — Understanding the Marketplace structure

---

#### Task 3: Create the Download Utility

This module handles file downloads with progress tracking using `react-native-fs`.

##### Step 3.1: Install react-native-fs

If you haven't already:

```bash
$ npm install react-native-fs
$ cd macos && pod install && cd ..
```

##### Step 3.2: Create downloader.ts

Create the file `src/utils/downloader.ts`:

```typescript
/**
 * downloader.ts
 * 
 * Utility functions for downloading files using react-native-fs
 */

import RNFS from 'react-native-fs';

// --- Type Definitions ---

export interface DownloadProgress {
  bytesWritten: number;
  contentLength: number;
  percentage: number;
}

export interface DownloadOptions {
  url: string;
  fileName: string;
  downloadPath?: string;
  onBegin?: () => void;
  onProgress?: (progress: DownloadProgress) => void;
}

export interface DownloadResult {
  success: boolean;
  filePath?: string;
  fileSize?: number;
  error?: string;
}

// --- Path Utilities ---

/**
 * Gets the default download directory for macOS
 */
export function getDefaultDownloadPath(): string {
  return RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath;
}

/**
 * Checks if a file exists at the given path
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    return await RNFS.exists(filePath);
  } catch {
    return false;
  }
}

// --- Download Function ---

/**
 * Downloads a file from URL to the specified location
 */
export async function downloadFile(options: DownloadOptions): Promise<DownloadResult> {
  const { url, fileName, downloadPath, onBegin, onProgress } = options;
  
  try {
    const directory = downloadPath || getDefaultDownloadPath();
    const filePath = `${directory}/${fileName}`;
    
    const downloadResult = RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      begin: () => onBegin?.(),
      progress: (res) => {
        const percentage = res.contentLength > 0
          ? Math.round((res.bytesWritten / res.contentLength) * 100)
          : 0;
        onProgress?.({
          bytesWritten: res.bytesWritten,
          contentLength: res.contentLength,
          percentage,
        });
      },
      progressDivider: 5,
    });
    
    const result = await downloadResult.promise;
    
    if (result.statusCode === 200) {
      const stat = await RNFS.stat(filePath);
      return { success: true, filePath, fileSize: stat.size };
    }
    
    return {
      success: false,
      error: `Download failed with HTTP ${result.statusCode}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Download failed',
    };
  }
}

/**
 * Formats bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}
```

📚 **Documentation:** [react-native-fs](https://github.com/itinance/react-native-fs)

💡 **Key Concept: Callbacks for Progress**

Notice the `onProgress` callback pattern. This is how we pass real-time progress updates from the utility back to the UI. The utility doesn't know anything about React — it just calls the callback with data.

---

#### Task 4: Create the Settings Hook

Custom hooks are a powerful React pattern for encapsulating stateful logic.

##### Step 4.1: Create useAppSettings.ts

Create the file `src/hooks/useAppSettings.ts`:

```typescript
/**
 * useAppSettings.ts
 * 
 * Custom hook for managing application settings with persistence
 */

import { useState, useEffect, useCallback } from 'react';
import RNFS from 'react-native-fs';

// --- Type Definitions ---

export interface AppSettings {
  downloadPath: string;
  theme: 'light' | 'dark' | 'system';
  autoOpenAfterDownload: boolean;
  confirmBeforeDownload: boolean;
}

const SETTINGS_FILE = `${RNFS.DocumentDirectoryPath}/vsix-downloader-settings.json`;

function getDefaultSettings(): AppSettings {
  return {
    downloadPath: RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath,
    theme: 'light',
    autoOpenAfterDownload: false,
    confirmBeforeDownload: false,
  };
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from file
  const loadSettings = useCallback(async () => {
    try {
      const exists = await RNFS.exists(SETTINGS_FILE);
      if (exists) {
        const content = await RNFS.readFile(SETTINGS_FILE, 'utf8');
        const parsed = JSON.parse(content);
        setSettings({ ...getDefaultSettings(), ...parsed });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to file
  const saveSettings = useCallback(async (newSettings: AppSettings) => {
    try {
      await RNFS.writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, []);

  // Update a single setting
  const updateSetting = useCallback(async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Reset to defaults
  const resetSettings = useCallback(async () => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    await saveSettings(defaults);
  }, [saveSettings]);

  // Load on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return { settings, isLoading, updateSetting, resetSettings };
}
```

📚 **Documentation:** 
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [useCallback](https://react.dev/reference/react/useCallback)

💡 **Key Concept: Why Custom Hooks?**

Custom hooks let you extract component logic into reusable functions. The `useAppSettings` hook handles:
1. Loading settings from disk
2. Saving settings to disk
3. Providing settings to components
4. Resetting to defaults

Any component can use `const { settings } = useAppSettings()` to access the settings.

---

#### Task 5: Create the Settings Page Component

##### Step 5.1: Create SettingsPage.tsx

Create `src/components/SettingsPage.tsx`. This component allows users to configure their download location.

```typescript
/**
 * SettingsPage.tsx
 * 
 * Settings page component for configuring download preferences
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { AppSettings } from '../hooks/useAppSettings';
import { getDefaultDownloadPath } from '../utils/downloader';

interface SettingsPageProps {
  isDark: boolean;
  settings: AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  onResetSettings: () => Promise<void>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isDark,
  settings,
  onUpdateSetting,
  onResetSettings,
}) => {
  const [downloadPath, setDownloadPath] = useState(settings.downloadPath);

  // Sync local state with props
  useEffect(() => {
    setDownloadPath(settings.downloadPath);
  }, [settings.downloadPath]);

  const handleSavePath = async () => {
    await onUpdateSetting('downloadPath', downloadPath);
  };

  const handleResetToDefault = async () => {
    const defaultPath = getDefaultDownloadPath();
    setDownloadPath(defaultPath);
    await onUpdateSetting('downloadPath', defaultPath);
  };

  // Dynamic styles based on theme
  const containerStyle = [
    styles.container,
    isDark ? styles.containerDark : styles.containerLight,
  ];

  return (
    <ScrollView style={containerStyle}>
      <Text style={[styles.title, isDark && styles.textDark]}>Settings</Text>

      {/* Download Location */}
      <View style={[styles.section, isDark && styles.sectionDark]}>
        <Text style={[styles.label, isDark && styles.textDark]}>
          Download Location
        </Text>
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          Where VSIX files will be saved. Default is ~/Downloads.
        </Text>
        
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={downloadPath}
          onChangeText={setDownloadPath}
          placeholder="/path/to/downloads"
        />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleResetToDefault}>
            <Text style={styles.secondaryButtonText}>Reset to Default</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSavePath}>
            <Text style={styles.primaryButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferences */}
      <View style={[styles.section, isDark && styles.sectionDark]}>
        <Text style={[styles.label, isDark && styles.textDark]}>Preferences</Text>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, isDark && styles.textDark]}>
            Confirm Before Download
          </Text>
          <Switch
            value={settings.confirmBeforeDownload}
            onValueChange={(v) => onUpdateSetting('confirmBeforeDownload', v)}
            trackColor={{ true: '#4f46e5' }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  containerLight: { backgroundColor: '#f3f4f6' },
  containerDark: { backgroundColor: '#111827' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 20, color: '#111' },
  textDark: { color: '#f9fafb' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionDark: { backgroundColor: '#1f2937', borderColor: '#374151' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#111' },
  description: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  descriptionDark: { color: '#9ca3af' },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    color: '#111',
  },
  inputDark: { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f9fafb' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  primaryButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
  secondaryButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: '#374151', fontWeight: '600' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLabel: { fontSize: 15, color: '#111' },
});

export default SettingsPage;
```

📚 **Documentation:** [React Native Switch](https://reactnative.dev/docs/switch)

---

#### Task 6: Update App.tsx to Use the New Modules

Now integrate everything into your main App.tsx. The key changes:

1. Import the new utilities and components
2. Add a "Settings" navigation button
3. Use `useAppSettings` hook for settings management
4. Add a progress bar component
5. Use the modular download flow

##### Step 6.1: Key Imports

At the top of your `App.tsx`:

```typescript
// Utilities
import { getExtensionDetails, generateFileName } from './src/utils/marketplace';
import { downloadFile, formatFileSize, DownloadProgress } from './src/utils/downloader';
import { useAppSettings } from './src/hooks/useAppSettings';

// Components
import { SettingsPage } from './src/components/SettingsPage';
```

##### Step 6.2: Add Progress Bar

Add a progress bar component to show download progress:

```typescript
{/* Progress Bar */}
{message.type === 'progress' && typeof message.progress === 'number' && (
  <View style={styles.progressContainer}>
    <View style={styles.progressBar}>
      <View 
        style={[styles.progressFill, { width: `${message.progress}%` }]} 
      />
    </View>
    <Text style={styles.progressText}>{message.progress}%</Text>
  </View>
)}
```

With styles:

```typescript
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
},
```

📚 **Documentation:** [React Native Styling](https://reactnative.dev/docs/style)

---

### Summary & Verification

**Congratulations!** You have completed Nano Project 3: Building a Modular Architecture with Core Download Logic.

At this point, you should have:

- ✅ `src/utils/marketplace.ts` — URL parsing and validation
- ✅ `src/utils/downloader.ts` — File download with progress
- ✅ `src/hooks/useAppSettings.ts` — Settings management
- ✅ `src/components/SettingsPage.tsx` — Settings UI
- ✅ A working progress bar during downloads
- ✅ Configurable download location

**Updated Project Structure:**
```
vsix-downloader-native-macos/
├── App.tsx
├── index.js
├── src/
│   ├── utils/
│   │   ├── marketplace.ts    # URL parsing
│   │   └── downloader.ts     # File downloads
│   ├── hooks/
│   │   └── useAppSettings.ts # Settings hook
│   └── components/
│       └── SettingsPage.tsx  # Settings UI
├── macos/
└── ...
```

**Verification Checklist:**

| Feature | How to Test |
|---------|-------------|
| URL validation | Enter invalid URL → Should show error |
| URL parsing | Enter valid URL → Should extract publisher/extension |
| Download progress | Start download → Should show progress bar |
| Settings page | Click Settings icon → Should show preferences |
| Save path | Change path in settings → Should persist after restart |

**🛠️ Troubleshooting**

1. **Import errors:** Make sure file paths match exactly. TypeScript is case-sensitive.

2. **Settings not persisting:** Check that `RNFS.DocumentDirectoryPath` is accessible.

3. **Progress not updating:** Ensure `progressDivider` is set in download options.

4. **Download fails:** Check network connectivity and URL validity.

---

**What's Next?**

In **Nano Project 4**, you'll polish the UI with proper icons, refine the dark mode, and add the finishing touches before testing and building for distribution.

---

*More Nano Projects coming as we complete each phase...*


