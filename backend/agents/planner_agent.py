import uuid
import random
from datetime import datetime
from models import Task, AuditEntry
from services.gmail_service import send_task_assignment_email
from services.calendar_service import create_task_event

OWNER_EMAILS = {
    "James": "xjennatherese@gmail.com",
    "Ravi":  "xjennatherese@gmail.com",
    "Priya": "xjennatherese@gmail.com",
    "Sarah": "xjennatherese@gmail.com",
    "Anita": "xjennatherese@gmail.com",
}

# Sensible SLA hours per priority
PRIORITY_SLA = {5: 24, 4: 48, 3: 72, 2: 120, 1: 168}

def planner_agent(state):
    tasks = state.get("tasks", [])
    current_log = state.get("audit_log", [])

    if not tasks:
        idle = AuditEntry(
            id=str(uuid.uuid4()), timestamp=datetime.utcnow().isoformat(),
            agent="Planner", action="Plan Tasks",
            input_summary="No tasks available", output_summary="Idle",
            reasoning="Skipping planning — no tasks from Scribe.",
            status="success"
        )
        return {"audit_log": current_log + [idle], "current_agent": "Planner"}

    new_entries = []

    # Try Ollama planner (optional enhancement)
    llm_plans = {}
    try:
        from utils.llm_factory import LLMFactory
        from langchain_core.output_parsers import JsonOutputParser
        from pydantic import BaseModel, Field
        from typing import List

        class TaskPlan(BaseModel):
            id: str
            iso_deadline: str
            priority: int
            sla_hours: int
            critical_path: bool

        class PlanExtraction(BaseModel):
            plans: List[TaskPlan]

        llm = LLMFactory.get_llm(provider="ollama", model="llama3")
        parser = JsonOutputParser(pydantic_object=PlanExtraction)
        tasks_info = "\n".join([f"ID:{t.id} Title:{t.title} Deadline:{t.deadline} Priority:{t.priority}" for t in tasks])
        prompt = f"Plan these tasks, return JSON. Current time: 2025-09-12T00:00:00Z\n{tasks_info}\n{parser.get_format_instructions()}"
        r = llm.invoke(prompt)
        result = parser.parse(r.content)
        llm_plans = {p["id"]: p for p in result["plans"]}
    except Exception:
        pass  # Fall through to rule-based planning

    for t in tasks:
        plan = llm_plans.get(t.id)
        if plan:
            t.deadline  = plan["iso_deadline"]
            t.priority  = plan["priority"]
            t.sla_hours = plan["sla_hours"]
            critical    = plan["critical_path"]
        else:
            # Rule-based planner — always works
            t.sla_hours = PRIORITY_SLA.get(t.priority, 72)
            critical    = t.priority >= 4

        if critical and not t.description.startswith("[CRITICAL PATH]"):
            t.description = f"[CRITICAL PATH] {t.description}"

        # Gmail notification
        email_addr = OWNER_EMAILS.get(t.owner, "unknown@company.com")
        try:
            success, msg = send_task_assignment_email(t, email_addr)
        except Exception as e:
            success, msg = False, str(e)
        new_entries.append(AuditEntry(
            id=str(uuid.uuid4()), timestamp=datetime.utcnow().isoformat(),
            agent="Planner", action="send_email",
            input_summary=f"Assigning {t.title} to {t.owner}",
            output_summary=f"Email sent to {t.owner} at {email_addr}" if success else f"Email skipped: {msg}",
            reasoning="Notifying task owner via Gmail" if success else "Gmail credentials not configured — skipped silently",
            status="success" if success else "error"
        ))

        # Calendar event
        try:
            event_link, cal_msg = create_task_event(t, email_addr)
            if event_link:
                t.event_link = event_link
        except Exception as e:
            event_link, cal_msg = None, str(e)
        new_entries.append(AuditEntry(
            id=str(uuid.uuid4()), timestamp=datetime.utcnow().isoformat(),
            agent="Planner", action="create_calendar_event",
            input_summary=f"Scheduling deadline for {t.title}",
            output_summary=f"Event created: {event_link}" if event_link else f"Calendar skipped: {cal_msg}",
            reasoning="Creating Google Calendar event" if event_link else "Google Calendar credentials not configured — skipped silently",
            status="success" if event_link else "error"
        ))

        # Plan task audit
        new_entries.append(AuditEntry(
            id=str(uuid.uuid4()), timestamp=datetime.utcnow().isoformat(),
            agent="Planner", action="Plan Task",
            input_summary=f"Task: {t.title}",
            output_summary=f"Owner: {t.owner} | SLA: {t.sla_hours}h | Priority: {t.priority} | Deadline: {t.deadline}",
            reasoning=f"{'LLM-optimised' if llm_plans else 'Rule-based'} scheduling — {'critical path' if critical else 'non-critical'}",
            status="success"
        ))

    return {"tasks": tasks, "audit_log": current_log + new_entries, "current_agent": "Planner"}
