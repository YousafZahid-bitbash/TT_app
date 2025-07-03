import argparse
import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import WebDriverException

# --- Helper Functions ---
def load_cookies_from_file(cookies_path):
    """Load cookies from a JSON file."""
    try:
        with open(cookies_path, 'r') as f:
            cookies = json.load(f)
        if not isinstance(cookies, list):
            raise ValueError("Cookies file must contain a list of cookies.")
        return cookies
    except Exception as e:
        print(f"[ERROR] Failed to load cookies: {e}")
        return None

def inject_cookies(driver, cookies, domain):
    """Inject cookies into the browser for the given domain."""
    driver.get(f"https://{domain}")
    for cookie in cookies:
        # Selenium expects 'expiry' as int, not float
        if 'expiry' in cookie and isinstance(cookie['expiry'], float):
            cookie['expiry'] = int(cookie['expiry'])
        # Remove 'sameSite' if present (Selenium may not support it)
        cookie.pop('sameSite', None)
        try:
            driver.add_cookie(cookie)
        except Exception as e:
            print(f"[WARNING] Could not add cookie {cookie.get('name')}: {e}")

# --- Main Script ---
def main():
    parser = argparse.ArgumentParser(description="TikTok OAuth Selenium Cookie Injector")
    parser.add_argument('--oauth_url', required=True, help='TikTok OAuth login URL')
    parser.add_argument('--cookies', required=True, help='Path to cookies JSON file')
    parser.add_argument('--redirect_uri', required=True, help='Redirect URI to watch for (prefix match)')
    parser.add_argument('--domain', default="tiktok.com", help='Domain for which to inject cookies (default: tiktok.com)')
    parser.add_argument('--timeout', type=int, default=120, help='Max seconds to wait for redirect (default: 120)')
    args = parser.parse_args()

    # Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_argument('--start-maximized')
    # Uncomment below to run headless
    # chrome_options.add_argument('--headless')

    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)

    try:
        print(f"[INFO] Loading cookies from {args.cookies}")
        cookies = load_cookies_from_file(args.cookies)
        if not cookies:
            print("[ERROR] No cookies loaded. Exiting.")
            driver.quit()
            return

        print(f"[INFO] Opening TikTok domain for cookie injection: https://{args.domain}")
        inject_cookies(driver, cookies, args.domain)
        print(f"[INFO] Cookies injected. Navigating to OAuth URL: {args.oauth_url}")
        driver.get(args.oauth_url)
        driver.refresh()  # Reload to ensure cookies are used

        print(f"[INFO] Waiting for redirect to {args.redirect_uri} ...")
        start_time = time.time()
        last_url = driver.current_url
        while True:
            current_url = driver.current_url
            if current_url.startswith(args.redirect_uri):
                print(f"[SUCCESS] Redirect detected! Final URL: {current_url}")
                break
            if time.time() - start_time > args.timeout:
                print(f"[ERROR] Timed out after {args.timeout} seconds waiting for redirect.")
                break
            if current_url != last_url:
                print(f"[INFO] Navigated to: {current_url}")
                last_url = current_url
            time.sleep(1)

        # Optionally, print a warning if the cookies did not work
        if not current_url.startswith(args.redirect_uri):
            print("[WARNING] Did not reach redirect_uri. Cookies may be expired or invalid.")
            print("[INFO] You may need to update your cookies.json file.")

    except WebDriverException as e:
        print(f"[ERROR] WebDriver error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main() 