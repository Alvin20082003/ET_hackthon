# MissionControl - Troubleshooting Guide

## Common Issues and Solutions

### 1. Slow Agent Execution (Scribe, Planner, Executor taking long time)

**Cause:** LLM API calls to OpenAI/Anthropic can take 2-10 seconds per agent depending on:
- API response time
- Model being used (GPT-4 is slower than GPT-3.5)
- Network latency
- API rate limits

**Solutions:**
- **Switch to faster model:** In `backend/utils/llm_factory.py`, change to `gpt-3.5-turbo` instead of `gpt-4`
- **Increase timeout:** In `backend/main.py`, increase WebSocket timeout
- **Check API key:** Ensure your OpenAI/Anthropic API key has sufficient credits
- **Network:** Check your internet connection speed

**Expected Times:**
- Scribe: 2-5 seconds (parsing transcript)
- Planner: 3-8 seconds (scheduling + Gmail + Calendar APIs)
- Executor: 2-4 seconds per task
- Auditor: 1-2 seconds

**Note:** This is normal behavior for LLM-based systems. The frontend shows loading spinners during execution.

---

### 2. Email Failures in Communications Tab

**Cause:** Gmail API authentication or configuration issues

**Solutions:**

**Step 1: Check Gmail API Setup**
```bash
cd mission-control/backend
python gmail_credentials_setup.py
```

**Step 2: Verify credentials.json exists**
- File should be in `mission-control/backend/credentials.json`
- Download from Google Cloud Console if missing

**Step 3: Check token.json**
- File should be in `mission-control/backend/token.json`
- Delete and re-authenticate if corrupted:
```bash
rm token.json
python gmail_credentials_setup.py
```

**Step 4: Verify Gmail API is enabled**
- Go to Google Cloud Console
- Enable Gmail API for your project
- Enable Google Calendar API

**Step 5: Check OAuth consent screen**
- Must be configured in Google Cloud Console
- Add your email as test user
- Scopes: gmail.send, calendar.events

**Step 6: Check backend logs**
```bash
# Look for Gmail API errors
cd mission-control/backend
uvicorn main:app --reload --port 8000
# Watch console for error messages
```

**Common Errors:**
- `invalid_grant`: Token expired, delete token.json and re-auth
- `insufficient_permissions`: Add required scopes in Google Cloud Console
- `quota_exceeded`: Wait or request quota increase

---

### 3. Duplicate Memory Content

**Fixed in latest version.** If you still see duplicates:

**Solution 1: Clear localStorage**
```javascript
// In browser console (F12)
localStorage.removeItem('missioncontrol_memory');
// Refresh page
```

**Solution 2: Use "Clear Memory" button**
- Go to Memory tab
- Click "Clear Memory & Start Fresh"
- Run a new workflow

**Prevention:**
- Latest code prevents duplicates by tracking run IDs
- Only saves once per workflow completion

---

### 4. Truncated Text in Task Cards

**Fixed in latest version.** Task cards now show full text on hover.

**How to use:**
- Hover mouse over task title → See full title in tooltip
- Hover over description → See full description in tooltip

---

### 5. Audit Log Export Format

**Fixed in latest version.** Export now creates formatted text report instead of JSON.

**New format:**
- Structured text file (.txt)
- Human-readable
- Includes: timestamp, agent, action, status, reasoning, errors
- Filename: `audit_trail_YYYY-MM-DD.txt`

**To export:**
- Click download icon in Audit Trail panel
- File downloads automatically

---

## Performance Optimization

### Backend Performance

**1. Use faster LLM model:**
```python
# In backend/utils/llm_factory.py
model = "gpt-3.5-turbo"  # Instead of gpt-4
```

**2. Enable caching:**
```python
# Add to backend/main.py
from functools import lru_cache

@lru_cache(maxsize=100)
def cached_llm_call(prompt):
    # Your LLM call here
    pass
```

**3. Parallel execution:**
```python
# In backend/agents/executor_agent.py
import asyncio

async def execute_tasks_parallel(tasks):
    return await asyncio.gather(*[execute_task(t) for t in tasks])
```

### Frontend Performance

**1. Reduce polling frequency:**
```javascript
// In AdaptiveMemory.jsx
const interval = setInterval(refreshMemory, 5000); // 5 seconds instead of 1
```

**2. Lazy load components:**
```javascript
const AnalyticsDashboard = React.lazy(() => import('./components/AnalyticsDashboard'));
```

---

## Production Deployment Checklist

### Backend
- [ ] Set environment variables in production
- [ ] Use production-grade WSGI server (gunicorn)
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure CORS for production domain
- [ ] Use production LLM API keys
- [ ] Set up monitoring (Sentry, DataDog)

### Frontend
- [ ] Build for production: `npm run build`
- [ ] Serve with nginx or CDN
- [ ] Enable gzip compression
- [ ] Set up error tracking
- [ ] Configure analytics
- [ ] Test on multiple browsers
- [ ] Mobile responsiveness check

### Security
- [ ] Never commit API keys
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use HTTPS only
- [ ] Implement CSRF protection

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Log all errors
- [ ] Track API usage
- [ ] Monitor LLM costs
- [ ] Set up alerts for failures

---

## Getting Help

**Check logs:**
```bash
# Backend logs
cd mission-control/backend
uvicorn main:app --reload --port 8000
# Watch console output

# Frontend logs
# Open browser console (F12)
# Check Console tab for errors
```

**Common log locations:**
- Backend: Terminal where uvicorn is running
- Frontend: Browser console (F12 → Console tab)
- Gmail API: Check Google Cloud Console logs

**Debug mode:**
```bash
# Backend with debug
cd mission-control/backend
uvicorn main:app --reload --port 8000 --log-level debug

# Frontend with source maps
cd mission-control/frontend
npm run dev
```

---

## Contact & Support

**GitHub Issues:** https://github.com/jennatherese/MissionControl/issues

**Documentation:** See `MissionControl_Detailed_Report.md`

**Email:** [your-email@example.com]

---

**Last Updated:** March 29, 2025
