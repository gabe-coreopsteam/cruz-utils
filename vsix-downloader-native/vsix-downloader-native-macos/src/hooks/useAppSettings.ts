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

export interface UseAppSettingsReturn {
  settings: AppSettings;
  isLoading: boolean;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  resetSettings: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

// --- Constants ---

const SETTINGS_FILE_NAME = 'vsix-downloader-settings.json';

/**
 * Gets the settings file path
 */
function getSettingsFilePath(): string {
  // Store settings in the app's document directory
  return `${RNFS.DocumentDirectoryPath}/${SETTINGS_FILE_NAME}`;
}

/**
 * Default settings
 */
function getDefaultSettings(): AppSettings {
  return {
    downloadPath: RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath,
    theme: 'light',
    autoOpenAfterDownload: false,
    confirmBeforeDownload: false,
  };
}

// --- Hook Implementation ---

export function useAppSettings(): UseAppSettingsReturn {
  const [settings, setSettings] = useState<AppSettings>(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Loads settings from file
   */
  const loadSettings = useCallback(async (): Promise<AppSettings> => {
    try {
      const filePath = getSettingsFilePath();
      const exists = await RNFS.exists(filePath);
      
      if (!exists) {
        return getDefaultSettings();
      }
      
      const content = await RNFS.readFile(filePath, 'utf8');
      const parsed = JSON.parse(content) as Partial<AppSettings>;
      
      // Merge with defaults to ensure all keys exist
      return {
        ...getDefaultSettings(),
        ...parsed,
      };
    } catch (error) {
      console.error('[Settings] Error loading settings:', error);
      return getDefaultSettings();
    }
  }, []);

  /**
   * Saves settings to file
   */
  const saveSettings = useCallback(async (newSettings: AppSettings): Promise<void> => {
    try {
      const filePath = getSettingsFilePath();
      const content = JSON.stringify(newSettings, null, 2);
      await RNFS.writeFile(filePath, content, 'utf8');
      console.log('[Settings] Settings saved successfully');
    } catch (error) {
      console.error('[Settings] Error saving settings:', error);
      throw error;
    }
  }, []);

  /**
   * Updates a single setting
   */
  const updateSetting = useCallback(async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> => {
    const newSettings = {
      ...settings,
      [key]: value,
    };
    
    setSettings(newSettings);
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  /**
   * Resets all settings to defaults
   */
  const resetSettings = useCallback(async (): Promise<void> => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    await saveSettings(defaults);
  }, [saveSettings]);

  /**
   * Refreshes settings from file
   */
  const refreshSettings = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings);
    } finally {
      setIsLoading(false);
    }
  }, [loadSettings]);

  // Load settings on mount
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return {
    settings,
    isLoading,
    updateSetting,
    resetSettings,
    refreshSettings,
  };
}

// --- Validation Utilities ---

/**
 * Validates a download path
 */
export async function validateDownloadPath(path: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  if (!path || path.trim() === '') {
    return {
      valid: false,
      error: 'Path cannot be empty.',
    };
  }
  
  try {
    const exists = await RNFS.exists(path);
    if (!exists) {
      return {
        valid: false,
        error: 'Directory does not exist.',
      };
    }
    
    const stat = await RNFS.stat(path);
    if (!stat.isDirectory()) {
      return {
        valid: false,
        error: 'Path is not a directory.',
      };
    }
    
    // TODO: Check write permissions (platform-specific)
    
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Unable to access directory.',
    };
  }
}

