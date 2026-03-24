from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from state import WorkflowState
from agents.scribe_agent import scribe_agent
from agents.planner_agent import planner_agent
from agents.executor_agent import executor_agent
from agents.auditor_agent import auditor_agent
from agents.escalation_agent import escalation_agent

def create_workflow_graph():
    workflow = StateGraph(WorkflowState)
    
    workflow.add_node("scribe", scribe_agent)
    workflow.add_node("planner", planner_agent)
    workflow.add_node("executor", executor_agent)
    workflow.add_node("auditor", auditor_agent)
    workflow.add_node("escalation_check", escalation_agent)
    
    workflow.add_edge(START, "scribe")
    workflow.add_edge("scribe", "planner")
    workflow.add_edge("planner", "executor")
    
    def retry_logic(state: WorkflowState):
        tasks = state.get("tasks", [])
        retry_count = state.get("retry_count", 0)
        pending_tasks = any(t.status == "in_progress" for t in tasks)
        if pending_tasks and retry_count < 2:
            return "executor"
        return "auditor"
        
    workflow.add_conditional_edges("executor", retry_logic, {"executor": "executor", "auditor": "auditor"})
    workflow.add_edge("auditor", "escalation_check")
    
    def escalation_logic(state: WorkflowState):
        decision = state.get("human_decision")
        if decision == "reject":
             return "terminated"
        return "complete"
        
    workflow.add_conditional_edges(
        "escalation_check", 
        escalation_logic, 
        {"terminated": END, "complete": END}
    )
    
    memory = MemorySaver()
    app = workflow.compile(checkpointer=memory)
    return app

graph_app = create_workflow_graph()
