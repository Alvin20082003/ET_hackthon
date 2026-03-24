import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))

from backend.services.gmail_service import get_gmail_service

def test_gmail():
    print(f"DEBUG: Current Working Directory: {os.getcwd()}")
    token_path = os.path.join(os.getcwd(), 'backend', 'token.json')
    print(f"DEBUG: Checking for token at: {token_path}")
    if os.path.exists(token_path):
        print("DEBUG: token.json found.")
    else:
        print("DEBUG: token.json NOT found.")

    # Temporarily change CWD to backend so service finds token.json
    old_cwd = os.getcwd()
    os.chdir(os.path.join(old_cwd, 'backend'))
    
    print("Testing Gmail Service build...")
    service = get_gmail_service()
    if service:
        print("SUCCESS: Gmail service built successfully.")
        
        from backend.services.gmail_service import send_task_assignment_email
        from backend.models import Task
        
        test_task = Task(
            id="test-id",
            title="Test Connection",
            description="Testing MissionControl Gmail integration",
            owner="Tester",
            priority=1,
            deadline="ASAP"
        )
        recipient = os.getenv("GMAIL_SENDER_EMAIL")
        print(f"DEBUG: Attempting to send test email to {recipient}...")
        
        success, msg = send_task_assignment_email(test_task, recipient)
        if success:
            print(f"SUCCESS: Email sent! {msg}")
        else:
            print(f"FAILURE: Email send failed: {msg}")
    else:
        print("FAILURE: Gmail service build failed.")
    
    os.chdir(old_cwd)

if __name__ == "__main__":
    test_gmail()
