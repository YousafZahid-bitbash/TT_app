import os
import time
import random
import string
import json
import requests
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional

from urllib.parse import urlencode
from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import JSONResponse

from tiktok_utils import generate_signature, APP_KEY, APP_SECRET, BASE_URL, SERVICE_ID, REDIRECT_URI
# from .tiktok_utils import generate_signature, APP_KEY, APP_SECRET, BASE_URL, SERVICE_ID, REDIRECT_URI
#from tiktok_utils import generate_signature, APP_KEY, APP_SECRET, BASE_URL, SERVICE_ID, REDIRECT_URI


load_dotenv()

router = APIRouter()

def generate_random_state(length=16):
    """Generate a random state string for CSRF protection"""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# FIXED: Use the correct TikTok Shop authorization URL
TIKTOK_AUTH_URL = "https://services.tiktokshop.com/open/authorize"
TIKTOK_TOKEN_URL = f"{BASE_URL}/api/v2/token/get"

@router.get("/tiktok/login")
async def tiktok_shop_login():
    """Generate TikTok Shop OAuth login URL"""
    if not SERVICE_ID:
        raise HTTPException(status_code=400, detail="SERVICE_ID not configured. Please check your TikTok Shop app settings.")
    
    state = generate_random_state()
    
    # FIXED: Use correct authorization URL and parameters
    auth_url = f"{TIKTOK_AUTH_URL}?service_id={SERVICE_ID}&state={state}"
    
    return JSONResponse(content={
        "redirect_url": auth_url,
        "state": state,
        "message": "Redirect user to this URL to start TikTok Shop authorization",
        "instructions": [
            "1. Copy the redirect_url",
            "2. Open it in a browser", 
            "3. Login with your TikTok Shop seller account",
            "4. Authorize the app",
            "5. You'll be redirected back with an auth code"
        ]
    })

@router.get("/tiktok/auth_url")
async def get_auth_url():
    if not SERVICE_ID:
        raise HTTPException(status_code=400, detail="SERVICE_ID not configured")
    
    state = generate_random_state()
    
    # FIXED: Use the correct authorization URL
    auth_url = f"{TIKTOK_AUTH_URL}?service_id={SERVICE_ID}&state={state}"
    
    return {
        "authorization_url": auth_url,
        "state": state,
        "service_id": SERVICE_ID,
        "redirect_uri": REDIRECT_URI,
        "instructions": [
            "1. Copy the authorization_url above",
            "2. Open it in a browser", 
            "3. Login with your TikTok Shop seller account",
            "4. Authorize the app",
            "5. You'll be redirected to your callback URL with an auth code",
            "6. Use the auth code with /tiktok/exchange_code endpoint"
        ],
        "note": "Make sure your redirect URI is registered in TikTok Partner Center"
    }

@router.get("/tiktok/validate_config")
async def validate_configuration():
    """Validate all required configuration is present"""
    config_status = {
        "SERVICE_ID": {"present": bool(SERVICE_ID), "value": SERVICE_ID if SERVICE_ID else "MISSING"},
        "APP_KEY": {"present": bool(APP_KEY), "value": APP_KEY[:10] + "..." if APP_KEY else "MISSING"},
        "APP_SECRET": {"present": bool(APP_SECRET), "value": APP_SECRET[:10] + "..." if APP_SECRET else "MISSING"},
        "REDIRECT_URI": {"present": bool(REDIRECT_URI), "value": REDIRECT_URI if REDIRECT_URI else "MISSING"},
        "BASE_URL": {"present": bool(BASE_URL), "value": BASE_URL if BASE_URL else "MISSING"}
    }
    
    all_present = all(config["present"] for config in config_status.values())
    
    return {
        "status": "ok" if all_present else "error",
        "message": "All configuration present" if all_present else "Missing required configuration",
        "config": config_status,
        "authorization_url": f"{TIKTOK_AUTH_URL}?service_id={SERVICE_ID}" if SERVICE_ID else "Cannot generate - SERVICE_ID missing"
    }

@router.get("/tiktok/callback")
async def tiktok_shop_callback(request: Request):
    """Handle the OAuth callback from TikTok Shop"""
    auth_code = request.query_params.get("code")
    state = request.query_params.get("state")
    
    if not state:
        raise HTTPException(status_code=400, detail="State parameter missing")
    
    if not auth_code:
        error = request.query_params.get("error")
        error_description = request.query_params.get("error_description")
        if error:
            raise HTTPException(status_code=400, detail=f"Authorization failed: {error} - {error_description}")
        else:
            raise HTTPException(status_code=400, detail="Authorization code not found in the request")
    
    try:
        token_data = await exchange_code_for_token(auth_code)
        
        return {
            "message": "Authorization successful!",
            "token_data": token_data,
            "note": "Store this token data securely in your database"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to exchange code for token: {str(e)}")

async def exchange_code_for_token(auth_code: str) -> dict:
    """Exchange authorization code for access token"""
    timestamp = str(int(time.time()))
    
    # FIXED: Use correct parameters for TikTok Shop API
    params = {
        "app_key": APP_KEY,
        "app_secret": APP_SECRET,
        "auth_code": auth_code,
        "grant_type": "authorized_code",
        "timestamp": timestamp
    }
    
    query_string = urlencode(params)
    full_url = f"{TIKTOK_TOKEN_URL}?{query_string}"
    headers = {"Content-Type": "application/json"}
    
    # Generate signature
    sign = generate_signature("POST", full_url, headers, None, APP_SECRET)
    params["sign"] = sign
    
    try:
        response = requests.post(TIKTOK_TOKEN_URL, params=params, headers=headers)
        response_data = response.json()
        
        print(f"Token exchange response: {json.dumps(response_data, indent=2)}")  # Debug log
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"HTTP Error: {response.text}")
        
        if response_data.get("code") != 0:
            error_message = response_data.get("message", "Unknown error")
            raise HTTPException(status_code=400, detail=f"TikTok Shop API error: {error_message}")
        
        data = response_data.get("data", {})
        if not data:
            raise HTTPException(status_code=400, detail="No token data found in response")
        #write code to save the data to database
        
        return data
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
