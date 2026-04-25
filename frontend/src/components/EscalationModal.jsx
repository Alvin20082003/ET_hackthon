import React from 'react';
import { AlertCircle, XCircle, CheckCircle } from 'lucide-react';

export default function EscalationModal({ onRespond }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2D28]/60 backdrop-blur-md">
      <div className="bg-[#EBE3DB] border border-[#D1C7BD] w-full max-w-lg p-8 rounded-3xl shadow-xl relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#ff3355] rounded-full flex items-center justify-center shadow-lg border-4 border-[#F1EDE6]">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        
        <div className="text-center space-y-4 pt-4">
          <h2 className="text-2xl font-bold text-[#3A2D28]">Escalation Required</h2>
          <p className="text-[#A48374] text-sm">
            Multiple task execution attempts have failed. The system requires human intervention to resolve the bottleneck and ensure SLA compliance.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => onRespond('approve')}
            className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-green-50 border border-green-200 hover:bg-green-100 transition-all text-green-700"
          >
            <CheckCircle className="w-8 h-8" />
            <div className="text-center">
              <span className="block font-bold text-sm">Approve</span>
              <span className="text-[10px] opacity-70 italic">Continue execution</span>
            </div>
          </button>
          
          <button
            onClick={() => onRespond('reject')}
            className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#ff3355]/5 border border-[#ff3355]/20 hover:bg-[#ff3355]/10 transition-all text-[#ff3355]"
          >
            <XCircle className="w-8 h-8" />
            <div className="text-center">
              <span className="block font-bold text-sm">Reject</span>
              <span className="text-[10px] opacity-70 italic">Terminate workflow</span>
            </div>
          </button>
        </div>

        <div className="mt-6 flex justify-center text-[10px] text-[#CBAD8D] uppercase font-bold tracking-[0.2em]">
          MissionControl Operator Console
        </div>
      </div>
    </div>
  );
}
