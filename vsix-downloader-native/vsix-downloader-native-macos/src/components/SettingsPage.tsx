/**
 * SettingsPage.tsx
 * 
 * Settings page component for configuring download location and preferences
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
import { AppSettings, validateDownloadPath } from '../hooks/useAppSettings';
import { getDefaultDownloadPath } from '../utils/downloader';

// --- Type Definitions ---

interface SettingsPageProps {
  isDark: boolean;
  settings: AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  onResetSettings: () => Promise<void>;
}

interface PathValidation {
  isValid: boolean;
  message: string;
}

// --- Component ---

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isDark,
  settings,
  onUpdateSetting,
  onResetSettings,
}) => {
  const [downloadPath, setDownloadPath] = useState(settings.downloadPath);
  const [pathValidation, setPathValidation] = useState<PathValidation>({ isValid: true, message: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when settings change
  useEffect(() => {
    setDownloadPath(settings.downloadPath);
  }, [settings.downloadPath]);

  // Validate path when it changes
  useEffect(() => {
    const validatePath = async () => {
      if (downloadPath === settings.downloadPath) {
        setPathValidation({ isValid: true, message: '' });
        return;
      }

      const result = await validateDownloadPath(downloadPath);
      if (result.valid) {
        setPathValidation({ isValid: true, message: 'Path is valid ✓' });
      } else {
        setPathValidation({ isValid: false, message: result.error || 'Invalid path' });
      }
    };

    const debounce = setTimeout(validatePath, 500);
    return () => clearTimeout(debounce);
  }, [downloadPath, settings.downloadPath]);

  // Handle path save
  const handleSavePath = async () => {
    if (!pathValidation.isValid || downloadPath === settings.downloadPath) {
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateSetting('downloadPath', downloadPath);
      setPathValidation({ isValid: true, message: 'Saved ✓' });
    } catch (error) {
      setPathValidation({ isValid: false, message: 'Failed to save' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reset to defaults
  const handleResetToDefault = async () => {
    const defaultPath = getDefaultDownloadPath();
    setDownloadPath(defaultPath);
    await onUpdateSetting('downloadPath', defaultPath);
  };

  // Styles based on theme
  const containerStyle = [
    styles.container,
    isDark ? styles.containerDark : styles.containerLight,
  ];
  const titleStyle = [styles.title, isDark ? styles.textDark : styles.textLight];
  const labelStyle = [styles.label, isDark ? styles.textDark : styles.textLight];
  const descriptionStyle = [styles.description, isDark ? styles.descriptionDark : styles.descriptionLight];
  const inputStyle = [
    styles.input,
    isDark ? styles.inputDark : styles.inputLight,
    !pathValidation.isValid && styles.inputError,
  ];
  const sectionStyle = [
    styles.section,
    isDark ? styles.sectionDark : styles.sectionLight,
  ];

  return (
    <ScrollView style={containerStyle}>
      <Text style={titleStyle}>Settings</Text>

      {/* Download Location Section */}
      <View style={sectionStyle}>
        <Text style={labelStyle}>Download Location</Text>
        <Text style={descriptionStyle}>
          Specify where VSIX files should be saved. Default is ~/Downloads.
        </Text>
        
        <TextInput
          style={inputStyle}
          value={downloadPath}
          onChangeText={setDownloadPath}
          placeholder="/path/to/downloads"
          placeholderTextColor={isDark ? '#666' : '#999'}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {pathValidation.message ? (
          <Text style={[
            styles.validationMessage,
            pathValidation.isValid ? styles.validationSuccess : styles.validationError,
          ]}>
            {pathValidation.message}
          </Text>
        ) : null}
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, isDark && styles.secondaryButtonDark]}
            onPress={handleResetToDefault}
          >
            <Text style={[styles.secondaryButtonText, isDark && styles.secondaryButtonTextDark]}>
              Reset to Default
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!pathValidation.isValid || downloadPath === settings.downloadPath) && styles.buttonDisabled,
            ]}
            onPress={handleSavePath}
            disabled={!pathValidation.isValid || downloadPath === settings.downloadPath || isSaving}
          >
            <Text style={styles.primaryButtonText}>
              {isSaving ? 'Saving...' : 'Save Path'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={sectionStyle}>
        <Text style={labelStyle}>Preferences</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, isDark ? styles.textDark : styles.textLight]}>
              Confirm Before Download
            </Text>
            <Text style={descriptionStyle}>
              Show a confirmation dialog before starting each download
            </Text>
          </View>
          <Switch
            value={settings.confirmBeforeDownload}
            onValueChange={(value) => onUpdateSetting('confirmBeforeDownload', value)}
            trackColor={{ false: '#767577', true: '#4f46e5' }}
            thumbColor={settings.confirmBeforeDownload ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, isDark ? styles.textDark : styles.textLight]}>
              Open Folder After Download
            </Text>
            <Text style={descriptionStyle}>
              Automatically open the download folder when complete
            </Text>
          </View>
          <Switch
            value={settings.autoOpenAfterDownload}
            onValueChange={(value) => onUpdateSetting('autoOpenAfterDownload', value)}
            trackColor={{ false: '#767577', true: '#4f46e5' }}
            thumbColor={settings.autoOpenAfterDownload ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* About Section */}
      <View style={sectionStyle}>
        <Text style={labelStyle}>About</Text>
        <Text style={descriptionStyle}>
          VSIX Downloader v0.1.0{'\n'}
          A CruzUtils tool for the DevOps community{'\n'}
          MIT License
        </Text>
        
        <TouchableOpacity
          style={[styles.dangerButton]}
          onPress={onResetSettings}
        >
          <Text style={styles.dangerButtonText}>Reset All Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerLight: {
    backgroundColor: '#f3f4f6',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  textLight: {
    color: '#111827',
  },
  textDark: {
    color: '#f9fafb',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionLight: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
  },
  sectionDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  descriptionLight: {
    color: '#6b7280',
  },
  descriptionDark: {
    color: '#9ca3af',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: 'Menlo',
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
  inputError: {
    borderColor: '#ef4444',
  },
  validationMessage: {
    fontSize: 12,
    marginTop: 4,
  },
  validationSuccess: {
    color: '#10b981',
  },
  validationError: {
    color: '#ef4444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonDark: {
    backgroundColor: '#374151',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonTextDark: {
    color: '#d1d5db',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  dangerButton: {
    height: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  dangerButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SettingsPage;

