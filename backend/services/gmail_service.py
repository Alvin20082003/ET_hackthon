import os
import base64
import logging
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar.events'
]

def get_gmail_service():
    creds = None
    token_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'token.json')
    logging.info(f"Looking for token at: {token_path}")
    
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    else:
        logging.warning(f"token.json not found at {token_path}")
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
                # Save the refreshed token
                with open(token_path, 'w') as f:
                    f.write(creds.to_json())
                logging.info("Gmail token refreshed and saved successfully.")
            except Exception as e:
                logging.warning(f"Could not refresh Gmail token: {e}")
                return None
        else:
            logging.warning("Gmail credentials missing or invalid. Run gmail_credentials_setup.py first.")
            return None
            
    try:
        service = build('gmail', 'v1', credentials=creds, static_discovery=False)
        logging.info("Gmail service built successfully.")
        return service
    except Exception as e:
        logging.error(f"Error building Gmail service: {e}")
        return None

def send_task_assignment_email(task, owner_email):
    service = get_gmail_service()
    if not service:
        return False, "Gmail credentials missing or service unavailable."
    
    sender = os.getenv("GMAIL_SENDER_EMAIL")
    if not sender:
        return False, "GMAIL_SENDER_EMAIL env variable missing."

    message_text = f"""
    <html>
      <body>
        <h2>Task Assignment — MissionControl</h2>
        <p>Hi {task.owner},</p>
        <p>You have been assigned a new task by the Planner Agent.</p>
        <table border="1" cellpadding="5" style="border-collapse: collapse;">
          <tr><td><strong>Task</strong></td><td>{task.title}</td></tr>
          <tr><td><strong>Description</strong></td><td>{task.description}</td></tr>
          <tr><td><strong>Priority</strong></td><td>{task.priority}/5</td></tr>
          <tr><td><strong>Deadline</strong></td><td>{task.deadline}</td></tr>
          <tr><td><strong>SLA</strong></td><td>{task.sla_hours} hours</td></tr>
        </table>
        <p>Log in to MissionControl to track progress.</p>
      </body>
    </html>
    """
    
    message = MIMEText(message_text, 'html')
    message['to'] = owner_email
    message['from'] = sender
    message['subject'] = f"You have been assigned: {task.title} | Due {task.deadline}"
    
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    
    try:
        service.users().messages().send(userId='me', body={'raw': raw}).execute()
        return True, f"Email sent to {owner_email}"
    except Exception as e:
        logging.error(f"Failed to send email: {e}")
        return False, str(e)
