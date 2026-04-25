import uuid
import asyncio
import os
from typing import Dict, Any, Optional
from fastapi import FastAPI, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.graph import graph_app
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StartRequest(BaseModel):
    transcript: str

class RespondRequest(BaseModel):
    action: str

runs_state: Dict[str, dict] = {}
run_queues: Dict[str, asyncio.Queue] = {}

def get_clean_state(event_state):
    clean_state = {}
    for k, v in event_state.items():
        if k == "tasks" and v:
            clean_state[k] = [t.dict() for t in v if hasattr(t, "dict")]
        elif k == "audit_log" and v:
            clean_state[k] = [a.dict() for a in v if hasattr(a, "dict")]
        else:
            clean_state[k] = v
    return clean_state

async def run_graph(run_id: str, transcript: str):
    queue = run_queues.get(run_id)
    config = {"configurable": {"thread_id": run_id}}
    
    initial_state = {
        "run_id": run_id,
        "transcript": transcript,
        "tasks": [],
        "audit_log": [],
        "current_agent": "Idle",
        "retry_count": 0,
        "task_attempts": {},
        "escalation_needed": False,
        "escalation_reason": "",
        "human_decision": None,
        "metrics": {"total": 0, "completed": 0, "failed": 0, "escalated": 0, "autonomy_rate": 0},
        "status": "running"
    }
    
    await queue.put({"type": "agent_start", "agent": "scribe", "state": {}})
    
    async for event in graph_app.astream(initial_state, config, stream_mode="updates"):
        for node_name, state_update in event.items():
            if queue:
                clean = get_clean_state(state_update)
                await queue.put({"type": "agent_done", "agent": node_name, "state": clean})
                # Attempt to guess next running agent for UI animation
                next_agent_map = {
                    "scribe": "planner",
                    "planner": "executor",
                    "executor": "auditor" if clean.get("retry_count", 0) >= 2 or all(t.get("status") != "in_progress" for t in clean.get("tasks", [])) else "executor",
                    "auditor": "escalation_check"
                }
                if node_name in next_agent_map:
                    await queue.put({"type": "agent_start", "agent": next_agent_map[node_name], "state": {}})
                
    state = graph_app.get_state(config)
    if state.next:
        if queue:
            await queue.put({"type": "escalation", "agent": "escalation_check"})
    else:
        if queue:
            clean = get_clean_state(state.values)
            await queue.put({"type": "complete", "state": clean})
            
@app.post("/api/workflow/start")
async def start_workflow(req: StartRequest, bg_tasks: BackgroundTasks):
    run_id = str(uuid.uuid4())
    run_queues[run_id] = asyncio.Queue()
    print(f"\n{'='*80}")
    print(f"[MAIN] New workflow started: {run_id}")
    print(f"[MAIN] Transcript length: {len(req.transcript)} characters")
    print(f"[MAIN] Transcript preview: {req.transcript[:200]}...")
    print(f"{'='*80}\n")
    bg_tasks.add_task(run_graph, run_id, req.transcript)
    return {"run_id": run_id}

@app.get("/api/workflow/{run_id}")
async def get_workflow(run_id: str):
    config = {"configurable": {"thread_id": run_id}}
    state = graph_app.get_state(config)
    if state:
        return get_clean_state(state.values)
    return {}

@app.get("/api/audit/{run_id}")
async def get_audit(run_id: str):
    config = {"configurable": {"thread_id": run_id}}
    state = graph_app.get_state(config)
    if state and "audit_log" in state.values:
         return [a.dict() for a in state.values["audit_log"]]
    return []

@app.post("/api/escalation/{run_id}/respond")
async def respond_escalation(run_id: str, req: RespondRequest, bg_tasks: BackgroundTasks):
    config = {"configurable": {"thread_id": run_id}}
    queue = run_queues.get(run_id)
    
    async def resume_graph():
        async for event in graph_app.astream({"human_decision": req.action}, config, stream_mode="updates"):
            for node_name, state_update in event.items():
                if queue:
                    clean = get_clean_state(state_update)
                    await queue.put({"type": "agent_done", "agent": node_name, "state": clean})
                    
        state = graph_app.get_state(config)
        if queue:
            clean = get_clean_state(state.values)
            await queue.put({"type": "complete", "state": clean})
            
    bg_tasks.add_task(resume_graph)
    return {"status": "resumed"}

@app.websocket("/ws/{run_id}")
async def websocket_endpoint(websocket: WebSocket, run_id: str):
    await websocket.accept()
    if run_id not in run_queues:
        run_queues[run_id] = asyncio.Queue()
        
    queue = run_queues[run_id]
    try:
        while True:
            event = await queue.get()
            await websocket.send_json(event)
    except WebSocketDisconnect:
        pass
