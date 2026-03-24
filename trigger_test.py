import requests
import json

url = "http://127.0.0.1:8000/api/workflow/start"
payload = {"transcript": "Sarah: Need the vendor contract by Sept 20. James, evaluate the numbers. Ravi, send the invoice."}
headers = {'Content-Type': 'application/json'}

try:
    print(f"Sending POST request to {url}...")
    response = requests.post(url, data=json.dumps(payload), headers=headers, timeout=10)
    print(f"Response Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
