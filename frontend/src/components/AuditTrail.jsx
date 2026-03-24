import React, { useState } from 'react';
import { Terminal, Download, Filter, AlertCircle, MessageSquare } from 'lucide-react';

export default function AuditTrail({ log }) {
  const [filter, setFilter] = useState('all');

  const filteredLog = filter === 'all'
    ? log
    : log.filter(entry => entry.agent.toLowerCase() === filter.toLowerCase());

  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(log, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "audit_log.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'escalate': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'send_email': return (
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status, action) => {
    if (action === 'send_email') return 'bg-blue-900/30 text-blue-400 border border-blue-800/50';
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-500';
      case 'error': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="glass rounded-xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-200">Audit Trail</h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 text-xs border-none rounded px-2 py-1 focus:ring-1 ring-blue-500 outline-none"
          >
            <option value="all">All Agents</option>
            <option value="scribe">Scribe</option>
            <option value="planner">Planner</option>
            <option value="executor">Executor</option>
            <option value="auditor">Auditor</option>
          </select>
          <button onClick={exportJson} className="hover:text-blue-400 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] pr-2 custom-scrollbar">
        {filteredLog.length === 0 && <div className="text-gray-600 italic">No logs yet...</div>}
        {filteredLog.map((entry, i) => (
          <div key={i} className="border-l-2 border-gray-800 pl-3 py-1 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
              <span className="font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                {getActionIcon(entry.action)}
                {entry.agent}
              </span>
              <span className={`px-1.5 rounded-sm font-bold scale-90 ${getStatusColor(entry.status, entry.action)}`}>
                {entry.status}
              </span>
            </div>
            <div className="text-gray-300 font-bold mt-0.5">{entry.action}</div>
            {entry.status === 'error' && (
              <div className="text-red-400/80 bg-red-400/5 px-2 py-1 rounded mt-1 border border-red-400/10">
                {entry.output_summary}
              </div>
            )}
            <p className="text-gray-500 italic mt-0.5">{entry.reasoning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
