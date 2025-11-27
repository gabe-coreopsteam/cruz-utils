import sys
import requests
import re
from urllib.parse import urlparse, parse_qs

def get_vsix_download_link(marketplace_url):
    """
    Fetches the VSCode Marketplace page, finds the extension's version,
    and constructs the direct .vsix download link.
    """
    try:
        # --- 1. Get Publisher and Extension Name from URL ---
        parsed_url = urlparse(marketplace_url)
        query_params = parse_qs(parsed_url.query)
        
        item_name = query_params.get('itemName')
        if not item_name:
            print(f"Error: Could not find 'itemName' in the URL: {marketplace_url}", file=sys.stderr)
            return None
            
        item_name = item_name[0]
        if '.' not in item_name:
            print(f"Error: 'itemName' format is incorrect. Expected 'publisher.extension'. Got: {item_name}", file=sys.stderr)
            return None
            
        publisher, extension_name = item_name.split('.', 1)
        
        # --- 2. Fetch Page Content to Find Version ---
        print(f"Fetching page for {item_name} to find version...", file=sys.stderr)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
        response = requests.get(marketplace_url, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        page_content = response.text
        
        # --- 3. Find Version using Regex ---
        # The version is usually in a JSON blob inside the HTML.
        # This regex looks for a property like "version":"1.2.3"
        version_match = re.search(r'"version":"([\d\.]+)"', page_content)
        
        if not version_match:
            print("Error: Could not find version information on the page.", file=sys.stderr)
            print("The page structure might have changed.", file=sys.stderr)
            return None
            
        version = version_match.group(1)
        print(f"Found version: {version}", file=sys.stderr)
        
        # --- 4. Construct Final URL ---
        download_url = (
            f"https://marketplace.visualstudio.com/_apis/public/gallery/publishers/"
            f"{publisher}/vsextensions/{extension_name}/{version}/vspackage"
        )
        
        return download_url

    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python get_vsix_link.py '<marketplace_url>'", file=sys.stderr)
        print("Example: python get_vsix_link.py 'https://marketplace.visualstudio.com/items?itemName=hediet.debug-visualizer'", file=sys.stderr)
        sys.exit(1)
        
    url = sys.argv[1]
    link = get_vsix_download_link(url)
    
    if link:
        # The script's main output is just the link
        print(link)
    else:
        sys.exit(1)
