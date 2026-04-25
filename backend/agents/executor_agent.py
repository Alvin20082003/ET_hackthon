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
    
    # Track which tasks have been attempted
    task_attempts = state.get("task_attempts", {})
    
    # Process ONE task at a time
    for t in tasks:
        # Skip already completed or escalated tasks
        if t.status in ["done", "escalated"]:
            continue
        
        # Move backlog tasks to in_progress ONE AT A TIME
        if t.status == "backlog":
            t.status = "in_progress"
            task_attempts[t.id] = 0
            print(f"[EXECUTOR] Moving task '{t.title}' to IN PROGRESS")
            return {
                "tasks": tasks,
                "audit_log": current_log,
                "current_agent": "Executor",
                "retry_count": retry_count,
                "task_attempts": task_attempts,
                "escalation_needed": state.get("escalation_needed", False)
            }
        
        # Process in_progress tasks
        if t.status == "in_progress":
            print(f"[EXECUTOR] Processing task '{t.title}' (attempt {task_attempts.get(t.id, 0) + 1})...")
            
            # Wait so user can see task in "In Progress" column
            await asyncio.sleep(2.0)
            
            # Increment attempt counter
            task_attempts[t.id] = task_attempts.get(t.id, 0) + 1
            
            # Determine if task should fail
            # First 2 tasks: 60% fail rate to guarantee some escalations
            # Other tasks: 30% fail rate
            task_index = tasks.index(t)
            fail_rate = 0.6 if task_index < 2 else 0.3
            should_fail = random.random() < fail_rate
            
            if should_fail and task_attempts[t.id] < 3:
                # Task failed but can retry
                print(f"[EXECUTOR] Task '{t.title}' FAILED (attempt {task_attempts[t.id]}/3)")
                entry = AuditEntry(
                    id=str(uuid.uuid4()),
                    timestamp=datetime.utcnow().isoformat(),
                    agent="Executor",
                    action=f"Execute {t.title}",
                    input_summary=f"Execution attempt {task_attempts[t.id]}",
                    output_summary="Failed execution",
                    reasoning="Switching to fallback strategy, will retry",
                    status="error"
                )
                new_audit_entries.append(entry)
                # Keep in in_progress for retry
                
            elif should_fail and task_attempts[t.id] >= 3:
                # Task failed and max retries reached - ESCALATE
                print(f"[EXECUTOR] Task '{t.title}' ESCALATED (max retries reached)")
                t.status = "escalated"
                escalation_needed = True
                entry = AuditEntry(
                    id=str(uuid.uuid4()),
                    timestamp=datetime.utcnow().isoformat(),
                    agent="Executor",
                    action=f"Execute {t.title}",
                    input_summary=f"Execution attempt {task_attempts[t.id]}",
                    output_summary="Max retries reached - escalating to human",
                    reasoning="Task escalated due to repeated failures after 3 attempts",
                    status="error"
                )
                new_audit_entries.append(entry)
                
            else:
                # Task succeeded
                print(f"[EXECUTOR] Task '{t.title}' COMPLETED")
                t.status = "done"
                entry = AuditEntry(
                    id=str(uuid.uuid4()),
                    timestamp=datetime.utcnow().isoformat(),
                    agent="Executor",
                    action=f"Execute {t.title}",
                    input_summary=f"Execution attempt {task_attempts[t.id]}",
                    output_summary="Task completed successfully",
                    reasoning="All checks passed",
                    status="success"
                )
                new_audit_entries.append(entry)
            
            # Return after processing ONE task so UI can update
            break
            
    return {
        "tasks": tasks,
        "audit_log": current_log + new_audit_entries,
        "current_agent": "Executor",
        "retry_count": retry_count,
        "task_attempts": task_attempts,
        "escalation_needed": state.get("escalation_needed", False) or escalation_needed
    }
