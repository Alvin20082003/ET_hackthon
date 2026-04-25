# Quick Start Testing Guide

## 🚀 Test Dynamic Features in 3 Minutes

### Step 1: Start the Servers (30 seconds)

**Terminal 1 - Backend:**
```bash
cd mission-control/backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd mission-control/frontend
npm run dev
```

Wait for both to start, then open http://localhost:5173

---

### Step 2: Test Custom Names (1 minute)

**Copy this transcript:**
```
Marketing Sprint — April 2026
Alex: Jordan, can you design the campaign by May 10th?
Jordan: Yes! Taylor, I need the copy first.
Taylor: Copy ready May 5th. Morgan, please review analytics.
Morgan: Analytics report ready May 3rd.
```

**Actions:**
1. Paste into the transcript box (replace existing text)
2. Click "Launch Workflow"
3. Watch the backend terminal - look for:
   ```
   [SCRIBE] ✓✓✓ SUCCESS! Gemini extracted 4 tasks
   [SCRIBE] Extracted owners: ['Alex', 'Jordan', 'Taylor', 'Morgan']
   ```

**Expected Result:**
- Cognitive Load Monitor shows: Alex, Jordan, Taylor, Morgan
- "Custom Transcript" badge appears
- Each person has a percentage bar

---

### Step 3: Watch Task Flow (1 minute)

**Watch the Task Board during execution:**

```
BACKLOG          IN PROGRESS       DONE           ESCALATED
[Task 1]    →    [Task 1]     →   [Task 1]
[Task 2]         [Task 2]     →                  [Task 2]
[Task 3]         [Task 3]     →   [Task 3]
[Task 4]         [Task 4]     →   [Task 4]
```

**What to observe:**
- Tasks move from Backlog to In Progress ONE AT A TIME
- Each task stays in "In Progress" for 2-3 seconds
- Most tasks complete and move to "Done"
- Some tasks fail and move to "Escalated"

**Backend console shows:**
```
[EXECUTOR] Moving task 'Design Campaign' to IN PROGRESS
[EXECUTOR] Processing task 'Design Campaign'...
[EXECUTOR] Task 'Design Campaign' COMPLETED
```

---

### Step 4: Verify Real-Time Updates (30 seconds)

**Open browser console (F12) and watch for:**
```javascript
WebSocket message: {type: "agent_start", agent: "scribe"}
WebSocket message: {type: "agent_done", agent: "scribe", state: {...}}
WebSocket message: {type: "agent_start", agent: "planner"}
// ... etc
```

**This confirms:**
- WebSocket connection is active
- State updates are streaming in real-time
- Frontend receives every status change

---

## ✅ Success Checklist

After testing, you should have seen:

- [ ] Backend console shows `[SCRIBE] ✓✓✓ SUCCESS!`
- [ ] Cognitive Load Monitor displays custom names (Alex, Jordan, Taylor, Morgan)
- [ ] "Custom Transcript" badge appears
- [ ] Tasks visible in "In Progress" column (even briefly)
- [ ] Some tasks in "Escalated" column
- [ ] Audit Trail shows all agent actions
- [ ] WebSocket messages in browser console

---

## 🎯 Demo Script for Presentation

**1. Introduction (30 seconds)**
"MissionControl is a multi-agent workflow system that dynamically adapts to any team structure."

**2. Show Dynamic Name Detection (1 minute)**
- "Watch as I enter a custom transcript with different team members"
- Paste custom transcript
- "Notice the Cognitive Load Monitor automatically detects Alex, Jordan, Taylor, and Morgan"
- Point to "Custom Transcript" badge

**3. Show Real-Time Execution (1 minute)**
- Click "Launch Workflow"
- "The Scribe agent uses Gemini AI to parse the transcript"
- Point to backend console showing Gemini success
- "Watch tasks move through the pipeline in real-time"
- Point to tasks moving between columns

**4. Show Intelligent Features (1 minute)**
- "The system calculates cognitive load based on actual task assignments"
- Point to percentage bars
- "Tasks that fail are automatically escalated for human review"
- Point to Escalated column
- "Everything is logged in the Audit Trail"
- Show audit log

**5. Conclusion (30 seconds)**
"This system is production-ready with graceful fallbacks, real-time updates, and dynamic adaptation to any team structure."

---

## 🔧 Troubleshooting Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Demo names only | Check backend console for Gemini error, verify API key |
| No tasks in "In Progress" | Watch carefully, they move quickly (2-3 sec each) |
| 0% in Load Monitor | Launch workflow first, verify tasks have owners |
| WebSocket errors | Restart backend, refresh browser |
| Gemini timeout | Use shorter transcript, check API quota |

---

## 📚 More Information

- **Custom Transcript Examples:** See `CUSTOM_TRANSCRIPT_EXAMPLES.md`
- **Technical Details:** See `DYNAMIC_FEATURES_GUIDE.md`
- **Latest Changes:** See `LATEST_UPDATES.md`
- **Gmail/Calendar Setup:** See `GMAIL_CALENDAR_SETUP.md`

---

## 🎉 You're Ready!

The system is fully functional and ready for:
- ✅ Live demos
- ✅ Presentations
- ✅ Production deployment
- ✅ Further development

All dynamic features are working as designed. Enjoy!
