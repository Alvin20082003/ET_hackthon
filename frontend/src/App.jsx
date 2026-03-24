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
import { LayoutDashboard, BarChart2, Mail } from 'lucide-react';

const initialState = {
  tasks: [],
  auditLog: [],
  metrics: { total: 0, completed: 0, failed: 0, escalated: 0, autonomy_rate: 0 },
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
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [ws, setWs] = useState(null);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    if (state.runId) {
      const socket = new WebSocket(`ws://localhost:8000/ws/${state.runId}`);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
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
      const timer = setTimeout(() => setActiveTab('analytics'), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  const handleStart = async (transcript) => {
    try {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            MissionControl
          </h1>
          <p className="text-gray-400">Multi-Agent Enterprise Workflow OS</p>
        </div>
        <MetricsBar metrics={state.metrics} onViewAnalytics={() => setActiveTab('analytics')} />
      </header>

      <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl w-fit border border-gray-800">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'live' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Live Workflow</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('comms')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'comms' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          <Mail className="w-4 h-4" />
          <span>Communications</span>
        </button>
      </div>

      {activeTab === 'live' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AgentPipeline statuses={state.agentStatuses} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <TranscriptInput onStart={handleStart} disabled={state.status === 'running'} />
              <AuditTrail log={state.auditLog} />
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

      {state.escalation && (
        <EscalationModal
          onRespond={handleEscalationRespond}
        />
      )}
    </div>
  );
}
