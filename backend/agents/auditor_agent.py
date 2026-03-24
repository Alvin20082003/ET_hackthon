import uuid
from datetime import datetime
from models import AuditEntry

def auditor_agent(state):
    tasks = state.get("tasks", [])
    current_log = state.get("audit_log", [])
    
    total = len(tasks)
    completed = sum(1 for t in tasks if t.status == "done")
    escalated = sum(1 for t in tasks if t.status == "escalated")
    failed = escalated
    
    escalation_needed = state.get("escalation_needed", False)
    autonomy_rate = 70 if escalation_needed else (completed / total * 100 if total > 0 else 100)
    
    metrics = {
        "total": total,
        "completed": completed,
        "failed": failed,
        "escalated": escalated,
        "autonomy_rate": autonomy_rate
    }
    
    sla_breaches = sum(1 for t in tasks if t.sla_hours is not None and t.sla_hours < 0)
    summary = f"Audit complete. SLA breaches: {sla_breaches}"
    
    entry = AuditEntry(
        id=str(uuid.uuid4()),
        timestamp=datetime.utcnow().isoformat(),
        agent="Auditor",
        action="System Audit",
        input_summary=f"Checking {total} tasks",
        output_summary=f"Autonomy Rate: {autonomy_rate:.1f}% ({total} tasks)",
        reasoning=summary if total > 0 else "Audit complete. No tasks to analyze.",
        status="success"
    )
    
    return {
        "metrics": metrics,
        "audit_log": current_log + [entry],
        "current_agent": "Auditor"
    }
