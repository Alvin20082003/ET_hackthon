import asyncio
import random
import uuid
from datetime import datetime
from models import AuditEntry

async def executor_agent(state):
    tasks = state.get("tasks", [])
    current_log = state.get("audit_log", [])
    retry_count = state.get("retry_count", 0)
    
    new_audit_entries = []
    escalation_needed = False
    
    for t in tasks:
        if t.status in ["done", "escalated"]:
            continue
            
        t.status = "in_progress"
        await asyncio.sleep(random.uniform(0.3, 0.8))
        
        # 30% failure chance
        if random.random() < 0.3:
            if retry_count < 2:
                entry = AuditEntry(
                    id=str(uuid.uuid4()),
                    timestamp=datetime.utcnow().isoformat(),
                    agent="Executor",
                    action=f"Execute {t.title}",
                    input_summary="Execution attempt",
                    output_summary="Failed execution",
                    reasoning="Switching to fallback strategy",
                    status="error"
                )
                new_audit_entries.append(entry)
            else:
                t.status = "escalated"
                escalation_needed = True
                entry = AuditEntry(
                    id=str(uuid.uuid4()),
                    timestamp=datetime.utcnow().isoformat(),
                    agent="Executor",
                    action=f"Execute {t.title}",
                    input_summary="Execution attempt",
                    output_summary="Max retries reached",
                    reasoning="Task escalated due to repeated failures",
                    status="error"
                )
                new_audit_entries.append(entry)
        else:
            t.status = "done"
            entry = AuditEntry(
                id=str(uuid.uuid4()),
                timestamp=datetime.utcnow().isoformat(),
                agent="Executor",
                action=f"Execute {t.title}",
                input_summary="Execution attempt",
                output_summary="Task completed successfully",
                reasoning="All checks passed",
                status="success"
            )
            new_audit_entries.append(entry)
            
    pending_tasks = any(t.status == "in_progress" for t in tasks)
    new_retry_count = retry_count
    if pending_tasks and retry_count < 2:
        new_retry_count += 1
        
    return {
        "tasks": tasks,
        "audit_log": current_log + new_audit_entries,
        "current_agent": "Executor",
        "retry_count": new_retry_count,
        "escalation_needed": state.get("escalation_needed", False) or escalation_needed
    }
