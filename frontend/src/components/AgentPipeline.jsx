import React from 'react';
import { CheckCircle2, Loader2, AlertCircle, Circle } from 'lucide-react';

const NODES = [
  { id: 'scribe', name: 'Scribe' },
  { id: 'planner', name: 'Planner' },
  { id: 'executor', name: 'Executor' },
  { id: 'auditor', name: 'Auditor' },
  { id: 'escalation_check', name: 'Escalation' }
];

export default function AgentPipeline({ statuses }) {
  return (
    <div className="flex items-center justify-between w-full h-24 glass rounded-xl px-12 relative overflow-hidden">
      {NODES.map((node, i) => (
        <React.Fragment key={node.id}>
          <div className="flex flex-col items-center z-10">
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-gray-900
              ${statuses[node.id] === 'done' ? 'agent-node-done' : ''}
              ${statuses[node.id] === 'active' ? 'agent-node-active' : ''}
              ${statuses[node.id] === 'error' ? 'agent-node-error' : ''}
              ${statuses[node.id] === 'idle' ? 'border-gray-700 text-gray-700' : ''}
            `}>
              {statuses[node.id] === 'done' && <CheckCircle2 className="w-6 h-6" />}
              {statuses[node.id] === 'active' && <Loader2 className="w-6 h-6 animate-spin" />}
              {statuses[node.id] === 'error' && <AlertCircle className="w-6 h-6" />}
              {statuses[node.id] === 'idle' && <Circle className="w-6 h-6" />}
            </div>
            <span className={`text-xs mt-2 font-medium ${statuses[node.id] !== 'idle' ? 'text-gray-200' : 'text-gray-600'}`}>
              {node.name}
            </span>
          </div>
          {i < NODES.length - 1 && (
            <div className="flex-1 h-[2px] mx-4 relative">
              <div className="absolute inset-0 bg-gray-800" />
              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 origin-left
                ${statuses[node.id] === 'done' ? 'scale-x-100' : 'scale-x-0'}`}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
