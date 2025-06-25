import hmac
import hashlib
from urllib.parse import urlparse, parse_qs
from typing import Optional
import requests

def generate_signature(request_method: str, url: str, headers: dict, body: Optional[str], app_secret: str) -> str:
    """
    Generate TikTok Shop API signature matching the Java code logic.

    Args:
      request_method: HTTP method e.g. "GET", "POST"
      url: full request URL including query string
      headers: dict of HTTP headers (for Content-Type)
      body: str of request body or None
      app_secret: your TikTok app secret

    Returns:
      Hexadecimal HMAC-SHA256 signature string.
    """

    # Parse URL path and query parameters
    parsed_url = urlparse(url)
    path = parsed_url.path  # e.g. "/api/products/brands"
    query_params = parse_qs(parsed_url.query)  # dict of param -> list of values

    # Flatten query_params (take first value) and exclude 'sign' and 'access_token'
    filtered_params = {
        k: v[0] for k, v in query_params.items() if k not in ['sign', 'access_token']
    }

    # Sort parameters alphabetically by key
    sorted_keys = sorted(filtered_params.keys())

    # Build the string to sign: path + concatenated key-value pairs
    param_str = path
    for key in sorted_keys:
        param_str += key + filtered_params[key]

    # If content-type is NOT multipart/form-data, append body
    content_type = headers.get("Content-Type", "")
    if content_type.lower() != "multipart/form-data" and body:
        param_str += body

    # Wrap string with secret before and after
    signature_base_str = app_secret + param_str + app_secret

    # Compute HMAC-SHA256 using secret as key
    signature = hmac.new(
        app_secret.encode("utf-8"),
        signature_base_str.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    return signature

# Example usage:
if __name__ == "__main__":
    url = "https://open-api.tiktokglobalshop.com/api/products/brands?access_token=xxx&app_key=xxx&shop_cipher=xxx&shop_id=xxx&timestamp=1234567890&version=202212"
    headers = {
        "Content-Type": "application/json"
    }
    body = None  # or JSON string if POST body present
    app_secret = "your_app_secret_here"

    sign = generate_signature("GET", url, headers, body, app_secret)
    print("Generated signature:", sign)
