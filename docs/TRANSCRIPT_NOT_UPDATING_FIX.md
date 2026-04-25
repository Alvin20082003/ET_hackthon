# Fix: New Transcript Not Being Used

## Problem
You paste a new transcript but the system still shows the old names (James, Ravi, Priya, Anita) in the Cognitive Load Monitor.

## Root Cause
Gemini API is failing to parse the transcript, so the system falls back to demo data.

---

## Solution Steps

### Step 1: Test Gemini API (2 minutes)

**Run the test script:**
```bash
cd mission-control/backend
python test_gemini.py
```

**Expected output if working:**
```
✓ API Key found: AIzaSyBWZGFt36IeY2zg...
✓✓✓ SUCCESS! Gemini extracted 3 tasks
Extracted owners: ['Alex', 'Jordan', 'Taylor']
✓ GEMINI IS WORKING CORRECTLY
```

**If you see errors:**
- ❌ "No GEMINI_API_KEY found" → Add key to `.env` file
- ❌ "API key is invalid" → Get a new key from Google AI Studio
- ❌ "Quota exceeded" → Wait or upgrade your API plan
- ❌ "Missing dependencies" → Run `pip install langchain-google-genai`

---

### Step 2: Restart Backend (CRITICAL!)

**You MUST restart the backend after any code changes:**

1. **Stop the backend** (Ctrl+C in the terminal running uvicorn)
2. **Start it again:**
   ```bash
   cd mission-control/backend
   uvicorn main:app --reload --port 8000
   ```

**Why?** Python code is loaded once when the server starts. Changes don't take effect until you restart.

---

### Step 3: Check Backend Console Logs

When you click "Launch Workflow", watch the backend terminal. You should see:

**If Gemini is working:**
```
================================================================================
[MAIN] New workflow started: abc-123-def
[MAIN] Transcript length: 245 characters
[MAIN] Transcript preview: Team Meeting — April 2026...
================================================================================

================================================================================
[SCRIBE] Starting transcript parsing...
[SCRIBE] Transcript length: 245 characters
[SCRIBE] First 200 chars: Team Meeting — April 2026...
================================================================================

[SCRIBE] ✓ Gemini API key found
[SCRIBE] Invoking Gemini 1.5 Flash to parse transcript...
[SCRIBE] Waiting for Gemini response...

[SCRIBE] ✓✓✓ SUCCESS! Gemini extracted 3 tasks
[SCRIBE] Extracted owners: ['Alex', 'Jordan', 'Taylor']
[SCRIBE] Task titles: ['Build API', 'Create Designs', 'Review Analytics']
```

**If falling back to demo data:**
```
[SCRIBE] ✗✗✗ Gemini parsing failed: TimeoutError: Request timed out
[SCRIBE] Falling back to demo data
[SCRIBE] Demo owners: James, Ravi, Priya, Anita
```

---

### Step 4: Verify Frontend is Sending Transcript

**Open browser console (F12) and check Network tab:**

1. Click "Launch Workflow"
2. Look for POST request to `/api/workflow/start`
3. Check the request payload - it should contain your custom transcript

**If payload shows old transcript:**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check if transcript textarea is actually updating when you type

---

### Step 5: Try a Simple Test Transcript

Use this minimal transcript to test:

```
Meeting April 2026
Alex: Jordan, do task A by May 1st.
Jordan: Sure. Taylor, I need task B first.
Taylor: Task B ready April 28th.
```

**This transcript:**
- Is short and simple (easier for Gemini to parse)
- Has clear names: Alex, Jordan, Taylor
- Has explicit task assignments
- Has deadlines

---

## Common Issues & Fixes

### Issue 1: "Transcript too short" error

**Symptom:** Backend logs show "Transcript too short"

**Fix:** Make sure your transcript is at least 50 characters long

---

### Issue 2: Gemini timeout

**Symptom:** Backend logs show "TimeoutError" or "Request timed out"

**Fixes:**
- Check internet connection
- Try a shorter transcript
- Increase timeout in `scribe_agent.py` (currently 15 seconds)
- Gemini API might be slow - try again

---

### Issue 3: Invalid API key

**Symptom:** Backend logs show "API key is invalid" or "401 Unauthorized"

**Fix:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Update `.env` file:
   ```
   GEMINI_API_KEY=your-new-key-here
   ```
4. Restart backend

---

### Issue 4: Quota exceeded

**Symptom:** Backend logs show "429 Too Many Requests" or "Quota exceeded"

**Fix:**
- Wait a few minutes (free tier has rate limits)
- Check quota at https://aistudio.google.com/
- Upgrade to paid tier if needed
- System will use demo data until quota resets

---

### Issue 5: Names still not updating

**Symptom:** Gemini succeeds but Cognitive Load Monitor still shows old names

**Possible causes:**
1. **Browser cache** - Hard refresh (Ctrl+Shift+R)
2. **Old WebSocket connection** - Close and reopen browser tab
3. **Frontend not reloading** - Check if `npm run dev` is running
4. **State not clearing** - Refresh page between workflow runs

**Fix:**
1. Stop frontend (Ctrl+C)
2. Stop backend (Ctrl+C)
3. Clear browser cache
4. Start backend: `uvicorn main:app --reload --port 8000`
5. Start frontend: `npm run dev`
6. Open fresh browser tab
7. Try again

---

## Verification Checklist

After following the steps above, verify:

- [ ] `test_gemini.py` shows SUCCESS
- [ ] Backend is running and shows startup logs
- [ ] Frontend is running (npm run dev)
- [ ] Browser console shows no errors
- [ ] Backend console shows "[SCRIBE] ✓✓✓ SUCCESS!" when you launch workflow
- [ ] Cognitive Load Monitor shows new names
- [ ] "Custom Transcript" badge appears

---

## Still Not Working?

If you've tried everything above and it's still not working:

1. **Check the exact error message** in backend console
2. **Copy the full error** and check what it says
3. **Verify all dependencies** are installed:
   ```bash
   pip install langchain-google-genai google-generativeai
   ```
4. **Try the demo data** - it should work even without Gemini
5. **Check if the issue is Gemini-specific** or affects demo data too

---

## Quick Debug Commands

```bash
# Test Gemini API
cd mission-control/backend
python test_gemini.py

# Check if backend is running
curl http://localhost:8000/api/workflow/test

# Check environment variables
cd mission-control/backend
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print(os.getenv('GEMINI_API_KEY'))"

# Restart everything fresh
# Terminal 1:
cd mission-control/backend
uvicorn main:app --reload --port 8000

# Terminal 2:
cd mission-control/frontend
npm run dev
```

---

## Expected Behavior

When everything is working correctly:

1. You paste a new transcript with names like "Alex", "Jordan", "Taylor"
2. You click "Launch Workflow"
3. Backend console shows Gemini extracting those exact names
4. Cognitive Load Monitor displays Alex, Jordan, Taylor (not James, Ravi, Priya, Anita)
5. "Custom Transcript" badge appears
6. Each person has a percentage based on their assigned tasks

---

## Need More Help?

Check these files for more information:
- `QUICK_START_TESTING.md` - Testing guide
- `DYNAMIC_FEATURES_GUIDE.md` - How features work
- `CUSTOM_TRANSCRIPT_EXAMPLES.md` - Example transcripts to try
