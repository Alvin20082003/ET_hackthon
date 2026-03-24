# HOW TO SET UP GMAIL & CALENDAR:
# 1. Go to console.cloud.google.com
# 2. Create project -> Enable Gmail API and Google Calendar API
# 3. Create OAuth2 credentials -> Download as credentials.json
# 4. Put credentials.json in backend/ folder
# 5. Run: python gmail_credentials_setup.py
# 6. Follow browser login flow

import os
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar.events'
]

def main():
    if not os.path.exists('credentials.json'):
        print("Error: credentials.json not found in backend folder.")
        print("Please download your OAuth2 credentials from Google Cloud Console.")
        return

    flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
    creds = flow.run_local_server(port=0)
    
    with open('token.json', 'w') as token:
        token.write(creds.to_json())
    
    print("\nGmail and Calendar setup complete!")
    print("Token saved to token.json")

if __name__ == "__main__":
    main()
