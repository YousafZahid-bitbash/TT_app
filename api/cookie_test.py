import json
import requests
import time
from fastapi import APIRouter, HTTPException
from urllib.parse import urlencode
import hmac
import hashlib

router = APIRouter()

def load_cookies():
    """Load cookies from JSON file"""
    try:
        with open('api/cookies.json', 'r') as f:
            cookie_data = json.load(f)
        
        cookies = {}
        for cookie in cookie_data:
            cookies[cookie['name']] = cookie['value']
        return cookies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading cookies: {str(e)}")

def generate_signature_simple(params: dict, app_secret: str) -> str:
    """Generate signature for API calls"""
    # Remove sign and access_token from params for signature
    filtered_params = {k: v for k, v in params.items() if k not in ('sign', 'access_token')}
    
    # Sort parameters
    sorted_params = sorted(filtered_params.items())
    
    # Create string to sign: app_secret + param_string + app_secret
    param_string = ''.join([f"{k}{v}" for k, v in sorted_params])
    string_to_sign = f"{app_secret}{param_string}{app_secret}"
    
    # Generate HMAC-SHA256 signature
    signature = hmac.new(
        app_secret.encode('utf-8'),
        string_to_sign.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return signature

@router.get("/cookie-test/info")
async def test_cookie_info():
    """Test loading cookies and show basic info"""
    try:
        cookies = load_cookies()
        
        return {
            "status": "success",
            "shop_id": cookies.get('SHOP_ID', 'Not found'),
            "has_seller_token": "Yes" if cookies.get('SELLER_TOKEN') else "No",
            "session_active": "Yes" if cookies.get('sessionid_tiktokseller') else "No",
            "cookies_count": len(cookies),
            "message": "Cookies loaded successfully - ready for testing!"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/cookie-test/shop-info")
async def test_shop_info():
    """Test getting shop info using TikTok Shop API with cookies"""
    try:
        cookies = load_cookies()
        shop_id = cookies.get('SHOP_ID')
        
        if not shop_id:
            raise HTTPException(status_code=400, detail="SHOP_ID not found in cookies")
        
        # Using TikTok Shop API endpoint
        url = "https://open-api.tiktokglobalshop.com/api/shop/get_authorized_shop"
        
        # Parameters for the API call
        timestamp = str(int(time.time()))
        params = {
            "app_key": "6fhicd5f13erg",  # Your APP_KEY from .env
            "timestamp": timestamp,
            "shop_id": shop_id,
            "version": "202309"
        }
        
        # Generate signature (you'll need your APP_SECRET)
        app_secret = "dd70d0c4a5ed9da955d23f9949899183aebe8065"  # Your APP_SECRET
        signature = generate_signature_simple(params, app_secret)
        params["sign"] = signature
        
        # Headers
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "TikTokShop-API-Client",
        }
        
        # Convert cookies to requests format
        cookie_str = "; ".join([f"{k}={v}" for k, v in cookies.items()])
        headers["Cookie"] = cookie_str
        
        # Make the request
        response = requests.get(f"{url}?{urlencode(params)}", headers=headers)
        
        return {
            "status": "success",
            "api_response": response.json(),
            "status_code": response.status_code,
            "used_shop_id": shop_id
        }
        
    except Exception as e:
        return {
            "status": "error", 
            "message": str(e),
            "suggestion": "Try the TikTok internal API endpoint instead"
        }

@router.get("/cookie-test/internal-api")
async def test_internal_api():
    """Test TikTok's internal seller API (what the browser uses)"""
    try:
        cookies = load_cookies()
        shop_id = cookies.get('SHOP_ID')
        
        # This is the internal API that the TikTok Shop dashboard uses
        url = f"https://seller.tiktokshop.com/compass/api/v1/shop/{shop_id}/overview"
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Accept": "application/json",
            "Referer": "https://seller.tiktokshop.com/",
            "X-Requested-With": "XMLHttpRequest"
        }
        
        # Convert cookies to requests format
        cookie_dict = {cookie['name']: cookie['value'] for cookie in json.load(open('cookies.json'))}
        
        response = requests.get(url, cookies=cookie_dict, headers=headers)
        
        return {
            "status": "success",
            "response": response.json() if response.status_code == 200 else response.text,
            "status_code": response.status_code,
            "shop_id": shop_id
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/cookie-test/orders")
async def test_orders_api():
    """Test getting orders using cookies"""
    try:
        cookies = load_cookies()
        shop_id = cookies.get('SHOP_ID')
        
        # Try internal orders API
        url = f"https://seller.tiktokshop.com/oec/api/v1/shop/{shop_id}/order/list"
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Accept": "application/json",
            "Referer": "https://seller.tiktokshop.com/",
        }
        
        params = {
            "page_size": 10,
            "page": 1,
            "start_time": int(time.time() - 30*24*3600),  # Last 30 days
            "end_time": int(time.time())
        }
        
        cookie_dict = {cookie['name']: cookie['value'] for cookie in json.load(open('cookies.json'))}
        
        response = requests.get(url, params=params, cookies=cookie_dict, headers=headers)
        
        return {
            "status": "success",
            "orders_response": response.json() if response.status_code == 200 else response.text,
            "status_code": response.status_code,
            "endpoint": "Internal TikTok Shop API"
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}