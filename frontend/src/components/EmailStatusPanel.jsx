import React from 'react';

const EmailStatusPanel = ({ emails = [] }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mt-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-900/30 p-2 rounded-lg">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Email Communications</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="pb-3 pr-4">Recipient</th>
              <th className="pb-3 pr-4">Task</th>
              <th className="pb-3 pr-4">Timestamp</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {emails.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-gray-500 text-center italic">No emails sent yet.</td>
              </tr>
            ) : (
              emails.map((email, idx) => (
                <tr key={idx} className="text-sm">
                  <td className="py-3 pr-4 font-medium">{email.owner}</td>
                  <td className="py-3 pr-4 text-gray-300">{email.title}</td>
                  <td className="py-3 pr-4 text-gray-400">{new Date(email.timestamp).toLocaleTimeString()}</td>
                  <td className="py-3">
                    {email.status === 'success' ? (
                      <span className="flex items-center text-green-400">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Sent
                      </span>
                    ) : (
                      <span className="flex items-center text-red-400 cursor-help" title={email.error || 'Check backend logs'}>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Failed
                      </span>
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
