import React from 'react';
import { Clock, AlertTriangle, Layers, User, Calendar } from 'lucide-react';

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
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{col.name}</h4>
            <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
              {getTasksByStatus(col.id).length}
            </span>
          </div>
          <div className={`flex-1 rounded-xl p-4 space-y-4 min-h-[500px] border border-dashed border-gray-800 transition-colors
            ${col.id === 'escalated' && getTasksByStatus(col.id).length > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-black/20'}
          `}>
            {getTasksByStatus(col.id).map(task => (
              <div key={task.id} className={`glass p-4 rounded-xl border border-white/5 space-y-3 transition-all transform hover:scale-[1.02]
                ${col.id === 'escalated' ? 'shadow-[0_0_15px_rgba(239,68,68,0.1)] border-red-500/30' : ''}
              `}>
                <div className="flex justify-between items-start">
                  <h5 className="font-semibold text-sm leading-tight">{task.title}</h5>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                    ${task.priority >= 4 ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}
                  `}>
                    P{task.priority}
                  </div>
                  {task.event_link && (
                    <a
                      href={task.event_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View in Google Calendar"
                      className="p-1 hover:bg-white/10 rounded transition-colors text-purple-400"
                    >
                      <Calendar className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold border-2 border-gray-950">
                      {task.owner?.substring(0, 1) || 'U'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-500 text-[10px]">
                    {task.dependencies?.length > 0 && (
                      <div className="flex items-center gap-1 text-amber-500/70">
                        <Layers className="w-3 h-3" />
                        <span>{task.dependencies.length}</span>
                      </div>
                    )}
                    <div className={`flex items-center gap-1 ${task.sla_hours < 0 ? 'text-red-500 animate-pulse' : ''}`}>
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
