# 🚀 MissionControl: Multi-Agent Enterprise Workflow OS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-61dafb.svg)](https://reactjs.org/)

**MissionControl** is an advanced multi-agent orchestration system that transforms raw meeting transcripts into fully automated, enterprise-grade task execution pipelines. Built for the modern enterprise, it leverages AI agents, real-time monitoring, and adaptive learning to achieve autonomous workflow management with human-in-the-loop oversight.

---

## 🌟 Key Features

### 🤖 Multi-Agent Pipeline
Five specialized AI agents work in a synchronized pipeline:
- **Scribe Agent**: Extracts structured tasks from raw transcripts.
- **Planner Agent**: Schedules tasks, manages Google Calendar events, and sends Gmail notifications.
- **Executor Agent**: Handles automated task execution with built-in validation and fallback strategies.
- **Auditor Agent**: Ensures SLA compliance and validates system-wide integrity.
- **Escalation Agent**: Manages failures by pausing workflows and requesting human intervention.

### 🧠 Adaptive Memory Engine
Inspired by self-improving systems, MissionControl learns from every run:
- **Pattern Recognition**: Identifies bottlenecks and cognitive overloads.
- **Pre-Optimisation**: Automatically applies lessons to future workflows to prevent repeated failures.
- **Persistent Learning**: Lessons are saved and improved upon with every single execution.

### 📊 Real-Time Operations
- **Cognitive Load Monitor**: Real-time tracking of team capacity with **Auto-Rebalancing** (moving tasks when a member hits 85% load).
- **Workflow Risk Scoring**: Pre-launch assessment of complexity, deadline clustering, and dependency risks.
- **Live WebSocket Streaming**: Real-time audit trails and agent status updates.
- **Workflow Obituary**: Formal documentation of failed or escalated tasks for post-mortem analysis.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, TailwindCSS, Lucide React, WebSocket |
| **Backend** | Python FastAPI, LangGraph, Google APIs (Gmail, Calendar) |
| **Design** | Light Nude Palette, Playfair Display (Serif), DM Sans |
| **Persistence** | Browser LocalStorage (Memory), Environment Configs |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Python 3.9+**
- **Node.js & npm**
- **Google Gemini API Key** (or OpenAI/Anthropic)
- **Google Cloud Credentials** (for Gmail/Calendar integration)

### 2. Configuration
Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_api_key_here
# Optional: Add Google Client ID/Secret for Calendar/Gmail
```

### 3. Running the Application
You can start both frontend and backend with a single command:
```bash
./start.bat
```

Alternatively, start them manually:

**Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📖 Documentation

For detailed information on specific components, refer to the following guides:
- [Detailed Technical Report](./docs/MissionControl_Detailed_Report.md)
- [Hackathon Pitch Guide](./docs/HACKATHON_PITCH_GUIDE.md)
- [Dynamic Features Guide](./docs/DYNAMIC_FEATURES_GUIDE.md)
- [Gmail & Calendar Setup](./docs/GMAIL_CALENDAR_SETUP.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

---

## 🎨 Design Philosophy
MissionControl uses a "Human-Engineered" aesthetic—transitioning from generic AI neon to a professional, high-precision technical terminal. The **Light Nude** theme provides a calm, institutional-grade environment for high-stakes enterprise coordination.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ for the ET Hackathon*
