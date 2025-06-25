import requests

# Replace these with your actual values
client_key = "6fhicd5f13erg"
client_secret = "dd70d0c4a5ed9da955d23f9949899183aebe8065"
refresh_token = "TTP_jbNdaAAAAAAhx6YGIJmiLoRT5kz21F44vFEpWkE3TyQ7xreVKZwbLLBH-OJxP3OA8p7VoToPaR2ZMue22Uw6buNyLBRUG5ACivbFRdIDp64Yb1EEhx-MCOLhiWN04E1S0-pxXmKnrmfp9pjAu3VVtmAvdGyKDWsN"  # The refresh token you received earlier

# URL for refreshing access token
url = "https://open-api.tiktok.com/oauth/access_token/"


# Prepare the data to send in the request
data = {
    'client_key': client_key,
    'client_secret': client_secret,
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token
}

response = requests.post(url, data=data)

if response.status_code == 200:
    response_data = response.json()
    new_access_token = response_data.get('access_token')
    new_refresh_token = response_data.get('refresh_token')
    print("New Access Token:", new_access_token)
    print("New Refresh Token:", new_refresh_token)
else:
    print(f"Failed to refresh token. Status Code: {response.status_code}")
    print("Error:", response.text)












    # https://commercesocial.co