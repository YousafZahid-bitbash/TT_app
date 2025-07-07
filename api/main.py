# At the top of your main.py, replace the imports and constants:
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException, Query, Path, Request
from urllib.parse import urlparse, parse_qs, urlencode
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from collections import defaultdict
from typing import List,Dict, Any
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
import requests
import random
import string
import asyncio
import aiohttp
import psycopg2
import secrets
import json
import time
import hmac
import hashlib


# Import from your new utils file instead of defining locally

# from .tiktok_utils import generate_signature, APP_KEY, APP_SECRET, BASE_URL, SERVICE_ID
# from .tiktok_auth import router as tiktok_auth_router
from tiktok_utils import generate_signature, APP_KEY, APP_SECRET, BASE_URL, SERVICE_ID
from tiktok_auth import router as tiktok_auth_router

# Load environment variables
load_dotenv()

# Fetch variables
# USER = os.getenv("user")
# PASSWORD = os.getenv("password")
# HOST = os.getenv("host")
# PORT = os.getenv("port")
# DBNAME = os.getenv("dbname")

# # Connect to the database
# try:
#     connection = psycopg2.connect(
#         user=USER,
#         password=PASSWORD,
#         host=HOST,
#         port=PORT,
#         dbname=DBNAME
#     )
#     print("Connection successful!")
    
#     # Create a cursor to execute SQL queries
#     cursor = connection.cursor()
    
#     # Example query
#     cursor.execute("SELECT NOW();")
#     result = cursor.fetchone()
#     print("Current Time:", result)

#     # Close the cursor and connection
#     cursor.close()
#     connection.close()
#     print("Connection closed.")

# except Exception as e:
#     print(f"Failed to connect: {e}")
    
# Add this function at the top of your main.py after your imports
# Replace your async get_access_token function with this:
def get_access_token_sync():
    """Synchronous function to get access token from database"""
    try:
        # Get the most recent access token from database
        result = supabase.table("tiktok_integrations").select("access_token, shop_id, shop_cipher").order("updated_at", desc=True).limit(1).execute()
        
        if not result.data:
            print("⚠️ No TikTok integration found in database")
            return None, None, None
        
        integration = result.data[0]
        return integration["access_token"], integration.get("shop_id"), integration.get("shop_cipher")
        
    except Exception as e:
        print(f"❌ Error getting access token: {str(e)}")
        return None, None, None

#Supabase Connection    
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

#Slack Connection
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL") 
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")      
SLACK_CHANNEL = os.getenv("SLACK_CHANNEL", "#all-tiktok")  

ACCESS_TOKEN, shop_id, shop_cipher = get_access_token_sync()

app = FastAPI()

#Backend and Frontend Communication Connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development (React app on localhost)
        "https://tt-app-frontend.vercel.app",  # Your deployed frontend URL on Vercel (replace this with your actual Vercel URL)
        "https://tt-app-frontend-yousaf-zahids-projects.vercel.app/",
        "https://tt-app-frontend-yousafzahid-bitbash-yousaf-zahids-projects.vercel.app/",
        "https://tt-app-frontend-bwkwtm1zc-yousaf-zahids-projects.vercel.app/",
        "https://*.vercel.app",  # Allow all Vercel subdomains (useful if you have multiple environments)
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

#Router for accessing tiktok_auth.py file 
app.include_router(tiktok_auth_router)


# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Backend is running!"}

class User(BaseModel): 
    username: str
    email: str
    password: str

@app.post('/register')
def register(user: User):
    
    existing_user = supabase.table('users').select('email').eq('email', user.email).execute
    if existing_user.data:
        raise HTTPException


# Function to make the actual API request
def call_tiktok_api(path: str, params: dict = None, method: str = "GET", json_body: dict = None):
    if params is None:
        params = {}

    
    timestamp = str(int(time.time()))
    base_params = {
        "access_token": ACCESS_TOKEN,
        "app_key": APP_KEY,
        "timestamp": timestamp,
        "version": "202212",
    }
    base_params.update(params)
    base_url = f"{BASE_URL}{path}?{urlencode(base_params)}"
    headers = {"Content-Type": "application/json"}
    body_str = json.dumps(json_body) if json_body else None
    sign = generate_signature(method, base_url, headers, body_str, APP_SECRET)
    base_params["sign"] = sign
    signed_url = f"{BASE_URL}{path}?{urlencode(base_params)}"
    headers["x-tts-access-token"] = ACCESS_TOKEN
    if method.upper() == "POST":
        response = requests.post(signed_url, headers=headers, json=json_body)
    else:
        response = requests.get(signed_url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()




# --------------------------------------
# Fetch order data based on date range

def fetch_orders_data(start_date: str, end_date: str):
    api_path = "/order/202309/orders/search"
    params = {
        "shop_id": "7496217208817354793",  # Replace with actual shop ID
        "start_date_ge": start_date,
        "end_date_lt": end_date,
        "page_size": 10,
        "shop_cipher": "TTP_ZxmgLgAAAAAdwMla_v60G1uDro76Xyg8"
    }

    all_orders = []
    next_page_token = None
    while True:
        if next_page_token:
            params["next_page_token"] = next_page_token
        
        # Call the TikTok API with the current parameters
        try:
            response_data = call_tiktok_api(api_path, params=params, method="POST")
            
            # Log the full response for debugging
            print(f"Response Data: {json.dumps(response_data, indent=4)}")  # Pretty print the response for debugging

            # Check if the response contains the 'orders' key
            if "orders" in response_data.get("data", {}):
                all_orders.extend(response_data["data"]["orders"])
            else:
                # Log the response and handle the missing 'orders' key gracefully
                print(f"Warning: 'orders' key is missing in the response: {json.dumps(response_data, indent=4)}")
                raise HTTPException(status_code=400, detail="No orders data found in the response.")
        except Exception as e:
            print(f"API Request Failed: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Error fetching data: {str(e)}")

        # Check if there is a next page
        next_page_token = response_data["data"].get("next_page_token")
        
        if not next_page_token:
            break  # Exit the loop if there are no more pages

    return all_orders

# ---------------------------------------
# Fetch return data based on date range
def fetch_returns_data(start_date: str, end_date: str):
    api_path = "/return_refund/202309/returns/search"
    params = {
        "shop_id": "7496217208817354793",  # Provide your shop ID
        "start_date_ge": start_date,
        "end_date_lt": end_date,
        "page_size": 10,
        "shop_cipher": "TTP_ZxmgLgAAAAAdwMla_v60G1uDro76Xyg8"
    }

    all_returns = []
    next_page_token = None
    while True:
        if next_page_token:
            params["next_page_token"] = next_page_token
        
        response_data = call_tiktok_api(api_path, params=params, method="POST")
        
        if response_data["code"] != 0:
            raise Exception(f"API Error: {response_data['message']}")
        
        all_returns.extend(response_data["data"]["return_orders"])
        next_page_token = response_data["data"].get("next_page_token")
        
        if not next_page_token:
            break

    return all_returns

# Calculate refund rate and trends based on orders and returns
def calculate_refund_rate_and_trends(orders_data, returns_data):
    total_refund = 0
    total_order_amount = 0
    refund_by_date = defaultdict(float)  # Track refunds by date

    # Create a dictionary for order lookup based on order_id
    orders_dict = {order["order_id"]: order for order in orders_data}

    for return_order in returns_data:
        order_id = return_order["order_id"]
        refund_amount = float(return_order["refund_amount"]["refund_total"])
        
        # Find corresponding order details
        order = orders_dict.get(order_id)
        if order:
            order_amount = float(order["total_amount"])  # Assuming 'total_amount' is the order total
            total_refund += refund_amount
            total_order_amount += order_amount

            # Track refund trends by date
            create_date = datetime.utcfromtimestamp(return_order["create_time"]).strftime('%Y-%m-%d')
            refund_by_date[create_date] += refund_amount

    # Calculate refund rate
    refund_rate = (total_refund / total_order_amount) * 100 if total_order_amount > 0 else 0

    return refund_rate, refund_by_date

# FastAPI endpoint to calculate refund rate and trends for a specific date range
@app.get("/calculate_refund_rate")
async def calculate_refund_rate(
    start_date: str = Query(..., description="Start date for the data (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date for the data (YYYY-MM-DD)"),
):
    # Fetch order data and return data
    orders_data = fetch_orders_data(start_date, end_date)
    returns_data = fetch_returns_data(start_date, end_date)

    # Calculate refund rate and trends
    refund_rate, refund_trends = calculate_refund_rate_and_trends(orders_data, returns_data)

    return {
        "refund_rate": f"{refund_rate:.2f}%",
        "refund_trends": refund_trends
    }

# FastAPI endpoint to fetch campaign outcomes
@app.get("/TT_campaign_outcomes")
async def fetch_campaign_outcomes(
    start_date: str = Query(..., description="Start date for the campaign data, in YYYY-MM-DD format"),
    end_date: str = Query(..., description="End date for the campaign data, in YYYY-MM-DD format")
):
    api_path = "/analytics/202405/shop/performance"  # Replace with the correct endpoint for campaigns
    
    # Adding the required parameters for start_date_ge and end_date_lt
    params = {
        "shop_id": "7496217208817354793",  # Provide your shop ID
        "start_date_ge": start_date,  # Required start date (greater than or equal)
        "end_date_lt": end_date,  # Required end date (less than)
        "shop_cipher": "TTP_ZxmgLgAAAAAdwMla_v60G1uDro76Xyg8"
    }

    try:
        # Change the method to GET
        campaign_data = call_tiktok_api(api_path, params=params, method="GET")
        # Return the campaign data received from TikTok
        return {"status": "success", "data": campaign_data}
    except HTTPException as e:
        # Handle errors if the API request fails
        return {"status": "error", "message": str(e.detail)}


@app.get("/shop/performance")
async def get_shop_performance(
    start_time: str = Query(..., description="Start timestamp (unix)"),
    end_time: str = Query(..., description="End timestamp (unix)"),
    page_size: int = Query(10, description="Page size"),
    page_no: int = Query(1, description="Page number"),
    brand_id: str = Query(None, description="Brand ID filter (optional)"),
):
    api_path = "/analytics/202405/shop/performance"
    timestamp = str(int(time.time()))

    # Build params including filters and authentication
    params = {
        "access_token": ACCESS_TOKEN,
        "app_key": APP_KEY,
        "timestamp": timestamp,
        "version": "202405",
        "start_date_ge": str(start_time),
        "end_date_lt": str(end_time),
        "page_size": str(page_size),
        "page_no": str(page_no),
        "shop_cipher": "TTP_ZxmgLgAAAAAdwMla_v60G1uDro76Xyg8"
    }
    if brand_id:
        params["brand_id"] = brand_id

    base_url = f"{BASE_URL}{api_path}?{urlencode(params)}"
    headers = {"Content-Type": "application/json"}

    # Generate signature over the URL with query params (no body for GET)
    sign = generate_signature("GET", base_url, headers, None, APP_SECRET)
    params["sign"] = sign

    signed_url = f"{BASE_URL}{api_path}?{urlencode(params)}"
    headers["x-tts-access-token"] = ACCESS_TOKEN

    response = requests.get(signed_url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    # Extract GMV or other performance data from response
    data = response.json()

    # Parse the response and send relevant performance data
    performance_data = {
        "gmv": data["data"]["performance"]["intervals"][0]["gmv"]["amount"],
        "orders": data["data"]["performance"]["intervals"][0]["orders"],
        "units_sold": data["data"]["performance"]["intervals"][0]["units_sold"],
        # Add more fields here as required
    }

    return performance_data



@app.get("/top_performing_creators")
async def top_performing_creators(
    start_date: str = Query(..., description="Start date for the data (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date for the data (YYYY-MM-DD)"),
    page_size: int = Query(10, description="Number of results per page"),
    page_no: int = Query(1, description="Page number to fetch"),
):
    api_path = "/affiliate_creator/202405/orders/search"
    params = {
        "shop_id": 7496217208817354793,
        "start_date_ge": start_date,
        "end_date_lt": end_date,
        "page_size": page_size,
        "page_no": page_no
    }

    all_orders = []
    next_page_token = None

    while True:
        if next_page_token:
            params["next_page_token"] = next_page_token
        
        response_data = call_tiktok_api(api_path, params=params, method="POST")
        
        # Check if orders are present in the response
        if "orders" not in response_data.get("data", {}):
            raise KeyError("'orders' key is missing in the response data.")

        all_orders.extend(response_data["data"]["orders"])

        # Check for the next page
        next_page_token = response_data["data"].get("next_page_token")
        
        if not next_page_token:
            break  # Exit the loop if there are no more pages

    # Analyze top-performing creators based on order data (example: count orders by creator)
    creator_performance = {}

    for order in all_orders:
        for line_item in order.get("line_items", []):
            creator_id = line_item.get("product_id")  # Assuming the creator_id is associated with the product_id
            if creator_id:
                if creator_id in creator_performance:
                    creator_performance[creator_id] += 1
                else:
                    creator_performance[creator_id] = 1

    # Sort creators by order count (descending)
    sorted_creators = sorted(creator_performance.items(), key=lambda x: x[1], reverse=True)

    # Return the top-performing creators (for simplicity, top 10 in this case)
    top_creators = sorted_creators[:10]
    
    return {"top_creators": top_creators}



# Endpoint to fetch GMV and video performance metrics
@app.get("/Gmv_per_video")
async def get_shop_videos_performance(
    start_date: str = Query(..., description="Start date for the data (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date for the data (YYYY-MM-DD)"),
    page_size: int = Query(10, description="Number of results per page"),
    page_no: int = Query(1, description="Page number to fetch"),
):
    api_path = "/analytics/202409/shop_videos/performance"
    params = {
        "shop_id": 7496217208817354793,
        "start_date_ge": start_date,
        "end_date_lt": end_date,
        "page_size": page_size,
        "page_no": page_no,
        "shop_cipher": "TTP_ZxmgLgAAAAAdwMla_v60G1uDro76Xyg8"
    }

    all_videos = []
    next_page_token = None

    while True:
        if next_page_token:
            params["next_page_token"] = next_page_token
        
        # Call the TikTok API to fetch video performance data using GET method
        response_data = call_tiktok_api(api_path, params=params, method="GET")
        
        # Check if the response contains the 'videos' key
        if "videos" not in response_data.get("data", {}):
            raise KeyError("'videos' key is missing in the response data.")

        all_videos.extend(response_data["data"]["videos"])

        # Check for the next page token
        next_page_token = response_data["data"].get("next_page_token")
        
        if not next_page_token:
            break  # Exit the loop if there are no more pages

    # Process and format the results
    videos_performance = []
    for video in all_videos:
        video_info = {
            "video_id": video["id"],
            "title": video["title"],
            "username": video["username"],
            "gmv": video["gmv"]["amount"],
            "sku_orders": video["sku_orders"],
            "units_sold": video["units_sold"],
            "views": video["views"],
            "click_through_rate": video["click_through_rate"],
            "video_post_time": video["video_post_time"],
            "products": [{"product_id": product["id"], "product_name": product["name"]} for product in video["products"]]
        }
        videos_performance.append(video_info)

    return {"videos_performance": videos_performance}



@app.get("/flash_sales_performance")
async def flash_sales_performance(
    start_date: str = Query(..., description="Start date for the data (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date for the data (YYYY-MM-DD)"),
    page_size: int = Query(10, description="Number of results per page"),
    page_no: int = Query(1, description="Page number to fetch"),
):
    api_path = "/order/202309/orders/search"
    params = {
        "shop_id": 7496217208817354793,
        "start_date_ge": start_date,
        "end_date_lt": end_date,
        "page_size": page_size,
        "page_no": page_no,
        "shop_cipher": "TTP_ZxmgLgAAAAAdwMla_v60G1uDro76Xyg8"
    }

    all_orders = []
    next_page_token = None

    while True:
        if next_page_token:
            params["next_page_token"] = next_page_token
        
        # Call the TikTok API to fetch order data
        response_data = call_tiktok_api(api_path, params=params, method="POST")
        
        # Debugging: Print the full response to understand its structure
        print(json.dumps(response_data, indent=4))  # Pretty print the response for debugging
        
        # Check if the response contains orders
        if "orders" not in response_data.get("data", {}):
            print("No orders key found in the response data.")
            return {"status": "error", "message": "Orders data not found in the response."}

        all_orders.extend(response_data["data"]["orders"])

        # Check for the next page token
        next_page_token = response_data["data"].get("next_page_token")
        
        if not next_page_token:
            break  # Exit the loop if there are no more pages

    # Process and filter orders to analyze flash sales performance
    flash_sales_performance = defaultdict(int)
    total_sales = 0
    total_orders = len(all_orders)

    for order in all_orders:
        # You can filter for flash sales based on specific order criteria or tags, e.g., order type
        if order.get("order_type") == "ZERO_LOTTERY":
            for line_item in order.get("line_items", []):
                product_id = line_item.get("product_id")
                sale_price = float(line_item.get("sale_price", 0))
                total_sales += sale_price
                flash_sales_performance[product_id] += sale_price

    # Format the result for easier understanding
    flash_sales_summary = [{"product_id": product_id, "total_sales": total_sales} for product_id, total_sales in flash_sales_performance.items()]

    return {
        "total_orders": total_orders,
        "flash_sales_summary": flash_sales_summary,
        "total_sales": total_sales
    }



@app.get("/fetch_orders_data")
async def fetch_orders_data(
    start_date: str = Query(..., description="Start date for the data (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date for the data (YYYY-MM-DD)"),
    page_size: int = Query(10, description="Number of results per page"),
    page_no: int = Query(1, description="Page number to fetch"),
):
    api_path = "/order/202309/orders/search"  # API path to fetch orders data
    params = {
        "shop_id": "7496217208817354793",  # Replace with actual shop ID
        "start_date_ge": start_date,
        "end_date_lt": end_date,
        "page_size": page_size,
        "page_no": page_no,
        "shop_cipher": "TTP_ZxmgLgAAAAAdwMla_v60G1uDro76Xyg8"
    }

    try:
        # Call the TikTok API to fetch order data
        response_data = call_tiktok_api(api_path, params=params, method="POST")
        
        # Log the full response for debugging
        print(f"Response Data: {json.dumps(response_data, indent=4)}")  # Pretty print the response for debugging

        # Return the fetched data to the user
        return {
            "status": "success",
            "data": response_data  # Return the full response data from TikTok
        }
        
    except HTTPException as e:
        # Handle any HTTP errors (e.g., invalid parameters, network errors)
        raise HTTPException(status_code=e.status_code, detail=f"Error fetching data: {e.detail}")
    except Exception as e:
        # Handle any other errors (e.g., issues with the TikTok API response)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


def get_top_selling_skus_from_orders(orders, top_n=10):
    sku_sales = {}

    for order in orders:
        for line_item in order.get("line_items", []):
            sku_id = line_item.get("sku_id")
            sku_name = line_item.get("sku_name")
            product_id = line_item.get("product_id")
            product_name = line_item.get("product_name")
            units_sold = int(line_item.get("quantity", 1))
            sale_amount = float(line_item.get("sale_price", 0)) * units_sold

            if sku_id not in sku_sales:
                sku_sales[sku_id] = {
                    "sku_id": sku_id,
                    "sku_name": sku_name,
                    "product_id": product_id,
                    "product_name": product_name,
                    "units_sold": 0,
                    "total_sales": 0.0,
                }

            sku_sales[sku_id]["units_sold"] += units_sold
            sku_sales[sku_id]["total_sales"] += sale_amount

    # Sort SKUs by units sold
    top_skus = sorted(sku_sales.values(), key=lambda x: x["units_sold"], reverse=True)[:top_n]
    return top_skus



async def fetch_orders_data(start_date: str, end_date: str, page_size: int = 100, page_no: int = 1):
    api_path = "/order/202309/orders/search"
    params = {
        "shop_id": "7496217208817354793",
        "start_date_ge": start_date,
        "end_date_lt": end_date,
        "page_size": page_size,
        "page_no": page_no,
        "shop_cipher": "TTP_ZxmgLgAAAAAdwMla_v60G1uDro76Xyg8"
    }
    all_orders = []
    next_page_token = None

    while True:
        if next_page_token:
            params["next_page_token"] = next_page_token

        response_data = call_tiktok_api(api_path, params=params, method="POST")
        if "orders" in response_data.get("data", {}):
            all_orders.extend(response_data["data"]["orders"])
        else:
            break

        next_page_token = response_data["data"].get("next_page_token")
        if not next_page_token:
            break

    return all_orders  # <<--- FIXED: No json.dumps

@app.get("/top_selling_skus")
async def top_selling_skus(
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
    top_n: int = Query(10, description="Number of top SKUs to return"),
    page_size: int = Query(100, description="Page size per request"),
    page_no: int = Query(1, description="Page number"),
):
    # Fetch orders from TikTok API
    orders = await fetch_orders_data(start_date, end_date, page_size=page_size, page_no=page_no)
    # Aggregate and return top SKUs
    top_skus = get_top_selling_skus_from_orders(orders, top_n=top_n)
    return {"top_selling_skus": top_skus}



@app.get("/sample_application_detail")
async def sample_application_detail(
    sample_application_id: str = Query(..., description="Sample Application ID"),
    product_id: str = Query(..., description="Product ID"),
    application_type: str = Query("FREE_SAMPLE", description="Application Type, e.g. FREE_SAMPLE"),

):
    api_path = "/affiliate_creator/202412/sample_applications/single_query"
    body = {
        "sample_application_id": sample_application_id,
        "product_id": product_id,
        "application_type": application_type
    }

    try:
        response_data = call_tiktok_api(api_path, json_body=body, method="POST")

        print(f"Sample Application Response: {json.dumps(response_data, indent=4)}")  # Debug print

        if response_data.get("code") != 0:
            raise HTTPException(
                status_code=400,
                detail=f"TikTok API error: {response_data.get('message')}"
            )

        application = response_data.get("data", {}).get("sample_application")
        if not application:
            return {
                "status": "not_found",
                "message": "Sample application not found"
            }

        return {
            "status": "success",
            "data": application
        }

    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=f"Error fetching sample application: {e.detail}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


class User(BaseModel):
    id: int
    username: str
    brand_name: Optional[str] = None  # Optional to handle missing brand_name
    brand_id: Optional[int] = None  # Optional to handle missing brand_id

@app.get("/admin/users", response_model=List[User])
async def get_users_and_brands():
    try:
        # Fetch users with their brand_id
        users_response = supabase.table("users").select("id, name, brand_id").execute()

        # Check if the response is successful by examining the `data`
        if not users_response.data:
            raise HTTPException(status_code=404, detail="No users found")

        # Fetch brands to map brand_id to brand_name
        brands_response = supabase.table("brands").select("id, name").execute()

        # Check if the response is successful by examining the `data`
        if not brands_response.data:
            raise HTTPException(status_code=404, detail="No brands found")

        # Create a dictionary to map brand_id to brand_name
        brands_dict = {brand["id"]: brand["name"] for brand in brands_response.data}

        # Combine users with their corresponding brand names
        users_with_brands = [{
            "id": user["id"],
            "username": user["name"],
            "brand_name": brands_dict.get(user["brand_id"], "Unknown"),  # Default to "Unknown" if brand not found
            "brand_id": user.get("brand_id", -1)  # Default to -1 if brand_id is None
        } for user in users_response.data]

        return users_with_brands

    except Exception as e:
        # If any exception occurs, print the error and return it to the client
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching users and brands")




@app.get("/sample_applications")
async def list_sample_applications(
    start_date: str = Query(..., description="Start date for the data (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date for the data (YYYY-MM-DD)"),
    status: str = Query(None, description="Filter by status: PENDING, ACCEPTED, REJECTED, ALL"),
    application_type: str = Query("FREE_SAMPLE", description="Application Type, e.g. FREE_SAMPLE"),
    page_size: int = Query(20, description="Number of results per page"),
    page_no: int = Query(1, description="Page number to fetch"),
):
    """
    Fetch list of sample applications with filtering options
    """
    api_path = "/affiliate_creator/202412/sample_applications/search"
    
    # Build the request body according to TikTok API requirements
    body = {
        "start_date_ge": start_date,
        "end_date_lt": end_date,
        "application_type": application_type,
        "page_size": page_size,
        "page_no": page_no
    }
    
    # Add status filter if provided
    if status and status != "ALL":
        body["status"] = status

    try:
        response_data = call_tiktok_api(api_path, json_body=body, method="POST")
        
        print(f"Sample Applications Response: {json.dumps(response_data, indent=4)}")  # Debug print

        if response_data.get("code") != 0:
            raise HTTPException(
                status_code=400,
                detail=f"TikTok API error: {response_data.get('message')}"
            )

        # Extract applications data
        applications_data = response_data.get("data", {})
        applications = applications_data.get("sample_applications", [])
        
        # Process and format the applications for frontend
        formatted_applications = []
        for app in applications:
            formatted_app = {
                "sample_application_id": app.get("sample_application_id"),
                "product_id": app.get("product_id"),
                "product_name": app.get("product_name", "N/A"),
                "creator_id": app.get("creator_id"),
                "creator_name": app.get("creator_name", "N/A"),
                "creator_username": app.get("creator_username", "N/A"),
                "status": app.get("status"),
                "application_type": app.get("application_type"),
                "create_time": app.get("create_time"),
                "update_time": app.get("update_time"),
                "sample_quantity": app.get("sample_quantity", 1),
                "shipping_address": app.get("shipping_address", {}),
                "creator_follower_count": app.get("creator_follower_count", 0),
                "expected_video_count": app.get("expected_video_count", 0)
            }
            formatted_applications.append(formatted_app)

        return {
            "status": "success",
            "data": {
                "applications": formatted_applications,
                "total_count": applications_data.get("total_count", len(formatted_applications)),
                "has_more": applications_data.get("has_more", False)
            }
        }

    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=f"Error fetching sample applications: {e.detail}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/sample_applications/{sample_application_id}/update_status")
async def update_sample_application_status(
    sample_application_id: str = Path(..., description="Sample Application ID"),
    status: str = Query(..., description="New status: ACCEPTED, REJECTED"),
    product_id: str = Query(..., description="Product ID"),
    notes: str = Query(None, description="Optional notes for the status update")
):
    """
    Update the status of a sample application
    """
    api_path = "/affiliate_creator/202412/sample_applications/update_status"
    
    body = {
        "sample_application_id": sample_application_id,
        "product_id": product_id,
        "status": status
    }
    
    if notes:
        body["notes"] = notes

    try:
        response_data = call_tiktok_api(api_path, json_body=body, method="POST")
        
        print(f"Update Status Response: {json.dumps(response_data, indent=4)}")  # Debug print

        if response_data.get("code") != 0:
            raise HTTPException(
                status_code=400,
                detail=f"TikTok API error: {response_data.get('message')}"
            )

        return {
            "status": "success",
            "message": f"Sample application status updated to {status}",
            "data": response_data.get("data", {})
        }

    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=f"Error updating status: {e.detail}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/sample_applications/statistics")
async def get_sample_application_statistics(
    start_date: str = Query(..., description="Start date for the data (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date for the data (YYYY-MM-DD)"),
):
    """
    Get statistics for sample applications (total, accepted, pending, etc.)
    """
    try:
        # Fetch all applications for the date range
        api_path = "/affiliate_creator/202412/sample_applications/search"
        body = {
            "start_date_ge": start_date,
            "end_date_lt": end_date,
            "application_type": "FREE_SAMPLE",
            "page_size": 100,  # Get more data for statistics
            "page_no": 1
        }

        response_data = call_tiktok_api(api_path, json_body=body, method="POST")
        
        if response_data.get("code") != 0:
            raise HTTPException(
                status_code=400,
                detail=f"TikTok API error: {response_data.get('message')}"
            )

        applications = response_data.get("data", {}).get("sample_applications", [])
        
        # Calculate statistics
        stats = {
            "total_applications": len(applications),
            "pending_applications": len([app for app in applications if app.get("status") == "PENDING"]),
            "accepted_applications": len([app for app in applications if app.get("status") == "ACCEPTED"]),
            "rejected_applications": len([app for app in applications if app.get("status") == "REJECTED"]),
            "total_samples_requested": sum([app.get("sample_quantity", 1) for app in applications]),
            "unique_creators": len(set([app.get("creator_id") for app in applications if app.get("creator_id")])),
            "unique_products": len(set([app.get("product_id") for app in applications if app.get("product_id")]))
        }
        
        # Calculate acceptance rate
        total_processed = stats["accepted_applications"] + stats["rejected_applications"]
        stats["acceptance_rate"] = (stats["accepted_applications"] / total_processed * 100) if total_processed > 0 else 0

        return {
            "status": "success",
            "data": stats
        }

    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=f"Error fetching statistics: {e.detail}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    


# Pydantic models for inventory
class StockAlert(BaseModel):
    brand_id: int
    sku_id: int
    sku_name: str
    current_stock: int
    threshold: int
    alert_level: str
    priority: str

class InventoryThreshold(BaseModel):
    sku_id: str
    threshold: int

    
# Slack notification functions
async def send_slack_webhook_alert(alert_data: Dict[str, Any], webhook_url: str = None):
    """Send alert to Slack using webhook URL"""
    # Use provided webhook or fallback to global
    slack_url = webhook_url or SLACK_WEBHOOK_URL
    
    if not slack_url:
        print("Warning: No Slack webhook URL configured")
        return False
    
    # Create Slack message blocks for better formatting
    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": f"🚨 {'OUT OF STOCK' if alert_data['current_stock'] == 0 else 'LOW STOCK'} ALERT"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn", 
                    "text": f"*SKU:* {alert_data['sku_name']}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Current Stock:* {alert_data['current_stock']}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Threshold:* {alert_data['threshold']}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Priority:* {alert_data['priority'].upper()}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Alert Time:* {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
                }
            ]
        }
    ]
    
    # Add action buttons for quick access
    if alert_data['current_stock'] == 0:
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "⚠️ *This SKU is completely out of stock and needs immediate attention!*"
            }
        })
    
    payload = {
        "blocks": blocks,
        "text": f"Stock Alert: {alert_data['sku_name']} - {alert_data['current_stock']} remaining"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(slack_url, json=payload) as response:
                if response.status == 200:
                    print(f"✅ Slack alert sent for {alert_data['sku_name']}")
                    return True
                else:
                    print(f"❌ Failed to send Slack alert: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Error sending Slack alert: {str(e)}")
        return False

async def send_slack_bot_alert(alert_data: Dict[str, Any]):
    """Send alert using Slack Bot Token (alternative method)"""
    if not SLACK_BOT_TOKEN:
        print("Warning: SLACK_BOT_TOKEN not configured")
        return False
    
    url = "https://slack.com/api/chat.postMessage"
    headers = {
        "Authorization": f"Bearer {SLACK_BOT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Format message with emoji based on severity
    emoji = "🚨" if alert_data['current_stock'] == 0 else "⚠️"
    
    payload = {
        "channel": SLACK_CHANNEL,
        "text": f"{emoji} Stock Alert: {alert_data['sku_name']}",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"{emoji} Stock Alert: {alert_data['sku_name']}"
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*SKU:* {alert_data['sku_name']}"},
                    {"type": "mrkdwn", "text": f"*Current Stock:* {alert_data['current_stock']}"},
                    {"type": "mrkdwn", "text": f"*Threshold:* {alert_data['threshold']}"},
                    {"type": "mrkdwn", "text": f"*Priority:* {alert_data['priority'].upper()}"}
                ]
            }
        ]
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=payload) as response:
                if response.status == 200:
                    print(f"✅ Slack bot alert sent for {alert_data['sku_name']}")
                    return True
                else:
                    print(f"❌ Failed to send Slack bot alert: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Error sending Slack bot alert: {str(e)}")
        return False

async def fetch_inventory_data_from_tiktok():
    """Fetch inventory data from TikTok Shop API"""
    api_path = "/product/202309/products/search"
    params = {
        "shop_id": "7496217208817354793",
        "shop_cipher": "TTP_ZxmgLgAAAAAdwMla_v60G1uDro76Xyg8",
        "page_size": 100,
        "page_no": 1
    }

    all_products = []
    next_page_token = None
    
    while True:
        if next_page_token:
            params["next_page_token"] = next_page_token
        
        try:
            response_data = call_tiktok_api(api_path, params=params, method="POST")
            
            if response_data.get("code") != 0:
                raise HTTPException(status_code=400, detail=f"TikTok API error: {response_data.get('message')}")

            products = response_data.get("data", {}).get("products", [])
            all_products.extend(products)
            
            next_page_token = response_data.get("data", {}).get("next_page_token")
            if not next_page_token:
                break
                
        except Exception as e:
            print(f"❌ Error fetching inventory data: {str(e)}")
            break
    
    return all_products


async def get_slack_webhook_for_brand(brand_id: int):
    """Get Slack webhook URL for a specific brand"""
    try:
        result = supabase.table("brands").select("slack_webhook_url").eq("id", brand_id).execute()
        
        if result.data and result.data[0].get("slack_webhook_url"):
            return result.data[0]["slack_webhook_url"]
        
        # Fallback to global webhook from env
        return SLACK_WEBHOOK_URL
        
    except Exception as e:
        print(f"❌ Error fetching brand Slack webhook: {str(e)}")
        return SLACK_WEBHOOK_URL


# Core inventory functions
async def fetch_inventory_data_from_db(brand_id: int):
    """Fetch inventory data from database SKUs table"""
    try:
        # Fetch SKUs for the specific brand from database
        result = supabase.table("skus").select("*").eq("brand_id", brand_id).execute()
        
        if not result.data:
            print(f"No SKUs found for brand_id: {brand_id}")
            return []
        
        print(f"✅ Fetched {len(result.data)} SKUs for brand {brand_id}")
        return result.data
        
    except Exception as e:
        print(f"❌ Error fetching inventory data: {str(e)}")
        return []


##############################################
    

async def save_alert_to_database(alert_data: Dict[str, Any]):
    """Save alert to alerts table to prevent duplicate notifications"""
    try:
        # Check if alert was already sent recently (within last hour)
        one_hour_ago = (datetime.now() - timedelta(hours=1)).isoformat()
        
        existing_alert = supabase.table("alerts").select("*").eq(
            "brand_id", alert_data["brand_id"]
        ).eq("alert_type", "low_inventory").gte("sent_at", one_hour_ago).execute()
        
        # Check if there's already an alert for this specific SKU
        for alert in existing_alert.data:
            if f"SKU: {alert_data['sku_name']}" in alert.get("message", ""):
                print(f"⏭️ Alert for {alert_data['sku_name']} already sent recently")
                return False
        
        # Save new alert
        alert_message = f"Low stock alert: SKU {alert_data['sku_name']} has {alert_data['current_stock']} units remaining (threshold: {alert_data['threshold']})"
        
        result = supabase.table("alerts").insert({
            "brand_id": alert_data["brand_id"],
            "alert_type": "low_inventory",
            "message": alert_message,
            "sent_at": datetime.now().isoformat(),
            "delivery_method": "slack"
        }).execute()
        
        return True
    except Exception as e:
        print(f"❌ Error saving alert to database: {e}")
        return False

async def check_stock_and_send_alerts_db(brand_id: int):
    """Main function to check stock levels from database and send alerts for a specific brand"""
    print(f"🔍 Starting stock level check for brand {brand_id}...")
    
    # Fetch inventory data from database
    skus = await fetch_inventory_data_from_db(brand_id)
    
    if not skus:
        print(f"No SKUs found for brand {brand_id}")
        return []
    
    # Get brand-specific Slack webhook
    slack_webhook = await get_slack_webhook_for_brand(brand_id)
    
    alerts_sent = 0
    low_stock_items = []
    
    for sku in skus:
        sku_id = sku.get("id")
        sku_name = sku.get("name", "Unknown SKU")
        current_stock = sku.get("stock_count", 0)
        threshold = sku.get("low_stock_threshold", 10)  # Use threshold from SKU table
        
        # Check if stock is below threshold
        if current_stock <= threshold:
            alert_data = {
                "brand_id": brand_id,
                "sku_id": sku_id,
                "sku_name": sku_name,
                "current_stock": current_stock,
                "threshold": threshold,
                "alert_level": "out_of_stock" if current_stock == 0 else "low_stock",
                "priority": "high" if current_stock == 0 else "medium"
            }
            
            low_stock_items.append(alert_data)
            
            # Save to database (check for duplicates)
            if await save_alert_to_database(alert_data):
                # Send Slack alert using brand-specific webhook
                slack_sent = await send_slack_webhook_alert(alert_data, slack_webhook)
                
                if slack_sent:
                    alerts_sent += 1
                    print(f"📤 Alert sent for: {sku_name} ({current_stock} remaining)")
                else:
                    print(f"❌ Failed to send alert for: {sku_name}")
    
    print(f"✅ Stock check complete for brand {brand_id}. {alerts_sent} alerts sent for {len(low_stock_items)} low stock items.")
    return low_stock_items

async def check_stock_and_send_alerts_tiktok(default_threshold: int = 10, default_brand_id: int = 1):
    """Main function to check stock levels from TikTok API and send alerts"""
    print("🔍 Starting stock level check from TikTok API...")
    
    # Fetch inventory data from TikTok API
    products = await fetch_inventory_data_from_tiktok()
    
    if not products:
        print("❌ No products found from TikTok API")
        return []
    
    alerts_sent = 0
    low_stock_items = []
    
    for product in products:
        product_id = product.get("id")
        product_name = product.get("title", "Unknown Product")
        
        print(f"🔍 Checking product: {product_name} (ID: {product_id})")
        
        # Check each SKU
        for sku in product.get("skus", []):
            sku_id = sku.get("id")
            sku_name = sku.get("seller_sku", "Unknown SKU")
            
            # FIXED: TikTok API uses 'inventory' not 'stock_infos'
            inventory_list = sku.get("inventory", [])
            if not inventory_list:
                print(f"⚠️ No inventory data for SKU: {sku_name}")
                continue
            
            # Calculate total stock across all warehouses
            total_stock = 0
            warehouse_details = []
            
            for inventory_item in inventory_list:
                quantity = inventory_item.get("quantity", 0)
                warehouse_id = inventory_item.get("warehouse_id", "unknown")
                total_stock += quantity
                warehouse_details.append({
                    "warehouse_id": warehouse_id,
                    "quantity": quantity
                })
            
            print(f"📦 SKU {sku_name}: {total_stock} total stock across {len(warehouse_details)} warehouses")
            
            # Use default threshold since we don't have brand mapping from TikTok API
            threshold = default_threshold
            
            # Check if stock is below threshold
            if total_stock <= threshold:
                alert_data = {
                    "brand_id": default_brand_id,  # Use provided default brand ID
                    "sku_id": sku_id,
                    "sku_name": sku_name,
                    "current_stock": total_stock,
                    "threshold": threshold,
                    "alert_level": "out_of_stock" if total_stock == 0 else "low_stock",
                    "priority": "high" if total_stock == 0 else "medium",
                    "warehouse_details": warehouse_details,
                    "product_name": product_name,
                    "product_id": product_id
                }
                
                low_stock_items.append(alert_data)
                
                # Save to database (check for duplicates)
                if await save_alert_to_database(alert_data):
                    # Send Slack alert
                    slack_sent = False
                    
                    # Try webhook first, then bot token
                    if SLACK_WEBHOOK_URL:
                        slack_sent = await send_slack_webhook_alert(alert_data)
                    elif SLACK_BOT_TOKEN:
                        slack_sent = await send_slack_bot_alert(alert_data)
                    
                    if slack_sent:
                        alerts_sent += 1
                        print(f"📤 Alert sent for: {product_name} - {sku_name} ({total_stock} remaining)")
                    else:
                        print(f"❌ Failed to send alert for: {product_name} - {sku_name}")
                else:
                    print(f"⏭️ Duplicate alert skipped for: {sku_name}")
            else:
                print(f"✅ SKU {sku_name} stock is healthy: {total_stock} > {threshold}")
    
    print(f"✅ Stock check complete. {alerts_sent} alerts sent for {len(low_stock_items)} low stock items.")
    return low_stock_items

# FastAPI Endpoints
@app.get("/inventory/check-stock")
async def manual_stock_check(
    brand_id: int = Query(..., description="Brand ID to check stock for"),
    send_alerts: bool = Query(True, description="Whether to send Slack alerts"),
    source: str = Query("database", description="Source: 'database' or 'tiktok'")
):
    """Manually trigger stock level check for a specific brand"""
    try:
        if source == "database":
            if send_alerts:
                low_stock_items = await check_stock_and_send_alerts_db(brand_id)
            else:
                # Just check without sending alerts
                skus = await fetch_inventory_data_from_db(brand_id)
                
                low_stock_items = []
                for sku in skus:
                    current_stock = sku.get("stock_count", 0)
                    threshold = sku.get("low_stock_threshold", 10)
                    
                    if current_stock <= threshold:
                        low_stock_items.append({
                            "brand_id": brand_id,
                            "sku_id": sku.get("id"),
                            "sku_name": sku.get("name"),
                            "current_stock": current_stock,
                            "threshold": threshold,
                            "alert_level": "out_of_stock" if current_stock == 0 else "low_stock"
                        })
        else:  # source == "tiktok"
            if send_alerts:
                low_stock_items = await check_stock_and_send_alerts_tiktok(10, brand_id)
            else:
                # Just check TikTok without sending alerts
                products = await fetch_inventory_data_from_tiktok()
                low_stock_items = []
                
                for product in products:
                    for sku in product.get("skus", []):
                        # FIXED: Use 'inventory' instead of 'stock_infos'
                        inventory_list = sku.get("inventory", [])
                        if inventory_list:
                            total_stock = sum(item.get("quantity", 0) for item in inventory_list)
                            threshold = 10  # default
                            
                            if total_stock <= threshold:
                                low_stock_items.append({
                                    "brand_id": brand_id,
                                    "sku_id": sku.get("id"),
                                    "sku_name": sku.get("seller_sku"),
                                    "current_stock": total_stock,
                                    "threshold": threshold,
                                    "alert_level": "out_of_stock" if total_stock == 0 else "low_stock",
                                    "product_name": product.get("title"),
                                    "product_id": product.get("id")
                                })
        
        return {
            "status": "success",
            "message": f"Found {len(low_stock_items)} items below threshold for brand {brand_id}",
            "low_stock_items": low_stock_items,
            "alerts_sent": send_alerts,
            "source": source
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking stock: {str(e)}")

@app.get("/inventory/check-all-brands")
async def check_all_brands_stock(
    send_alerts: bool = Query(True, description="Whether to send Slack alerts")
):
    """Check stock levels for all brands using database"""
    try:
        # Get all brands
        brands_result = supabase.table("brands").select("id, name").execute()
        
        if not brands_result.data:
            return {
                "status": "success",
                "message": "No brands found",
                "results": []
            }
        
        all_results = []
        
        for brand in brands_result.data:
            brand_id = brand["id"]
            brand_name = brand["name"]
            
            print(f"🔍 Checking stock for brand: {brand_name} (ID: {brand_id})")
            
            if send_alerts:
                low_stock_items = await check_stock_and_send_alerts_db(brand_id)
            else:
                skus = await fetch_inventory_data_from_db(brand_id)
                low_stock_items = []
                
                for sku in skus:
                    current_stock = sku.get("stock_count", 0)
                    threshold = sku.get("low_stock_threshold", 10)
                    
                    if current_stock <= threshold:
                        low_stock_items.append({
                            "brand_id": brand_id,
                            "sku_id": sku.get("id"),
                            "sku_name": sku.get("name"),
                            "current_stock": current_stock,
                            "threshold": threshold,
                            "alert_level": "out_of_stock" if current_stock == 0 else "low_stock"
                        })
            
            all_results.append({
                "brand_id": brand_id,
                "brand_name": brand_name,
                "low_stock_count": len(low_stock_items),
                "low_stock_items": low_stock_items
            })
        
        total_alerts = sum(len(result["low_stock_items"]) for result in all_results)
        
        return {
            "status": "success",
            "message": f"Checked {len(brands_result.data)} brands, found {total_alerts} total low stock items",
            "results": all_results,
            "alerts_sent": send_alerts
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking all brands stock: {str(e)}")

@app.get("/inventory/alerts/history")
async def get_alert_history(
    brand_id: Optional[int] = Query(None, description="Filter by brand ID"),
    limit: int = Query(50, description="Number of alerts to retrieve"),
    days: int = Query(7, description="Number of days to look back")
):
    """Get history of sent alerts"""
    try:
        cutoff_date = (datetime.now() - timedelta(days=days)).isoformat()
        
        query = supabase.table("alerts").select("*").eq("alert_type", "low_inventory").gte(
            "sent_at", cutoff_date
        ).order("sent_at", desc=True).limit(limit)
        
        if brand_id:
            query = query.eq("brand_id", brand_id)
        
        result = query.execute()
        
        return {
            "status": "success",
            "alerts": result.data,
            "count": len(result.data),
            "brand_id": brand_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching alert history: {str(e)}")

@app.post("/inventory/update-threshold")
async def update_sku_threshold(
    sku_id: int = Query(..., description="SKU ID"),
    threshold: int = Query(..., description="New threshold value")
):
    """Update stock threshold for a specific SKU"""
    try:
        result = supabase.table("skus").update({
            "low_stock_threshold": threshold
        }).eq("id", sku_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="SKU not found")
        
        return {
            "status": "success",
            "message": f"Threshold updated to {threshold} for SKU ID {sku_id}",
            "data": result.data[0]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating threshold: {str(e)}")

@app.post("/inventory/update-stock")
async def update_sku_stock(
    sku_id: int = Query(..., description="SKU ID"),
    stock_count: int = Query(..., description="New stock count")
):
    """Update stock count for a specific SKU"""
    try:
        result = supabase.table("skus").update({
            "stock_count": stock_count
        }).eq("id", sku_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="SKU not found")
        
        return {
            "status": "success",
            "message": f"Stock count updated to {stock_count} for SKU ID {sku_id}",
            "data": result.data[0]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating stock: {str(e)}")

@app.get("/inventory/skus")
async def get_all_skus(
    brand_id: Optional[int] = Query(None, description="Filter by brand ID")
):
    """Get all SKUs, optionally filtered by brand"""
    try:
        query = supabase.table("skus").select("*")
        
        if brand_id:
            query = query.eq("brand_id", brand_id)
        
        result = query.execute()
        
        return {
            "status": "success",
            "skus": result.data,
            "count": len(result.data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching SKUs: {str(e)}")

@app.get("/inventory/brands")
async def get_all_brands():
    """Get all brands"""
    try:
        result = supabase.table("brands").select("*").execute()
        
        return {
            "status": "success",
            "brands": result.data,
            "count": len(result.data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching brands: {str(e)}")

@app.post("/inventory/test-slack")
async def test_slack_integration(
    brand_id: Optional[int] = Query(None, description="Brand ID to test with")
):
    """Test Slack integration with a sample alert"""
    test_alert = {
        "brand_id": brand_id or 1,
        "sku_id": 999,
        "sku_name": "TEST-SKU-001",
        "current_stock": 5,
        "threshold": 10,
        "alert_level": "low_stock",
        "priority": "medium"
    }
    
    try:
        slack_sent = False
        method_used = "none"
        
        # Get brand-specific webhook if brand_id provided
        if brand_id:
            brand_webhook = await get_slack_webhook_for_brand(brand_id)
            if brand_webhook:
                slack_sent = await send_slack_webhook_alert(test_alert, brand_webhook)
                method_used = "brand_webhook"
        
        # Fallback to global methods
        if not slack_sent:
            if SLACK_WEBHOOK_URL:
                slack_sent = await send_slack_webhook_alert(test_alert)
                method_used = "global_webhook"
            elif SLACK_BOT_TOKEN:
                slack_sent = await send_slack_bot_alert(test_alert)
                method_used = "bot_token"
        
        if not slack_sent and method_used == "none":
            return {
                "status": "error",
                "message": "No Slack configuration found. Please set SLACK_WEBHOOK_URL or SLACK_BOT_TOKEN in your .env file, or configure brand-specific webhook URLs"
            }
        
        return {
            "status": "success" if slack_sent else "failed",
            "message": f"Test alert {'sent successfully' if slack_sent else 'failed to send'} using {method_used}",
            "test_data": test_alert
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error testing Slack integration: {str(e)}"
        }

# Background task to run periodic stock checks
async def run_periodic_stock_check(interval_minutes: int = 60):
    """Run stock checks periodically for all brands"""
    while True:
        try:
            print(f"🔄 Running scheduled stock check...")
            
            # Get all brands and check each one
            brands_result = supabase.table("brands").select("id, name").execute()
            
            for brand in brands_result.data:
                brand_id = brand["id"]
                print(f"Checking brand {brand['name']} (ID: {brand_id})")
                await check_stock_and_send_alerts_db(brand_id)
            
            await asyncio.sleep(interval_minutes * 60)  # Convert to seconds
        except Exception as e:
            print(f"❌ Error in periodic stock check: {str(e)}")
            await asyncio.sleep(300)  # Wait 5 minutes before retrying

@app.post("/inventory/start-monitoring")
async def start_inventory_monitoring(
    interval_minutes: int = Query(60, description="Check interval in minutes")
):
    """Start continuous inventory monitoring for all brands"""
    try:
        # Start background task
        asyncio.create_task(run_periodic_stock_check(interval_minutes))
        
        return {
            "status": "success",
            "message": f"Inventory monitoring started with {interval_minutes} minute intervals",
            "note": "Monitoring will run in the background for all brands. Use /inventory/check-stock for manual checks."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting monitoring: {str(e)}")

# Add a debug endpoint to test TikTok API response structure
@app.get("/inventory/debug-tiktok")
async def debug_tiktok_api():
    """Debug endpoint to see actual TikTok API response structure"""
    try:
        products = await fetch_inventory_data_from_tiktok()
        
        if not products:
            return {
                "status": "error",
                "message": "No products returned from TikTok API"
            }
        
        # Return first product structure for debugging
        sample_product = products[0] if products else None
        
        return {
            "status": "success",
            "total_products": len(products),
            "sample_product_structure": sample_product,
            "available_fields": list(sample_product.keys()) if sample_product else [],
            "sku_structure": sample_product.get("skus", [{}])[0] if sample_product and sample_product.get("skus") else None
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error debugging TikTok API: {str(e)}"
        }
    



   
# @app.get("/inventory/alerts/history")
# async def get_alert_history(
#     limit: int = Query(50, description="Number of alerts to retrieve"),
#     days: int = Query(7, description="Number of days to look back")
# ):
#     """Get history of sent alerts"""
#     try:
#         cutoff_date = (datetime.now() - timedelta(days=days)).isoformat()
        
#         result = supabase.table("inventory_alerts").select("*").gte(
#             "created_at", cutoff_date
#         ).order("created_at", desc=True).limit(limit).execute()
        
#         return {
#             "status": "success",
#             "alerts": result.data,
#             "count": len(result.data)
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching alert history: {str(e)}")


# @app.post("/inventory/set-threshold")
# async def set_stock_threshold(threshold_data: InventoryThreshold):
#     """Set custom stock threshold for a specific product/SKU"""
#     try:
#         result = supabase.table("stock_thresholds").upsert({
#             "product_id": threshold_data.product_id,
#             "sku_id": threshold_data.sku_id,
#             "threshold": threshold_data.threshold,
#             "updated_at": datetime.now().isoformat()
#         }).execute()
        
#         return {
#             "status": "success",
#             "message": f"Threshold set to {threshold_data.threshold} for SKU {threshold_data.sku_id}",
#             "data": result.data
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error setting threshold: {str(e)}")





# Sample Request Notification Functions
async def send_new_sample_request_alert(sample_data: Dict[str, Any], webhook_url: str = None):
    """Send alert for new sample request"""
    slack_url = webhook_url or SLACK_WEBHOOK_URL
    
    if not slack_url:
        print("Warning: No Slack webhook URL configured for sample request alerts")
        return False
    
    # Create Slack message blocks for new sample request
    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": " NEW SAMPLE REQUEST"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn", 
                    "text": f"*Creator:* {sample_data.get('creator_name', 'N/A')} (@{sample_data.get('creator_username', 'N/A')})"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Product:* {sample_data.get('product_name', 'N/A')}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Quantity:* {sample_data.get('sample_quantity', 1)}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Followers:* {format_number(sample_data.get('creator_follower_count', 0))}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Application ID:* {sample_data.get('sample_application_id', 'N/A')}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Request Time:* {format_timestamp(sample_data.get('create_time'))}"
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Expected Videos:* {sample_data.get('expected_video_count', 0)} videos planned"
            }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "✅ Approve"
                    },
                    "style": "primary",
                    "action_id": "approve_sample",
                    "value": sample_data.get('sample_application_id', '')
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "❌ Reject"
                    },
                    "style": "danger",
                    "action_id": "reject_sample",
                    "value": sample_data.get('sample_application_id', '')
                }
            ]
        }
    ]
    
    payload = {
        "blocks": blocks,
        "text": f"New Sample Request: {sample_data.get('creator_name', 'Unknown')} requested {sample_data.get('product_name', 'Unknown Product')}"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(slack_url, json=payload) as response:
                if response.status == 200:
                    print(f"✅ New sample request alert sent for {sample_data.get('creator_name', 'Unknown')}")
                    return True
                else:
                    print(f"❌ Failed to send sample request alert: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Error sending sample request alert: {str(e)}")
        return False

async def send_stable_unapproved_sample_alert(sample_data: Dict[str, Any], days_pending: int, webhook_url: str = None):
    """Send alert for samples that have been pending too long"""
    slack_url = webhook_url or SLACK_WEBHOOK_URL
    
    if not slack_url:
        print("Warning: No Slack webhook URL configured for stable/unapproved alerts")
        return False
    
    # Determine urgency based on days pending
    if days_pending >= 7:
        urgency = "🔴 HIGH PRIORITY"
        urgency_color = "danger"
    elif days_pending >= 3:
        urgency = "🟡 MEDIUM PRIORITY" 
        urgency_color = "warning"
    else:
        urgency = "🟢 LOW PRIORITY"
        urgency_color = "good"
    
    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": f"⏰ SAMPLE REQUEST NEEDS ATTENTION - {urgency}"
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn", 
                    "text": f"*Creator:* {sample_data.get('creator_name', 'N/A')} (@{sample_data.get('creator_username', 'N/A')})"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Product:* {sample_data.get('product_name', 'N/A')}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Days Pending:* {days_pending} days"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Status:* {sample_data.get('status', 'PENDING')}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Application ID:* {sample_data.get('sample_application_id', 'N/A')}"
                },
                {
                    "type": "mrkdwn",
                    "text": f"*Requested:* {format_timestamp(sample_data.get('create_time'))}"
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"⚠️ *This sample request has been pending for {days_pending} days and needs your attention!*"
            }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "✅ Approve Now"
                    },
                    "style": "primary",
                    "action_id": "approve_sample",
                    "value": sample_data.get('sample_application_id', '')
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "❌ Reject"
                    },
                    "style": "danger", 
                    "action_id": "reject_sample",
                    "value": sample_data.get('sample_application_id', '')
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "📝 Review Details"
                    },
                    "action_id": "review_sample",
                    "value": sample_data.get('sample_application_id', '')
                }
            ]
        }
    ]
    
    payload = {
        "blocks": blocks,
        "text": f"Sample Request Pending {days_pending} days: {sample_data.get('creator_name', 'Unknown')} - {sample_data.get('product_name', 'Unknown Product')}"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(slack_url, json=payload) as response:
                if response.status == 200:
                    print(f"✅ Stable/unapproved sample alert sent for {sample_data.get('creator_name', 'Unknown')} ({days_pending} days)")
                    return True
                else:
                    print(f"❌ Failed to send stable/unapproved alert: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Error sending stable/unapproved alert: {str(e)}")
        return False

# Helper function to format numbers
def format_number(num):
    """Format number with commas"""
    return f"{num:,}" if isinstance(num, (int, float)) else str(num)

# Helper function to format timestamps
def format_timestamp(timestamp):
    """Format timestamp to readable date"""
    if not timestamp:
        return 'N/A'
    try:
        if isinstance(timestamp, (int, float)):
            return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')
        else:
            return str(timestamp)
    except:
        return 'N/A'

# Function to save sample alert to database
async def save_sample_alert_to_database(alert_data: Dict[str, Any], alert_type: str):
    """Save sample alert to alerts table to prevent duplicate notifications"""
    try:
        # Check if alert was already sent recently (within last 24 hours for new requests, 1 hour for pending)
        hours_back = 24 if alert_type == "new_sample_request" else 1
        cutoff_time = (datetime.now() - timedelta(hours=hours_back)).isoformat()
        
        existing_alert = supabase.table("alerts").select("*").eq(
            "alert_type", alert_type
        ).gte("sent_at", cutoff_time).execute()
        
        # Check if there's already an alert for this specific application
        application_id = alert_data.get('sample_application_id')
        for alert in existing_alert.data:
            if application_id and application_id in alert.get("message", ""):
                print(f"⏭️ Alert for application {application_id} already sent recently")
                return False
        
        # Save new alert
        if alert_type == "new_sample_request":
            alert_message = f"New sample request from {alert_data.get('creator_name', 'Unknown')} for {alert_data.get('product_name', 'Unknown Product')} (ID: {application_id})"
        else:
            days_pending = alert_data.get('days_pending', 0)
            alert_message = f"Sample request pending {days_pending} days: {alert_data.get('creator_name', 'Unknown')} - {alert_data.get('product_name', 'Unknown Product')} (ID: {application_id})"
        
        result = supabase.table("alerts").insert({
            "brand_id": alert_data.get("brand_id", 1),  # Default brand if not specified
            "alert_type": alert_type,
            "message": alert_message,
            "sent_at": datetime.now().isoformat(),
            "delivery_method": "slack"
        }).execute()
        
        return True
    except Exception as e:
        print(f"❌ Error saving sample alert to database: {e}")
        return False

# Function to fetch new sample applications
async def fetch_new_sample_applications(hours_back: int = 24):
    """Fetch sample applications created in the last N hours"""
    try:
        # Calculate timestamp for N hours ago
        cutoff_timestamp = int((datetime.now() - timedelta(hours=hours_back)).timestamp())
        
        api_path = "/affiliate_creator/202412/sample_applications/search"
        body = {
            "start_date_ge": (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),  # Last 7 days
            "end_date_lt": datetime.now().strftime('%Y-%m-%d'),
            "application_type": "FREE_SAMPLE",
            "page_size": 100,
            "page_no": 1
        }

        response_data = call_tiktok_api(api_path, json_body=body, method="POST")
        
        if response_data.get("code") != 0:
            print(f"❌ TikTok API error: {response_data.get('message')}")
            return []

        applications = response_data.get("data", {}).get("sample_applications", [])
        
        # Filter for new applications (created in last N hours)
        new_applications = []
        for app in applications:
            create_time = app.get("create_time")
            if create_time and create_time >= cutoff_timestamp:
                new_applications.append(app)
        
        return new_applications
        
    except Exception as e:
        print(f"❌ Error fetching new sample applications: {str(e)}")
        return []

# Function to fetch pending sample applications
async def fetch_pending_sample_applications(min_days_pending: int = 1):
    """Fetch sample applications that have been pending for more than N days"""
    try:
        api_path = "/affiliate_creator/202412/sample_applications/search"
        body = {
            "start_date_ge": (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'),  # Last 30 days
            "end_date_lt": datetime.now().strftime('%Y-%m-%d'),
            "application_type": "FREE_SAMPLE",
            "status": "PENDING",
            "page_size": 100,
            "page_no": 1
        }

        response_data = call_tiktok_api(api_path, json_body=body, method="POST")
        
        if response_data.get("code") != 0:
            print(f"❌ TikTok API error: {response_data.get('message')}")
            return []

        applications = response_data.get("data", {}).get("sample_applications", [])
        
        # Filter for applications pending longer than min_days_pending
        current_timestamp = int(datetime.now().timestamp())
        pending_applications = []
        
        for app in applications:
            create_time = app.get("create_time")
            if create_time:
                days_pending = (current_timestamp - create_time) / (24 * 3600)  # Convert to days
                if days_pending >= min_days_pending:
                    app['days_pending'] = int(days_pending)
                    pending_applications.append(app)
        
        return pending_applications
        
    except Exception as e:
        print(f" Error fetching pending sample applications: {str(e)}")
        return []

# Main monitoring functions
async def check_new_sample_requests(hours_back: int = 1):
    """Check for new sample requests and send alerts"""
    print(f"🔍 Checking for new sample requests in the last {hours_back} hours...")
    
    new_applications = await fetch_new_sample_applications(hours_back)
    
    if not new_applications:
        print(" No new sample requests found")
        return []
    
    alerts_sent = 0
    
    for app in new_applications:
        alert_data = {
            "sample_application_id": app.get("sample_application_id"),
            "creator_name": app.get("creator_name", "N/A"),
            "creator_username": app.get("creator_username", "N/A"),
            "creator_follower_count": app.get("creator_follower_count", 0),
            "product_name": app.get("product_name", "N/A"),
            "product_id": app.get("product_id"),
            "sample_quantity": app.get("sample_quantity", 1),
            "expected_video_count": app.get("expected_video_count", 0),
            "create_time": app.get("create_time"),
            "brand_id": 1  # Default brand, you can map this based on product_id if needed
        }
        
        # Save to database (check for duplicates)
        if await save_sample_alert_to_database(alert_data, "new_sample_request"):
            # Send Slack alert
            slack_sent = await send_new_sample_request_alert(alert_data)
            
            if slack_sent:
                alerts_sent += 1
                print(f"New sample request alert sent for: {alert_data['creator_name']}")
            else:
                print(f"Failed to send alert for: {alert_data['creator_name']}")
    
    print(f"New sample request check complete. {alerts_sent} alerts sent for {len(new_applications)} new requests.")
    return new_applications

async def check_stable_unapproved_samples(min_days_pending: int = 3):
    """Check for samples that have been pending too long and send alerts"""
    print(f"🔍 Checking for samples pending longer than {min_days_pending} days...")
    
    pending_applications = await fetch_pending_sample_applications(min_days_pending)
    
    if not pending_applications:
        print("No samples found that need attention")
        return []
    
    alerts_sent = 0
    
    for app in pending_applications:
        days_pending = app.get('days_pending', 0)
        
        alert_data = {
            "sample_application_id": app.get("sample_application_id"),
            "creator_name": app.get("creator_name", "N/A"),
            "creator_username": app.get("creator_username", "N/A"),
            "product_name": app.get("product_name", "N/A"),
            "product_id": app.get("product_id"),
            "status": app.get("status", "PENDING"),
            "create_time": app.get("create_time"),
            "days_pending": days_pending,
            "brand_id": 1  # Default brand
        }
        
        # Save to database (check for duplicates)
        if await save_sample_alert_to_database(alert_data, "stable_unapproved_sample"):
            # Send Slack alert
            slack_sent = await send_stable_unapproved_sample_alert(alert_data, days_pending)
            
            if slack_sent:
                alerts_sent += 1
                print(f"Stable/unapproved alert sent for: {alert_data['creator_name']} ({days_pending} days)")
            else:
                print(f"Failed to send alert for: {alert_data['creator_name']}")
    
    print(f"Stable/unapproved sample check complete. {alerts_sent} alerts sent for {len(pending_applications)} pending samples.")
    return pending_applications

# FastAPI Endpoints for Sample Request Monitoring

@app.get("/samples/check-new-requests")
async def manual_check_new_requests(
    hours_back: int = Query(1, description="Hours to look back for new requests"),
    send_alerts: bool = Query(True, description="Whether to send Slack alerts")
):
    """Manually check for new sample requests"""
    try:
        if send_alerts:
            new_requests = await check_new_sample_requests(hours_back)
        else:
            # Just fetch without sending alerts
            new_requests = await fetch_new_sample_applications(hours_back)
        
        return {
            "status": "success",
            "message": f"Found {len(new_requests)} new sample requests in the last {hours_back} hours",
            "new_requests": new_requests,
            "alerts_sent": send_alerts
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking new requests: {str(e)}")

@app.get("/samples/check-pending-samples")
async def manual_check_pending_samples(
    min_days_pending: int = Query(3, description="Minimum days pending to trigger alert"),
    send_alerts: bool = Query(True, description="Whether to send Slack alerts")
):
    """Manually check for samples pending too long"""
    try:
        if send_alerts:
            pending_samples = await check_stable_unapproved_samples(min_days_pending)
        else:
            # Just fetch without sending alerts
            pending_samples = await fetch_pending_sample_applications(min_days_pending)
        
        return {
            "status": "success",
            "message": f"Found {len(pending_samples)} samples pending longer than {min_days_pending} days",
            "pending_samples": pending_samples,
            "alerts_sent": send_alerts
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking pending samples: {str(e)}")

@app.post("/samples/test-new-request-alert")
async def test_new_request_alert():
    """Test new sample request alert with sample data"""
    test_data = {
        "sample_application_id": "TEST_12345",
        "creator_name": "Test Creator",
        "creator_username": "testcreator",
        "creator_follower_count": 50000,
        "product_name": "Test Product Sample",
        "product_id": "test_product_123",
        "sample_quantity": 2,
        "expected_video_count": 3,
        "create_time": int(datetime.now().timestamp()),
        "brand_id": 1
    }
    
    try:
        alert_sent = await send_new_sample_request_alert(test_data)
        
        return {
            "status": "success" if alert_sent else "failed",
            "message": f"Test new sample request alert {'sent successfully' if alert_sent else 'failed to send'}",
            "test_data": test_data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error testing new request alert: {str(e)}"
        }

@app.post("/samples/test-pending-alert")
async def test_pending_alert():
    """Test pending sample alert with sample data"""
    test_data = {
        "sample_application_id": "TEST_67890",
        "creator_name": "Test Creator Pending",
        "creator_username": "testpending",
        "product_name": "Test Pending Product",
        "product_id": "test_pending_456",
        "status": "PENDING",
        "create_time": int((datetime.now() - timedelta(days=5)).timestamp()),
        "days_pending": 5,
        "brand_id": 1
    }
    
    try:
        alert_sent = await send_stable_unapproved_sample_alert(test_data, test_data['days_pending'])
        
        return {
            "status": "success" if alert_sent else "failed",
            "message": f"Test pending sample alert {'sent successfully' if alert_sent else 'failed to send'}",
            "test_data": test_data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error testing pending alert: {str(e)}"
        }

# Background monitoring for sample requests
async def run_sample_monitoring(new_request_interval_minutes: int = 15, pending_check_interval_minutes: int = 60):
    """Run continuous monitoring for sample requests"""
    while True:
        try:
            # Check for new requests every 15 minutes (or specified interval)
            print(f"🔄 Running new sample request check...")
            await check_new_sample_requests(hours_back=1)
            
            # Check for pending samples every hour (or specified interval)  
            if datetime.now().minute == 0:  # Only on the hour
                print(f"🔄 Running pending sample check...")
                await check_stable_unapproved_samples(min_days_pending=3)
            
            await asyncio.sleep(new_request_interval_minutes * 60)
        except Exception as e:
            print(f"Error in sample monitoring: {str(e)}")
            await asyncio.sleep(300)  # Wait 5 minutes before retrying

@app.post("/samples/start-monitoring")
async def start_sample_monitoring(
    new_request_interval_minutes: int = Query(15, description="Check interval for new requests in minutes"),
    pending_check_interval_minutes: int = Query(60, description="Check interval for pending samples in minutes")
):
    """Start continuous sample request monitoring"""
    try:
        # Start background task
        asyncio.create_task(run_sample_monitoring(new_request_interval_minutes, pending_check_interval_minutes))
        
        return {
            "status": "success",
            "message": f"Sample monitoring started - New requests: every {new_request_interval_minutes} min, Pending checks: every {pending_check_interval_minutes} min",
            "note": "Monitoring will run in the background. Use manual check endpoints for immediate checks."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting sample monitoring: {str(e)}")

@app.get("/samples/alerts/history")
async def get_sample_alert_history(
    alert_type: str = Query(None, description="Filter by alert type: new_sample_request, stable_unapproved_sample"),
    limit: int = Query(50, description="Number of alerts to retrieve"),
    days: int = Query(7, description="Number of days to look back")
):
    """Get history of sample-related alerts"""
    try:
        cutoff_date = (datetime.now() - timedelta(days=days)).isoformat()
        
        query = supabase.table("alerts").select("*").gte("sent_at", cutoff_date).order("sent_at", desc=True).limit(limit)
        
        if alert_type:
            query = query.eq("alert_type", alert_type)
        else:
            # Get both sample-related alert types
            query = query.in_("alert_type", ["new_sample_request", "stable_unapproved_sample"])
        
        result = query.execute()
        
        return {
            "status": "success",
            "alerts": result.data,
            "count": len(result.data),
            "alert_type": alert_type or "all_sample_alerts"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sample alert history: {str(e)}")

# Configuration endpoint for alert settings
@app.post("/samples/configure-alerts")
async def configure_sample_alerts(
    new_request_enabled: bool = Query(True, description="Enable new request alerts"),
    pending_alerts_enabled: bool = Query(True, description="Enable pending sample alerts"),
    min_days_for_pending_alert: int = Query(3, description="Minimum days pending before alert"),
    new_request_check_hours: int = Query(1, description="Hours to look back for new requests")
):
    """Configure sample alert settings"""
    try:
        # You can save these settings to database or environment
        # For now, just return the configuration
        config = {
            "new_request_alerts": new_request_enabled,
            "pending_alerts": pending_alerts_enabled,
            "min_days_pending": min_days_for_pending_alert,
            "new_request_lookback_hours": new_request_check_hours,
            "updated_at": datetime.now().isoformat()
        }
        
        # Optional: Save to database
        # result = supabase.table("alert_configs").upsert(config).execute()
        
        return {
            "status": "success",
            "message": "Sample alert configuration updated",
            "config": config
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error configuring alerts: {str(e)}")


# Run the FastAPI application with: uvicorn main:app --reload