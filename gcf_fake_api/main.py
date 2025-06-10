import functions_framework
from flask import jsonify
from dotenv import load_dotenv
import csv
import os

load_dotenv()

expected_api_key = os.environ.get("API_KEY")

# Define the path to your CSV file.
CSV_FILE_PATH = 'load_db.csv'

def select_all_from_db():
    """
    Loads all load data from the CSV file.
    Returns a list of dictionaries, where each dictionary represents a load.
    """
    loads = []
    try:
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                loads.append(row)
        print(f"Successfully loaded {len(loads)} loads from {CSV_FILE_PATH}")
    except FileNotFoundError:
        print(f"Error: {CSV_FILE_PATH} not found. Please ensure it's deployed with your Cloud Function.")
        # Return an empty list if file not found, so the app can still start
        return []
    except Exception as e:
        print(f"An unexpected error occurred while loading CSV: {e}")
        return []
    return loads   

# --- API Endpoints ---

# Endpoint: POST request to BASE_URL
@functions_framework.http
def get_loads(request):        
    """
    Handles POST requests to /.
    1. Checks for a valid API Key in the 'X-API-Key' header.
    2. Returns loads.
    """
    print("Received POST request for /get_loads")

    # --- API Key Authentication ---    

    if not expected_api_key:
        # This indicates a server-side configuration error, not a client error.
        print("Server Error: 'API_KEY' environment variable not set.")
        return jsonify({"error": "Server configuration error: API Key not set."}), 500

    # Get the API key from the 'X-API-Key' header
    client_api_key = request.headers.get('X-API-Key')

    if not client_api_key:
        return jsonify({"error": "Authentication required: 'X-API-Key' header is missing."}), 401
    
    if client_api_key != expected_api_key:
        return jsonify({"error": "Authentication failed: Invalid API Key."}), 401
    
    print("API Key validated successfully.")
    # --- End API Key Authentication ---    

    try:    
        loads = select_all_from_db()
        return jsonify(loads), 200 # Return the list of found loads as JSON
    except Exception as e:
        print(f"An unexpected error occurred during request processing: {e}")
        return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500
