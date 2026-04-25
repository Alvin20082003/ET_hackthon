import React from 'react';

const EmailStatusPanel = ({ emails = [] }) => {
  return (
    <div className="bg-[#EBE3DB] rounded-xl p-6 border border-[#D1C7BD] mt-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-[#CBAD8D]/30 p-2 rounded-lg">
          <svg className="w-6 h-6 text-[#A48374]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#3A2D28]">Email Communications</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[#A48374] border-b border-[#D1C7BD]">
              <th className="pb-3 pr-4">Recipient</th>
              <th className="pb-3 pr-4">Task</th>
              <th className="pb-3 pr-4">Timestamp</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D1C7BD]">
            {emails.length === 0 ? (
              <tr><td colSpan="4" className="py-4 text-[#CBAD8D] text-center italic">No emails sent yet.</td></tr>
            ) : (
              emails.map((email, idx) => (
                <tr key={idx} className="text-sm">
                  <td className="py-3 pr-4 font-medium text-[#3A2D28]">{email.owner}</td>
                  <td className="py-3 pr-4 text-[#A48374]">{email.title}</td>
                  <td className="py-3 pr-4 text-[#CBAD8D]">{new Date(email.timestamp).toLocaleTimeString()}</td>
                  <td className="py-3">
                    {email.status === 'success' ? (
                      <span className="flex items-center text-green-600">Sent</span>
                    ) : (
                      <span className="flex items-center text-[#ff3355]">Failed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailStatusPanel;
