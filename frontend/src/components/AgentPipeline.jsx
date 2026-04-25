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
    <div className="flex items-center justify-between w-full h-24 bg-[#EBE3DB] border border-[#D1C7BD] rounded-xl px-12 relative overflow-hidden">
      {NODES.map((node, i) => (
        <React.Fragment key={node.id}>
          <div className="flex flex-col items-center z-10">
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-[#F1EDE6]
              ${statuses[node.id] === 'done' ? 'agent-node-done' : ''}
              ${statuses[node.id] === 'active' ? 'agent-node-active' : ''}
              ${statuses[node.id] === 'error' ? 'agent-node-error' : ''}
              ${statuses[node.id] === 'idle' ? 'border-[#D1C7BD] text-[#CBAD8D]' : ''}
            `}>
              {statuses[node.id] === 'done' && <CheckCircle2 className="w-6 h-6" />}
              {statuses[node.id] === 'active' && <Loader2 className="w-6 h-6 animate-spin" />}
              {statuses[node.id] === 'error' && <AlertCircle className="w-6 h-6" />}
              {statuses[node.id] === 'idle' && <Circle className="w-6 h-6" />}
            </div>
            <span className={`text-xs mt-2 font-medium ${statuses[node.id] !== 'idle' ? 'text-[#3A2D28]' : 'text-[#A48374]'}`}>
              {node.name}
            </span>
          </div>
          {i < NODES.length - 1 && (
            <div className="flex-1 h-[2px] mx-4 relative">
              <div className="absolute inset-0 bg-[#D1C7BD]" />
              <div
                className={`absolute inset-0 transition-all duration-1000 origin-left
                ${statuses[node.id] === 'done' ? 'scale-x-100' : 'scale-x-0'}`}
                style={{ background: 'linear-gradient(to right, #A48374, #CBAD8D)' }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
