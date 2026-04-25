# 🚨 QUICK FIX: New Transcript Not Working

## The Problem
Pasted new transcript but still seeing old names (James, Ravi, Priya, Anita)

## The Solution (3 steps, 2 minutes)

### 1️⃣ Test Gemini (30 seconds)
```bash
cd mission-control/backend
python test_gemini.py
```
**Look for:** `✓✓✓ SUCCESS!` message

**If it fails:** Check `.env` file has `GEMINI_API_KEY=your-key-here`

---

### 2️⃣ Restart Backend (30 seconds)
```bash
# Stop current backend (Ctrl+C)
# Then restart:
cd mission-control/backend
uvicorn main:app --reload --port 8000
```
**Critical:** Backend MUST be restarted after code changes!

---

### 3️⃣ Test with Simple Transcript (1 minute)

**Paste this into the transcript box:**
```
Meeting April 2026
Alex: Jordan, do task A by May 1st.
Jordan: Sure. Taylor, I need task B first.
Taylor: Task B ready April 28th.
```

**Click "Launch Workflow"**

**Watch backend console - should see:**
```
[SCRIBE] ✓✓✓ SUCCESS! Gemini extracted 3 tasks
[SCRIBE] Extracted owners: ['Alex', 'Jordan', 'Taylor']
```

**Watch Cognitive Load Monitor - should show:**
- Alex (with percentage)
- Jordan (with percentage)
- Taylor (with percentage)
- "Custom Transcript" badge

---

## Still Not Working?

### Check Backend Console
When you click "Launch Workflow", backend should print:
- `[MAIN] New workflow started`
- `[SCRIBE] Starting transcript parsing...`
- `[SCRIBE] ✓✓✓ SUCCESS!` (if Gemini works)
- OR `[SCRIBE] ✗✗✗ Gemini parsing failed` (if falling back to demo)

### If Seeing "Gemini parsing failed"
**Common causes:**
1. No internet connection
2. Invalid API key
3. API quota exceeded
4. Transcript too short (< 50 characters)

**Quick fixes:**
- Check internet
- Get new API key from https://aistudio.google.com/app/apikey
- Wait a few minutes (rate limit)
- Use longer transcript

### If Backend Shows Nothing
**You forgot to restart the backend!**
- Stop it (Ctrl+C)
- Start again: `uvicorn main:app --reload --port 8000`

---

## Success Checklist
- [ ] `test_gemini.py` shows SUCCESS
- [ ] Backend restarted and running
- [ ] Backend console shows `[SCRIBE] ✓✓✓ SUCCESS!`
- [ ] Cognitive Load Monitor shows new names (Alex, Jordan, Taylor)
- [ ] "Custom Transcript" badge visible

---

## More Help
- Full guide: `TRANSCRIPT_NOT_UPDATING_FIX.md`
- Test examples: `CUSTOM_TRANSCRIPT_EXAMPLES.md`
- Technical details: `DYNAMIC_FEATURES_GUIDE.md`
