import React, { useState } from 'react';
import { Play } from 'lucide-react';

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
    <div className="glass rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-200">Transcript Input</h3>
        <button
          onClick={() => onStart(transcript)}
          disabled={disabled}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium"
        >
          <Play className="w-4 h-4 fill-current" />
          Launch Workflow
        </button>
      </div>
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        disabled={disabled}
        className="w-full h-64 bg-black/40 border border-gray-800 rounded-lg p-4 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 resize-none font-mono"
      />
    </div>
  );
}
