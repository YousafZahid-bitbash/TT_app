import hmac
import hashlib
import time
from urllib.parse import urlparse, parse_qs, urlencode
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

# TikTok API constants
APP_KEY = os.getenv("APP_KEY")
APP_SECRET = os.getenv("APP_SECRET")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
BASE_URL = os.getenv("BASE_URL", "https://partner.us.tiktokshop.com/")
REDIRECT_URI = os.getenv("REDIRECT_URI", "https://yourdomain.com/tiktok/callback")
SERVICE_ID = os.getenv("SERVICE_ID")

def generate_signature(request_method: str, url: str, headers: dict, body: Optional[str], app_secret: str) -> str:
    """Generate signature for TikTok API requests"""
    parsed_url = urlparse(url)
    path = parsed_url.path
    query_params = parse_qs(parsed_url.query)
    filtered_params = {k: v[0] for k, v in query_params.items() if k not in ('sign', 'access_token')}
    sorted_keys = sorted(filtered_params.keys())
    param_str = path
    for key in sorted_keys:
        param_str += key + filtered_params[key]
    content_type = headers.get("Content-Type", "")
    if content_type.lower() != "multipart/form-data" and body:
        param_str += body
    signature_base = app_secret + param_str + app_secret
    return hmac.new(
        app_secret.encode("utf-8"),
        signature_base.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()