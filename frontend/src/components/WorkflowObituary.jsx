import React from 'react';

export default function WorkflowObituary({ task, runDate, attempt1Time, attempt2Time }) {
  if (!task || task.status !== 'escalated') {
    return null;
  }

  const timestamp = new Date().toLocaleString();

  return (
    <div className="my-4">
      <div className="h-[0.5px] bg-[#D1C7BD] mb-4" />
      
      <div className="mb-2">
        <span className="text-[9px] uppercase tracking-[2px] text-[#CBAD8D]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
          PERMANENT RECORD
        </span>
      </div>

      <div className="bg-[#F1EDE6] border-[0.5px] border-[#D1C7BD] rounded-lg p-4 space-y-3">
        <h4 className="text-[13px] text-[#3A2D28]" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>
          Task Obituary — {task.title}
        </h4>

        <p className="text-[11px] text-[#A48374] leading-[1.9]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
          This task was assigned to{' '}
          <span className="text-[#3A2D28]" style={{ fontWeight: 500 }}>{task.owner}</span>
          {' '}on{' '}
          <span className="text-[#3A2D28]" style={{ fontWeight: 500 }}>{runDate || 'Sept 12, 2025'}</span>
          {' '}with a deadline of{' '}
          <span className="text-[#3A2D28]" style={{ fontWeight: 500 }}>{task.deadline}</span>
          {' '}and a priority classification of{' '}
          <span className="text-[#3A2D28]" style={{ fontWeight: 500 }}>{task.priority}/5</span>
          . The Executor Agent attempted primary execution at{' '}
          <span className="text-[#3A2D28]" style={{ fontWeight: 500 }}>{attempt1Time || '14:23:15'}</span>
          {' '}— this approach failed due to resource constraints. A secondary fallback strategy was deployed at{' '}
          <span className="text-[#3A2D28]" style={{ fontWeight: 500 }}>{attempt2Time || '14:28:42'}</span>
          {' '}— this too was unsuccessful. The task was subsequently escalated for human review.
        </p>

        <p className="text-[11px] text-[#A48374] leading-[1.9]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
          It is recommended that this task be reassigned to a senior resource, scope be reduced by 40%, or the deadline be extended by a minimum of 3 business days. This record has been permanently logged to the audit trail.
        </p>

        <div className="pt-2 border-t border-[#D1C7BD]">
          <p className="text-[10px] italic text-[#CBAD8D]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
            Logged by Auditor Agent · {timestamp}
          </p>
        </div>
      </div>

      <div className="h-[0.5px] bg-[#D1C7BD] mt-4" />
    </div>
  );
}
