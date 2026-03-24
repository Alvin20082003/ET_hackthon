@echo off
echo Starting MissionControl...

echo Starting Backend (FastAPI)...
start cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

echo Starting Frontend (Vite)...
start cmd /k "cd frontend && npm run dev"

echo Done! MissionControl is booting up.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
