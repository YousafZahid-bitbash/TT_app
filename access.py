import os
import urllib.parse
import requests
from flask import Flask, redirect, request, session

app = Flask(__name__)
app.secret_key = os.urandom(24)  # for session management

# --- TikTok API Credentials ---
APP_KEY = "6fhicd5f13erg"
APP_SECRET = "dd70d0c4a5ed9da955d23f9949899183aebe8065"
REDIRECT_URI = "https://commercesocial.co"   # Make sure this matches your TikTok app settings!
SERVICE_ID = "7477612291209955118"
SCOPES = "shops.read,orders.read"

# --- TikTok OAuth URLs ---
AUTHORIZE_URL = "https://services.tiktokshop.com/open/authorize"
TOKEN_URL = "https://auth.tiktok-shops.com/api/v2/token/get"

@app.route("/")
def home():
    state = "random_state_string"  # Ideally, generate and validate per session
    session['state'] = state
    params = {
        "app_key": APP_KEY,
        "redirect_uri": REDIRECT_URI,
        "state": state,
        "scope": SCOPES,
        "service_id": SERVICE_ID
    }
    auth_link = AUTHORIZE_URL + "?" + urllib.parse.urlencode(params)
    return f"""
        <h2>TikTok Shop OAuth Example</h2>
        <a href="{auth_link}">
            <button>Connect TikTok Shop</button>
        </a>
    """

@app.route("/callback")
def oauth_callback():
    code = request.args.get("code")
    state = request.args.get("state")

    if not code or not state:
        return "Missing code or state!", 400

    # Optional: check that state matches session['state']
    # if state != session.get('state'):
    #     return "State mismatch!", 400

    # Exchange the code for an access token
    payload = {
        "app_key": APP_KEY,
        "app_secret": APP_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI,
        "service_id": SERVICE_ID
    }
    resp = requests.post(TOKEN_URL, data=payload)
    try:
        resp_json = resp.json()
    except Exception:
        return f"Error parsing response: {resp.text}", 500

    if resp_json.get("code") == 0:
        access_token = resp_json["data"]["access_token"]
        return f"""
            <h2>Authorization Successful!</h2>
            <b>Access Token:</b> <code>{access_token}</code><br><br>
            <b>Full Response:</b> <pre>{resp_json}</pre>
        """
    else:
        return f"Error: {resp_json}"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
