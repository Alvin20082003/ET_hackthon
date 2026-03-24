# MissionControl - multi-agent enterprise workflow OS

## How to Run

### Option 1: Automatic Startup (Recommended)
You can start both the frontend and backend simultaneously by running the `start.bat` file in the root directory:
1. Double-click `start.bat`
2. This will open two terminal windows: one for the backend (port 8000) and one for the frontend (port 5173).

### Option 2: Manual Startup

#### 1. Start the Backend
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
- Web Interface: [http://localhost:5173/](http://localhost:5173/)

## Prerequisites
- Python 3.9+
- Node.js & npm
- Google Gemini API Key (configured in `backend/.env`)
