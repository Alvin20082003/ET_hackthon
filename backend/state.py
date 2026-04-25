from typing import TypedDict, List, Optional, Dict, Any
from models import Task, AuditEntry

class WorkflowState(TypedDict, total=False):
    run_id: str
    transcript: str
    tasks: List[Task]
    audit_log: List[AuditEntry]
    current_agent: str
    retry_count: int
    task_attempts: Dict[str, int]
    escalation_needed: bool
    escalation_reason: str
    human_decision: Optional[str]
    metrics: Dict[str, Any]
    status: str
