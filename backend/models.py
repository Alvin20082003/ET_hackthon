from pydantic import BaseModel, Field
from typing import Optional, List

class Task(BaseModel):
    id: str
    title: str
    description: str
    owner: str
    priority: Optional[int] = None
    deadline: Optional[str] = None
    status: str = "backlog"
    sla_hours: Optional[int] = None
    event_link: Optional[str] = None
    dependencies: List[str] = Field(default_factory=list)

class AuditEntry(BaseModel):
    id: str
    timestamp: str
    agent: str
    action: str
    input_summary: str
    output_summary: str
    reasoning: str
    status: str
