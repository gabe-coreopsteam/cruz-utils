#!/bin/bash

# 1. Install dependencies (using a temp cache to avoid permission issues if needed)
echo "Installing dependencies..."
npm install --cache /tmp/npm-cache

# 2. Install the init script helper
echo "Installing react-native-macos-init..."
npm install --save-dev react-native-macos-init --cache /tmp/npm-cache

# 3. Initialize the macOS project
# We use npx here, but since it's installed locally, it should work. 
# If it fails due to permissions, the user might need to run this manually.
echo "Initializing macOS project..."
./node_modules/.bin/react-native-macos-init --overwrite

# 4. Install Pods
if [ -d "macos" ]; then
    echo "Installing CocoaPods..."
    cd macos && pod install && cd ..
else
    echo "Error: 'macos' directory was not created. Please run 'npx react-native-macos-init' manually."
fi

echo "Setup complete. Run 'npm run macos' to start the app."
