import React, { useState } from 'react';
import { 
  Download, 
  Info, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Moon, 
  Sun 
} from 'lucide-react';

// --- Type Definitions ---
type Page = 'downloader' | 'about';
type Theme = 'light' | 'dark';

interface MessageState {
  type: 'error' | 'success' | 'info' | '';
  text: string;
}

// --- Main App Component ---
export default function App(): JSX.Element {
  const [page, setPage] = useState<Page>('downloader');
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`flex h-screen w-full font-sans transition-colors ${
      theme === 'dark' ? 'dark' : ''
    } bg-gray-100 dark:bg-gray-900`}>
      {/* --- Sidebar Navigation --- */}
      <nav className="flex w-20 flex-col items-center gap-4 border-r border-gray-200 bg-white pt-6 dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={() => setPage('downloader')}
          title="Downloader"
          className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
            page === 'downloader'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Download className="h-6 w-6" />
        </button>
        <button
          onClick={() => setPage('about')}
          title="About"
          className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
            page === 'about'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Info className="h-6 w-6" />
        </button>

        {/* --- Theme Toggle Button --- */}
        <div className="mt-auto mb-6">
          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            className="flex h-12 w-12 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* --- Page Content --- */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {page === 'downloader' && <DownloaderPage />}
        {page === 'about' && <AboutPage />}
      </main>
    </div>
  );
}

// --- 1. Downloader Page Component ---
function DownloaderPage(): JSX.Element {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });

  /**
   * Main function to parse URL, find version, and trigger download.
   */
  const handleDownload = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // --- 1. Parse Publisher and Extension Name ---
    let publisher, extensionName;
    try {
      const parsedUrl = new URL(url);
      const itemName = parsedUrl.searchParams.get('itemName');
      if (!itemName || !itemName.includes('.')) {
        throw new Error("Invalid URL. Does not contain 'itemName' parameter.");
      }
      [publisher, extensionName] = itemName.split('.');
    } catch (e) {
      const error = e as Error;
      setMessage({ type: 'error', text: error.message || 'Invalid Marketplace URL.' });
      setIsLoading(false);
      return;
    }

    // --- 2. Fetch Page Content to Find Version ---
    let version;
    try {
      setMessage({ type: 'info', text: 'Fetching page to find version... (This may fail due to CORS)' });
      
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const response = await fetch(proxyUrl + url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch page. Status: ${response.status}`);
      }
      
      const pageContent = await response.text();
      
      // --- 3. Find Version using Regex ---
      const versionMatch = pageContent.match(/"version":"([\d\.]+)"/);
      if (!versionMatch || !versionMatch[1]) {
        throw new Error('Could not parse extension version from page content.');
      }
      version = versionMatch[1];
      setMessage({ type: 'info', text: `Found version: ${version}. Preparing download...` });

      // --- 4. Construct Final URL ---
      const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage`;

      // --- 5. Trigger Download ---
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${extensionName}-${version}.vsix`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setMessage({ type: 'success', text: `Download started for ${extensionName} v${version}!` });
      setUrl('');

    } catch (e) {
      const error = e as Error;
      console.error(error);
      setMessage({ 
        type: 'error', 
        text: `Error: ${error.message}. This often happens due to browser CORS security rules. Check the console (F12) for details.` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">VSIX Downloader</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Paste the full VSCode Marketplace URL below to find the latest version
          and download the `.vsix` file.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-1">
            <label htmlFor="url" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Marketplace URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="https://marketplace.visualstudio.com/items?itemName=..."
              className="w-full rounded-md border-gray-300 p-3 shadow-sm transition-colors focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={handleDownload}
            disabled={isLoading || !url}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            <span>{isLoading ? 'Fetching...' : 'Download .vsix'}</span>
          </button>
        </div>
        
        {/* --- Message Area --- */}
        {message.text && (
          <div className={`mt-4 flex items-start gap-3 rounded-lg p-4 transition-colors ${
            message.type === 'error' ? 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-500/30' :
            message.type === 'success' ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-500/30' :
            'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-500/30'
          }`}>
            {message.type === 'error' && <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400" />}
            {message.type === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />}
            {message.type === 'info' && <Info className="h-5 w-5 flex-shrink-0 text-blue-500 dark:text-blue-400" />}
            <p className={`text-sm ${
              message.type === 'error' ? 'text-red-800 dark:text-red-300' :
              message.type === 'success' ? 'text-green-800 dark:text-green-300' :
              'text-blue-800 dark:text-blue-300'
            }`}>
              {message.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 2. About Page Component ---
function AboutPage(): JSX.Element {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">About This Tool</h1>
        <div className="mt-4 space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            This application is a simple utility to download the `.vsix` package
            for any Visual Studio Code extension directly from the marketplace URL.
          </p>
          <h3 className="text-lg font-semibold dark:text-white">How It Works</h3>
          <ol className="list-inside list-decimal space-y-2">
            <li>It parses the `publisher` and `extensionName` from the URL.</li>
            <li>
              It fetches the marketplace page content to find the latest `version` string.
            </li>
            <li>
              It constructs the direct download URL for the `.vspackage` file.
            </li>
            <li>
              It triggers a browser download, saving the file to your default
              "Downloads" folder.
            </li>
          </ol>
          <h3 className="text-lg font-semibold dark:text-white">Limitations</h3>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>CORS:</strong> This app must use a CORS proxy to fetch the
              marketplace page. This can be slow or unreliable. Without a proxy,
              the browser's security rules would block the request.
            </li>
            <li>
              <strong>Download Location:</strong> As a web application, it
              cannot control *where* files are saved. Your browser will save
              the `.vsix` file to its default "Downloads" location.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}