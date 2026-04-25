import React, { useState } from 'react';
import { Terminal, Download, AlertCircle, MessageSquare } from 'lucide-react';
import WorkflowObituary from './WorkflowObituary';
import { MemoryReport } from './AdaptiveMemory';

export default function AuditTrail({ log, tasks = [] }) {
  const [filter, setFilter] = useState('all');

  const filteredLog = filter === 'all'
    ? log
    : log.filter(entry => entry.agent.toLowerCase() === filter.toLowerCase());

  const escalatedTasks = tasks.filter(task => task.status === 'escalated');
  const hasAuditorCompleted = log.some(entry => 
    entry.agent && entry.agent.toLowerCase() === 'auditor' && entry.status === 'success'
  );
  const allTasks = tasks;

  console.log('AuditTrail: hasAuditorCompleted =', hasAuditorCompleted, 'tasks.length =', tasks.length);

  const exportToPDF = () => {
    // Create formatted text content
    let content = 'MISSIONCONTROL - AUDIT TRAIL REPORT\n';
    content += '='.repeat(80) + '\n\n';
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Total Entries: ${filteredLog.length}\n`;
    content += `Filter: ${filter === 'all' ? 'All Agents' : filter.charAt(0).toUpperCase() + filter.slice(1)}\n`;
    content += '='.repeat(80) + '\n\n';

    filteredLog.forEach((entry, i) => {
      content += `[${i + 1}] ${new Date(entry.timestamp).toLocaleString()}\n`;
      content += `Agent: ${entry.agent.toUpperCase()}\n`;
      content += `Action: ${entry.action}\n`;
      content += `Status: ${entry.status.toUpperCase()}\n`;
      if (entry.reasoning) {
        content += `Reasoning: ${entry.reasoning}\n`;
      }
      if (entry.input_summary) {
        content += `Input: ${entry.input_summary}\n`;
      }
      if (entry.output_summary) {
        content += `Output: ${entry.output_summary}\n`;
      }
      if (entry.status === 'error' && entry.output_summary) {
        content += `ERROR: ${entry.output_summary}\n`;
      }
      content += '-'.repeat(80) + '\n\n';
    });

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', url);
    downloadAnchorNode.setAttribute('download', `audit_trail_${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'escalate': return <AlertCircle className="w-4 h-4 text-[#CBAD8D]" />;
      case 'send_email': return (
        <svg className="w-4 h-4 text-[#A48374]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
      default: return <MessageSquare className="w-4 h-4 text-[#A48374]" />;
    }
  };

  const getStatusColor = (status, action) => {
    if (action === 'send_email') return 'bg-[#CBAD8D]/30 text-[#A48374] border border-[#CBAD8D]/50';
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'error': return 'bg-[#ff3355]/10 text-[#ff3355]';
      default: return 'bg-[#EBE3DB] text-[#A48374]';
    }
  };

  return (
    <div className="bg-[#EBE3DB] border border-[#D1C7BD] rounded-xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#A48374]" />
          <h3 className="text-sm font-semibold text-[#3A2D28]">Audit Trail</h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#F1EDE6] text-[#3A2D28] text-xs border border-[#D1C7BD] rounded px-2 py-1 focus:ring-1 ring-[#A48374] outline-none"
          >
            <option value="all">All Agents</option>
            <option value="scribe">Scribe</option>
            <option value="planner">Planner</option>
            <option value="executor">Executor</option>
            <option value="auditor">Auditor</option>
          </select>
          <button onClick={exportToPDF} className="text-[#A48374] hover:text-[#3A2D28] transition-colors" title="Export as formatted text report">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 text-[10px] pr-2 custom-scrollbar" style={{ fontFamily: 'DM Mono, monospace' }}>
        {filteredLog.length === 0 && <div className="text-[#CBAD8D] italic">No logs yet...</div>}
        {filteredLog.map((entry, i) => (
          <div key={i} className="border-l-2 border-[#D1C7BD] pl-3 py-1 hover:bg-[#F1EDE6] transition-colors group">
            <div className="flex items-center gap-2">
              <span className="text-[#CBAD8D]">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
              <span className="font-bold uppercase tracking-wider text-[#A48374] flex items-center gap-1">
                {getActionIcon(entry.action)}
                {entry.agent}
              </span>
              <span className={`px-1.5 rounded-sm font-bold scale-90 ${getStatusColor(entry.status, entry.action)}`}>
                {entry.status}
              </span>
            </div>
            <div className="text-[#3A2D28] font-bold mt-0.5">{entry.action}</div>
            {entry.status === 'error' && (
              <div className="text-[#ff3355] bg-[#ff3355]/5 px-2 py-1 rounded mt-1 border border-[#ff3355]/20">
                {entry.output_summary}
              </div>
            )}
            <p className="text-[#A48374] italic mt-0.5">{entry.reasoning}</p>
          </div>
        ))}
        
        {hasAuditorCompleted && escalatedTasks.length > 0 && escalatedTasks.map((task, idx) => (
          <WorkflowObituary 
            key={`obituary-${idx}`}
            task={task}
            runDate="Sept 12, 2025"
            attempt1Time="14:23:15"
            attempt2Time="14:28:42"
          />
        ))}
        
        <MemoryReport 
          tasks={allTasks}
          auditLog={log}
          hasAuditorCompleted={hasAuditorCompleted}
        />
      </div>
    </div>
  );
}
