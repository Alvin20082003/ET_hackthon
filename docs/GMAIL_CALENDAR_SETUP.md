# Gmail & Google Calendar Setup Guide

## Step-by-Step Instructions to Fix Email and Calendar Failures

---

## Prerequisites

- Google account
- Python 3.9+ installed
- Backend running

---

## Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it "MissionControl" → Click "Create"
4. Wait for project to be created (30 seconds)

---

## Step 2: Enable Gmail API

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click on "Gmail API"
4. Click "Enable"
5. Wait for it to enable (10 seconds)

---

## Step 3: Enable Google Calendar API

1. Still in "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on "Google Calendar API"
4. Click "Enable"
5. Wait for it to enable (10 seconds)

---

## Step 4: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" → Click "Create"
3. Fill in:
   - App name: `MissionControl`
   - User support email: Your email
   - Developer contact: Your email
4. Click "Save and Continue"
5. Click "Add or Remove Scopes"
6. Search and add these scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/calendar.events`
7. Click "Update" → "Save and Continue"
8. Click "Add Users" → Add your email → "Save and Continue"
9. Click "Back to Dashboard"

---

## Step 5: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Desktop app"
4. Name: "MissionControl Desktop"
5. Click "Create"
6. Click "Download JSON"
7. Save the file

---

## Step 6: Move Credentials File

1. Rename the downloaded file to `credentials.json`
2. Move it to: `mission-control/backend/credentials.json`

**Full path should be:**
```
mission-control/
  backend/
    credentials.json  ← Put it here
```

---

## Step 7: Set Environment Variable

1. Open `mission-control/backend/.env` file
2. Add this line (replace with your email):
```
GMAIL_SENDER_EMAIL=your-email@gmail.com
```

**Example:**
```
GMAIL_SENDER_EMAIL=john.doe@gmail.com
```

---

## Step 8: Run Authentication Script

1. Open terminal
2. Navigate to backend:
```bash
cd mission-control/backend
```

3. Run the setup script:
```bash
python gmail_credentials_setup.py
```

4. A browser window will open
5. Sign in with your Google account
6. Click "Continue" when it says "Google hasn't verified this app"
7. Click "Continue" again
8. Check both boxes:
   - Send email on your behalf
   - See, edit, share, and permanently delete calendars
9. Click "Continue"
10. You should see "The authentication flow has completed"
11. Close the browser window

---

## Step 9: Verify Token Created

Check that `token.json` was created:
```bash
ls mission-control/backend/token.json
```

You should see the file listed.

---

## Step 10: Restart Backend

1. Stop the backend (Ctrl+C)
2. Start it again:
```bash
cd mission-control/backend
uvicorn main:app --reload --port 8000
```

---

## Step 11: Test

1. Go to frontend: http://localhost:5173
2. Click "Launch Workflow"
3. Wait for Planner to complete
4. Go to "Communications" tab
5. Check "Email Status Panel" - should show "success" instead of "error"
6. Check "Calendar Panel" - should show calendar events with links

---

## Troubleshooting

### Error: "credentials.json not found"
**Solution:** Make sure `credentials.json` is in `mission-control/backend/` folder

### Error: "GMAIL_SENDER_EMAIL env variable missing"
**Solution:** Add `GMAIL_SENDER_EMAIL=your-email@gmail.com` to `.env` file

### Error: "invalid_grant"
**Solution:** Delete `token.json` and run `python gmail_credentials_setup.py` again

### Error: "insufficient_permissions"
**Solution:** 
1. Go to Google Cloud Console → OAuth consent screen
2. Add the required scopes (gmail.send, calendar.events)
3. Delete `token.json`
4. Run `python gmail_credentials_setup.py` again

### Error: "quota_exceeded"
**Solution:** Wait 24 hours or request quota increase in Google Cloud Console

### Emails still failing
**Solution:**
1. Check backend console for error messages
2. Verify your email in `.env` file is correct
3. Make sure you completed OAuth flow (Step 8)
4. Try deleting `token.json` and re-authenticating

---

## Quick Checklist

- [ ] Google Cloud project created
- [ ] Gmail API enabled
- [ ] Google Calendar API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created and downloaded
- [ ] `credentials.json` in `mission-control/backend/`
- [ ] `GMAIL_SENDER_EMAIL` in `.env` file
- [ ] Ran `python gmail_credentials_setup.py`
- [ ] `token.json` created
- [ ] Backend restarted
- [ ] Tested workflow - emails show "success"

---

## File Structure

After setup, you should have:
```
mission-control/
  backend/
    .env                      ← Contains GMAIL_SENDER_EMAIL
    credentials.json          ← Downloaded from Google Cloud
    token.json               ← Generated by setup script
    gmail_credentials_setup.py
    services/
      gmail_service.py
      calendar_service.py
```

---

## Security Notes

- **Never commit `credentials.json` or `token.json` to git**
- These files are already in `.gitignore`
- Keep your Google Cloud project private
- Only add trusted users to OAuth consent screen

---

## Success!

If everything is set up correctly:
- ✅ Emails will send successfully
- ✅ Calendar events will be created
- ✅ Communications tab will show "success" status
- ✅ You'll receive actual emails in your Gmail
- ✅ Events will appear in your Google Calendar

---

**Last Updated:** March 29, 2025
