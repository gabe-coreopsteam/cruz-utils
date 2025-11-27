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
  downloadPath?: string; // Optional custom path, defaults to Downloads
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
 * Falls back to DocumentDirectoryPath if DownloadDirectoryPath is not available
 */
export function getDefaultDownloadPath(): string {
  // RNFS.DownloadDirectoryPath points to ~/Downloads on macOS
  // RNFS.DocumentDirectoryPath is a fallback (app's Documents folder)
  return RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath;
}

/**
 * Validates that a directory exists and is writable
 */
export async function validateDirectory(path: string): Promise<boolean> {
  try {
    const exists = await RNFS.exists(path);
    if (!exists) {
      return false;
    }
    
    // Try to get directory info to verify it's accessible
    const stat = await RNFS.stat(path);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Ensures a directory exists, creating it if necessary
 */
export async function ensureDirectory(path: string): Promise<boolean> {
  try {
    const exists = await RNFS.exists(path);
    if (!exists) {
      await RNFS.mkdir(path);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a file already exists at the given path
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    return await RNFS.exists(filePath);
  } catch {
    return false;
  }
}

/**
 * Generates a unique filename if the file already exists
 * e.g., "file.vsix" -> "file (1).vsix" -> "file (2).vsix"
 */
export async function getUniqueFilePath(
  directory: string,
  baseFileName: string
): Promise<string> {
  const basePath = `${directory}/${baseFileName}`;
  
  if (!(await fileExists(basePath))) {
    return basePath;
  }
  
  // File exists, generate a unique name
  const extensionIndex = baseFileName.lastIndexOf('.');
  const nameWithoutExt = extensionIndex > 0 
    ? baseFileName.substring(0, extensionIndex)
    : baseFileName;
  const extension = extensionIndex > 0 
    ? baseFileName.substring(extensionIndex)
    : '';
  
  let counter = 1;
  let uniquePath: string;
  
  do {
    uniquePath = `${directory}/${nameWithoutExt} (${counter})${extension}`;
    counter++;
  } while (await fileExists(uniquePath) && counter < 100);
  
  return uniquePath;
}

// --- Download Functions ---

/**
 * Downloads a file from URL to the specified location
 */
export async function downloadFile(options: DownloadOptions): Promise<DownloadResult> {
  const {
    url,
    fileName,
    downloadPath,
    onBegin,
    onProgress,
  } = options;
  
  try {
    // Determine destination directory
    const directory = downloadPath || getDefaultDownloadPath();
    
    // Validate directory exists
    const dirValid = await validateDirectory(directory);
    if (!dirValid) {
      return {
        success: false,
        error: `Download directory does not exist or is not accessible: ${directory}`,
      };
    }
    
    // Get unique file path (handle existing files)
    const filePath = await getUniqueFilePath(directory, fileName);
    
    // Configure download
    const downloadConfig: RNFS.DownloadFileOptions = {
      fromUrl: url,
      toFile: filePath,
      begin: (res) => {
        console.log('[Downloader] Download started:', {
          statusCode: res.statusCode,
          contentLength: res.contentLength,
          headers: res.headers,
        });
        onBegin?.();
      },
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
      progressDivider: 5, // Report progress every 5%
    };
    
    // Start download
    const downloadResult = RNFS.downloadFile(downloadConfig);
    const result = await downloadResult.promise;
    
    // Check result
    if (result.statusCode === 200) {
      // Verify file was created
      const exists = await fileExists(filePath);
      if (!exists) {
        return {
          success: false,
          error: 'Download completed but file was not found on disk.',
        };
      }
      
      // Get file size
      const stat = await RNFS.stat(filePath);
      
      return {
        success: true,
        filePath,
        fileSize: stat.size,
      };
    } else if (result.statusCode === 404) {
      return {
        success: false,
        error: 'Extension not found at the download URL. It may have been removed or the version is incorrect.',
      };
    } else if (result.statusCode === 403) {
      return {
        success: false,
        error: 'Access denied. The extension may require authentication or is not publicly available.',
      };
    } else {
      return {
        success: false,
        error: `Download failed with HTTP status ${result.statusCode}.`,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Downloader] Download error:', error);
    
    return {
      success: false,
      error: `Download failed: ${errorMessage}`,
    };
  }
}

/**
 * Cancels an ongoing download (if you need to implement this)
 * Note: RNFS.downloadFile returns a job ID that can be used with RNFS.stopDownload
 */
export function cancelDownload(jobId: number): void {
  try {
    RNFS.stopDownload(jobId);
    console.log('[Downloader] Download cancelled:', jobId);
  } catch (error) {
    console.error('[Downloader] Error cancelling download:', error);
  }
}

// --- File Size Formatting ---

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

