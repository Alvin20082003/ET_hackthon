import React from 'react';
import { Clock, Layers, Calendar } from 'lucide-react';

const COLUMNS = [
  { id: 'backlog', name: 'Backlog' },
  { id: 'in_progress', name: 'In Progress' },
  { id: 'done', name: 'Done' },
  { id: 'escalated', name: 'Escalated' }
];

export default function TaskBoard({ tasks }) {
  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
      {COLUMNS.map(col => (
        <div key={col.id} className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-bold text-[#A48374] uppercase tracking-widest">{col.name}</h4>
            <span className="bg-[#EBE3DB] text-[#A48374] text-xs px-2 py-0.5 rounded-full border border-[#D1C7BD]">
              {getTasksByStatus(col.id).length}
            </span>
          </div>
          <div className={`flex-1 rounded-xl p-4 space-y-4 min-h-[500px] border border-dashed border-[#D1C7BD] transition-colors
            ${col.id === 'escalated' && getTasksByStatus(col.id).length > 0 ? 'bg-[#ff3355]/5 border-[#ff3355]/20' : 'bg-[#EBE3DB]'}
          `}>
            {getTasksByStatus(col.id).map(task => (
              <div key={task.id} className={`bg-[#F1EDE6] border border-[#D1C7BD] p-4 rounded-xl space-y-3 transition-all transform hover:scale-[1.02]
                ${col.id === 'escalated' ? 'shadow-[0_0_15px_rgba(255,51,85,0.08)] border-[#ff3355]/30' : ''}
              `}>
                <div className="flex justify-between items-start gap-2">
                  <h5 
                    className="font-semibold text-sm leading-tight text-[#3A2D28] flex-1 cursor-help" 
                    title={task.title}
                  >
                    {task.title}
                  </h5>
                  <div className="flex items-center gap-1">
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap
                      ${task.priority >= 4 ? 'bg-[#ff3355]/15 text-[#ff3355]' : 'bg-[#CBAD8D]/30 text-[#A48374]'}
                    `}>
                      P{task.priority}
                    </div>
                    {task.event_link && (
                      <a
                        href={task.event_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View in Google Calendar"
                        className="p-1 hover:bg-[#D1C7BD] rounded transition-colors text-[#A48374]"
                      >
                        <Calendar className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <p 
                  className="text-xs text-[#A48374] line-clamp-2 cursor-help" 
                  title={task.description}
                >
                  {task.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#D1C7BD]">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#CBAD8D] flex items-center justify-center text-[10px] font-bold border-2 border-[#F1EDE6] text-[#3A2D28]">
                      {task.owner?.substring(0, 1) || 'U'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[#A48374] text-[10px]">
                    {task.dependencies?.length > 0 && (
                      <div className="flex items-center gap-1 text-[#CBAD8D]">
                        <Layers className="w-3 h-3" />
                        <span>{task.dependencies.length}</span>
                      </div>
                    )}
                    <div className={`flex items-center gap-1 ${task.sla_hours < 0 ? 'text-[#ff3355] animate-pulse' : ''}`}>
                      <Clock className="w-3 h-3" />
                      <span>{task.sla_hours}h</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
