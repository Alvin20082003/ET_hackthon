from langgraph.types import interrupt

def escalation_agent(state):
    escalation_needed = state.get("escalation_needed", False)
    if not escalation_needed:
        return {"current_agent": "Escalation", "status": "complete"}
        
    tasks = state.get("tasks", [])
    failed_tasks = [t for t in tasks if t.status == "escalated"]
    
    context = {
        "failed_tasks": [{"id": t.id, "title": t.title} for t in failed_tasks],
        "reason": "Max retries reached during execution",
        "sla_impact": "Potential SLA breach for dependent tasks"
    }
    
    decision = interrupt(context)
    
    return {
        "human_decision": decision,
        "status": "complete" if decision == "approve" else "terminated",
        "current_agent": "Escalation"
    }
