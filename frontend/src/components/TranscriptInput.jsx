import React, { useState } from 'react';
import { Play } from 'lucide-react';
import WorkflowRiskScore from './WorkflowRiskScore';
import { AdaptiveMemoryPanel } from './AdaptiveMemory';

const DEFAULT_TRANSCRIPT = `Q3 Planning Meeting — Sept 12, 2025
Attendees: Sarah (PM), Ravi (Eng Lead), Priya (Design), James (Finance), Anita (Legal)

Sarah: We need to finalize the vendor contract with Nexus Corp by Sept 20th. James, can you handle the financial review?
James: Sure, I need the invoice breakdown from Ravi first.
Ravi: I'll send that by Sept 15. Also, auth service migration is blocking Priya's onboarding redesign.
Priya: I cannot start until auth is done. Give me 3 days after.
Sarah: Auth migration is critical path. Ravi, earliest date?
Ravi: September 17th if I get infra access today.
Sarah: Buffer to Sept 18. Priya delivers Sept 21. Contract signed Sept 22. James loop in Anita for legal review — 2 days.
James: I'll send Anita the draft by Sept 19.
Anita: Legal review done by Sept 21.`;

export default function TranscriptInput({ onStart, disabled }) {
  const [transcript, setTranscript] = useState(DEFAULT_TRANSCRIPT);

  return (
    <div className="space-y-4">
      <div className="bg-[#EBE3DB] border border-[#D1C7BD] rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#3A2D28]">Transcript Input</h3>
        </div>
        <div className="bg-[#F1EDE6] border border-[#CBAD8D] rounded-lg p-3 text-[11px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          💡 Tip: Edit the transcript with different names and tasks. The Cognitive Load Monitor will automatically detect and display the new team members.
        </div>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          disabled={disabled}
          className="w-full h-64 bg-[#F1EDE6] border border-[#D1C7BD] rounded-lg p-4 text-sm text-[#3A2D28] focus:outline-none focus:border-[#A48374] resize-none"
          style={{ fontFamily: 'DM Mono, monospace' }}
        />
      </div>
      
      <AdaptiveMemoryPanel />
      
      <WorkflowRiskScore transcript={transcript} />
      
      <button
        onClick={() => onStart(transcript)}
        disabled={disabled}
        className="w-full bg-[#3A2D28] hover:bg-[#A48374] disabled:bg-[#D1C7BD] text-[#F1EDE6] px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-medium"
      >
        <Play className="w-4 h-4 fill-current" />
        Launch Workflow
      </button>
    </div>
  );
}
