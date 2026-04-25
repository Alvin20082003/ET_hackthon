import React, { useReducer, useEffect, useState } from 'react';
import MetricsBar from './components/MetricsBar';
import AgentPipeline from './components/AgentPipeline';
import TranscriptInput from './components/TranscriptInput';
import TaskBoard from './components/TaskBoard';
import AuditTrail from './components/AuditTrail';
import EscalationModal from './components/EscalationModal';
import EmailStatusPanel from './components/EmailStatusPanel';
import CalendarPanel from './components/CalendarPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CognitiveLoadMonitor from './components/CognitiveLoadMonitor';
import WorkflowObituary from './components/WorkflowObituary';
import { LiveLearningIndicator, MemoryTab } from './components/AdaptiveMemory';
import { LayoutDashboard, BarChart2, Mail, Brain } from 'lucide-react';

const initialState = {
  tasks: [
    {
      id: 'demo-escalated-1',
      title: 'Legacy System Integration',
      description: '[CRITICAL PATH] Integrate legacy CRM with new API gateway - multiple authentication failures detected',
      owner: 'DevOps Team',
      priority: 5,
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      status: 'escalated',
      sla_hours: 24,
      event_link: null,
      dependencies: []
    }
  ],
  auditLog: [
    {
      id: 'demo-audit-1',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      agent: 'Executor',
      action: 'Execute Task',
      input_summary: 'Attempt 1: Legacy System Integration',
      output_summary: 'Failed: Authentication timeout after 30s',
      reasoning: 'Legacy API endpoint not responding to OAuth2 handshake',
      status: 'error'
    },
    {
      id: 'demo-audit-2',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      agent: 'Executor',
      action: 'Execute Task',
      input_summary: 'Attempt 2: Legacy System Integration',
      output_summary: 'Failed: Certificate validation error',
      reasoning: 'SSL certificate expired on legacy CRM server',
      status: 'error'
    },
    {
      id: 'demo-audit-3',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      agent: 'Executor',
      action: 'Execute Task',
      input_summary: 'Attempt 3: Legacy System Integration',
      output_summary: 'Failed: Connection refused',
      reasoning: 'Legacy system firewall blocking new API gateway IP range',
      status: 'error'
    },
    {
      id: 'demo-audit-4',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      agent: 'Escalation',
      action: 'Escalate Legacy System Integration',
      input_summary: 'Task failed after 3 attempts',
      output_summary: 'Task escalated to human review - requires manual intervention',
      reasoning: 'Max retries reached for Legacy System Integration - potential SLA impact on dependent tasks',
      status: 'error'
    }
  ],
  metrics: { total: 1, completed: 0, failed: 0, escalated: 1, autonomy_rate: 0 },
  agentStatuses: {
    scribe: 'idle',
    planner: 'idle',
    executor: 'idle',
    auditor: 'idle',
    escalation_check: 'idle'
  },
  escalation: null,
  runId: null,
  status: 'idle'
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_RUN_ID':
      return { ...state, runId: action.payload, status: 'running' };
    case 'AGENT_START':
      return {
        ...state,
        agentStatuses: { ...state.agentStatuses, [action.agent]: 'active' }
      };
    case 'AGENT_DONE':
      const newState = {
        ...state,
        agentStatuses: { ...state.agentStatuses, [action.agent]: 'done' }
      };
      if (action.state.tasks) newState.tasks = action.state.tasks;
      if (action.state.audit_log) newState.auditLog = action.state.audit_log;
      if (action.state.metrics) newState.metrics = action.state.metrics;
      return newState;
    case 'ESCALATION':
      return { ...state, escalation: action.payload, agentStatuses: { ...state.agentStatuses, [action.agent]: 'error' } };
    case 'COMPLETE':
      return {
        ...state,
        status: 'complete',
        tasks: action.state.tasks || state.tasks,
        auditLog: action.state.audit_log || state.auditLog,
        metrics: action.state.metrics || state.metrics
      };
    case 'CLOSE_ESCALATION':
      return { ...state, escalation: null };
    case 'ADD_AUDIT_LOG':
      return { ...state, auditLog: [...state.auditLog, action.payload] };
    case 'REASSIGN_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.title === action.taskTitle
            ? { ...task, owner: action.newOwner }
            : task
        )
      };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [ws, setWs] = useState(null);
  const [activeTab, setActiveTab] = useState('live');
  const [isLearning, setIsLearning] = useState(false);
  const [lessonCount, setLessonCount] = useState(0);

  useEffect(() => {
    if (state.runId) {
      const socket = new WebSocket(`ws://localhost:8000/ws/${state.runId}`);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message:', data);
        if (data.type === 'agent_start') {
          dispatch({ type: 'AGENT_START', agent: data.agent });
        } else if (data.type === 'agent_done') {
          dispatch({ type: 'AGENT_DONE', agent: data.agent, state: data.state });
        } else if (data.type === 'escalation') {
          dispatch({ type: 'ESCALATION', agent: data.agent, payload: data });
        } else if (data.type === 'complete') {
          dispatch({ type: 'COMPLETE', state: data.state });
        }
      };
      setWs(socket);
      return () => socket.close();
    }
  }, [state.runId]);

  useEffect(() => {
    if (state.status === 'complete') {
      setIsLearning(false);
      setLessonCount(4);
      const timer = setTimeout(() => setActiveTab('analytics'), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  const handleStart = async (transcript) => {
    try {
      setIsLearning(true);
      setLessonCount(0);
      const res = await fetch('http://localhost:8000/api/workflow/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const { run_id } = await res.json();
      dispatch({ type: 'SET_RUN_ID', payload: run_id });
    } catch (err) {
      console.error('Failed to start workflow:', err);
      alert(`Connection Error: Could not reach the backend server at localhost:8000. \n\nPlease ensure the backend is running. \n\nDetails: ${err.message}`);
      setIsLearning(false);
    }
  };

  const handleEscalationRespond = async (action) => {
    await fetch(`http://localhost:8000/api/escalation/${state.runId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    dispatch({ type: 'CLOSE_ESCALATION' });
  };

  const handleTaskReassign = (fromOwner, toOwner, taskTitle) => {
    dispatch({ type: 'REASSIGN_TASK', taskTitle, newOwner: toOwner });
  };

  const handleAuditLog = (logEntry) => {
    dispatch({ type: 'ADD_AUDIT_LOG', payload: logEntry });
  };

  return (
    <div className="min-h-screen bg-[#F1EDE6]">
      <header className="bg-[#3A2D28] px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F1EDE6]" style={{ fontFamily: 'Playfair Display, serif' }}>
            MissionControl
          </h1>
          <p className="text-[#CBAD8D] text-sm">Multi-Agent Enterprise Workflow OS</p>
        </div>
        <MetricsBar metrics={state.metrics} onViewAnalytics={() => setActiveTab('analytics')} />
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex space-x-1 bg-[#EBE3DB] p-1 rounded-xl w-fit border border-[#D1C7BD]">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'live' ? 'bg-[#3A2D28] text-[#F1EDE6] shadow-lg' : 'text-[#D1C7BD] hover:text-[#3A2D28]'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Live Workflow</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-[#3A2D28] text-[#F1EDE6] shadow-lg' : 'text-[#D1C7BD] hover:text-[#3A2D28]'
              }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('comms')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'comms' ? 'bg-[#3A2D28] text-[#F1EDE6] shadow-lg' : 'text-[#D1C7BD] hover:text-[#3A2D28]'
              }`}
          >
            <Mail className="w-4 h-4" />
            <span>Communications</span>
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'memory' ? 'bg-[#3A2D28] text-[#F1EDE6] shadow-lg' : 'text-[#D1C7BD] hover:text-[#3A2D28]'
              }`}
          >
            <Brain className="w-4 h-4" />
            <span>Memory</span>
          </button>
        </div>

        {activeTab === 'live' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AgentPipeline statuses={state.agentStatuses} />
            <CognitiveLoadMonitor 
              tasks={state.tasks} 
              onTaskReassign={handleTaskReassign}
              onAuditLog={handleAuditLog}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                <TranscriptInput onStart={handleStart} disabled={state.status === 'running'} />
                <AuditTrail log={state.auditLog} tasks={state.tasks} />
              </div>
              <div className="lg:col-span-2">
                <TaskBoard tasks={state.tasks} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AnalyticsDashboard
              tasks={state.tasks}
              auditLog={state.auditLog}
              metrics={state.metrics}
            />
          </div>
        )}

        {activeTab === 'comms' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EmailStatusPanel
              emails={state.auditLog.filter(e => e.action === 'send_email').map(e => ({
                owner: e.input_summary?.match(/to (.*)/)?.[1] || 'Unknown',
                title: e.input_summary?.match(/Assigning (.*) to/)?.[1] || 'Unknown Task',
                timestamp: e.timestamp,
                status: e.status,
                error: e.status === 'error' ? e.output_summary : null
              }))}
            />
            <CalendarPanel
              events={state.tasks.filter(t => t.event_link).map(t => ({
                title: t.title,
                owner: t.owner,
                deadline: t.deadline,
                event_link: t.event_link
              }))}
            />
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MemoryTab />
          </div>
        )}

        {state.escalation && (
          <EscalationModal
            onRespond={handleEscalationRespond}
          />
        )}

        <LiveLearningIndicator isLearning={isLearning} lessonCount={lessonCount} />
      </div>
    </div>
  );
}
