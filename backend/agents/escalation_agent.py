def escalation_agent(state):
    escalation_needed = state.get("escalation_needed", False)
    current_log = state.get("audit_log", [])
    
    if not escalation_needed:
        return {"current_agent": "Escalation", "status": "complete"}
        
    tasks = state.get("tasks", [])
    failed_tasks = [t for t in tasks if t.status == "escalated"]
    
    if failed_tasks:
        from models import AuditEntry
        from datetime import datetime
        import uuid
        
        # Log escalation for each failed task
        new_entries = []
        for t in failed_tasks:
            entry = AuditEntry(
                id=str(uuid.uuid4()),
                timestamp=datetime.utcnow().isoformat(),
                agent="Escalation",
                action=f"Escalate {t.title}",
                input_summary=f"Task failed after 3 attempts",
                output_summary=f"Task escalated to human review - requires manual intervention",
                reasoning=f"Max retries reached for {t.title} - potential SLA impact on dependent tasks",
                status="error"
            )
            new_entries.append(entry)
        
        print(f"[ESCALATION] {len(failed_tasks)} task(s) escalated for human review")
        
        return {
            "audit_log": current_log + new_entries,
            "human_decision": "approve",  # Auto-approve for demo
            "status": "complete",
            "current_agent": "Escalation"
        }
    
    return {"current_agent": "Escalation", "status": "complete"}
