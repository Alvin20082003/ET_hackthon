import os
import asyncio
from dotenv import load_dotenv
load_dotenv()

# Pre-set keys if they are not already in env
os.environ["GOOGLE_API_KEY"] = "AIzaSyBWZGFt36IeY2zg8mjWKa5CTojO0ili374"

from agents.graph import graph_app

async def test_run():
    initial_state = {
        "run_id": "test_run",
        "transcript": "Sarah: Need the vendor contract by Sept 20. James, evaluate the numbers. Ravi, send the invoice.",
        "tasks": [],
        "audit_log": [],
        "current_agent": "Idle",
        "retry_count": 0,
        "escalation_needed": False,
        "escalation_reason": "",
        "human_decision": None,
        "metrics": {"total": 0, "completed": 0, "failed": 0, "escalated": 0, "autonomy_rate": 0},
        "status": "running"
    }
    
    config = {"configurable": {"thread_id": "test_run"}}
    
    print("Starting graph execution...")
    try:
        async for event in graph_app.astream(initial_state, config, stream_mode="updates"):
            for node_name, state_update in event.items():
                print(f"\n--- Node: {node_name} ---")
                if "audit_log" in state_update:
                    last_entry = state_update["audit_log"][-1]
                    print(f"Status: {last_entry.status}")
                    print(f"Action: {last_entry.action}")
                    print(f"Reasoning: {last_entry.reasoning}")
                    if hasattr(last_entry, 'output_summary'):
                         print(f"Output: {last_entry.output_summary}")
    except Exception as e:
        print(f"Execution Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_run())
