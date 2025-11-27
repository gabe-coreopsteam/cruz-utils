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

export interface VersionResult {
  success: boolean;
  version?: string;
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
  
  // Check if it contains the marketplace domain
  if (!trimmedUrl.includes(MARKETPLACE_DOMAIN)) {
    return false;
  }
  
  // Check if it has the items path
  if (!trimmedUrl.includes('/items')) {
    return false;
  }
  
  // Check if it has an itemName parameter
  if (!trimmedUrl.includes('itemname=')) {
    return false;
  }
  
  return true;
}

/**
 * Extracts the itemName parameter from a marketplace URL
 */
export function extractItemName(url: string): string | null {
  try {
    // Handle both URL formats:
    // 1. Full URL: https://marketplace.visualstudio.com/items?itemName=publisher.extension
    // 2. With additional params: https://marketplace.visualstudio.com/items?itemName=publisher.extension&other=param
    
    const queryString = url.split('?')[1];
    if (!queryString) {
      return null;
    }
    
    // Use URLSearchParams for robust parsing
    const params = new URLSearchParams(queryString);
    const itemName = params.get('itemName');
    
    return itemName;
  } catch {
    return null;
  }
}

/**
 * Validates the itemName format (publisher.extensionName)
 */
export function isValidItemName(itemName: string): boolean {
  if (!itemName || typeof itemName !== 'string') {
    return false;
  }
  
  // Must contain exactly one dot separating publisher and extension name
  const parts = itemName.split('.');
  if (parts.length < 2) {
    return false;
  }
  
  const publisher = parts[0];
  const extensionName = parts.slice(1).join('.'); // Handle extension names with dots
  
  // Both must be non-empty
  if (!publisher || !extensionName) {
    return false;
  }
  
  // Basic character validation (alphanumeric, hyphens, underscores)
  const validPattern = /^[a-zA-Z0-9\-_]+$/;
  if (!validPattern.test(publisher)) {
    return false;
  }
  
  return true;
}

// --- URL Parsing ---

/**
 * Parses a VS Code Marketplace URL and extracts extension information
 */
export function parseMarketplaceUrl(url: string): ParseResult {
  // Trim and validate
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return {
      success: false,
      error: 'Please enter a URL.',
    };
  }
  
  // Validate it's a marketplace URL
  if (!isValidMarketplaceUrl(trimmedUrl)) {
    return {
      success: false,
      error: 'Not a valid VS Code Marketplace URL. Expected format: https://marketplace.visualstudio.com/items?itemName=publisher.extension',
    };
  }
  
  // Extract itemName
  const itemName = extractItemName(trimmedUrl);
  if (!itemName) {
    return {
      success: false,
      error: 'Could not find "itemName" parameter in the URL.',
    };
  }
  
  // Validate itemName format
  if (!isValidItemName(itemName)) {
    return {
      success: false,
      error: `Invalid extension identifier: "${itemName}". Expected format: publisher.extensionName`,
    };
  }
  
  // Parse publisher and extension name
  const parts = itemName.split('.');
  const publisher = parts[0];
  const extensionName = parts.slice(1).join('.'); // Handle extension names with dots
  
  return {
    success: true,
    data: {
      publisher,
      extensionName,
      itemName,
    },
  };
}

// --- Version Fetching ---

/**
 * Fetches the extension version from the marketplace page
 */
export async function fetchExtensionVersion(url: string): Promise<VersionResult> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Extension not found. Please check the URL is correct.',
        };
      }
      return {
        success: false,
        error: `Failed to fetch extension page (HTTP ${response.status}).`,
      };
    }
    
    const pageContent = await response.text();
    
    // Try multiple patterns to find the version
    // Pattern 1: "version":"1.2.3"
    let versionMatch = pageContent.match(/"version"\s*:\s*"([\d.]+)"/);
    
    // Pattern 2: "Version":"1.2.3" (different casing)
    if (!versionMatch) {
      versionMatch = pageContent.match(/"Version"\s*:\s*"([\d.]+)"/i);
    }
    
    // Pattern 3: version in JSON-LD or meta tags
    if (!versionMatch) {
      versionMatch = pageContent.match(/version['"]\s*:\s*['"]?([\d.]+)/i);
    }
    
    if (!versionMatch || !versionMatch[1]) {
      return {
        success: false,
        error: 'Could not find version information. The marketplace page structure may have changed.',
      };
    }
    
    return {
      success: true,
      version: versionMatch[1],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Network error while fetching extension info: ${errorMessage}`,
    };
  }
}

// --- Download URL Construction ---

/**
 * Constructs the direct download URL for a VSIX file
 */
export function buildDownloadUrl(publisher: string, extensionName: string, version: string): string {
  return `${MARKETPLACE_API_BASE}/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage`;
}

/**
 * Generates a filename for the downloaded VSIX
 */
export function generateFileName(extensionName: string, version: string): string {
  return `${extensionName}-${version}.vsix`;
}

// --- High-Level Helper ---

/**
 * Complete flow: Parse URL, fetch version, return all details needed for download
 */
export async function getExtensionDetails(
  url: string,
  onProgress?: (message: string) => void
): Promise<{ success: boolean; data?: ExtensionDetails; error?: string }> {
  // Step 1: Parse the URL
  onProgress?.('Validating URL...');
  const parseResult = parseMarketplaceUrl(url);
  
  if (!parseResult.success || !parseResult.data) {
    return {
      success: false,
      error: parseResult.error,
    };
  }
  
  const { publisher, extensionName, itemName } = parseResult.data;
  
  // Step 2: Fetch the version
  onProgress?.(`Fetching version for ${extensionName}...`);
  const versionResult = await fetchExtensionVersion(url);
  
  if (!versionResult.success || !versionResult.version) {
    return {
      success: false,
      error: versionResult.error,
    };
  }
  
  const { version } = versionResult;
  
  // Step 3: Build download URL
  const downloadUrl = buildDownloadUrl(publisher, extensionName, version);
  
  return {
    success: true,
    data: {
      publisher,
      extensionName,
      itemName,
      version,
      downloadUrl,
    },
  };
}

