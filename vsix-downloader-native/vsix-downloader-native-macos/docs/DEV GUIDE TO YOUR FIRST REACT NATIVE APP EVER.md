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

In **Nano Project 3**, you'll build the user interface for the VSIX Downloader, including the sidebar navigation, input fields, and theme switching.

---

*More Nano Projects coming as we build each phase...*


