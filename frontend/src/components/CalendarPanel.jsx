import React from 'react';

const CalendarPanel = ({ events = [] }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mt-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-900/30 p-2 rounded-lg">
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Planned Calendar Events</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length === 0 ? (
          <div className="col-span-full py-8 text-gray-500 text-center italic border border-dashed border-gray-700 rounded-lg">
            No calendar events scheduled yet.
          </div>
        ) : (
          events.map((event, idx) => (
            <div key={idx} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-200 group-hover:text-purple-400 transition-colors line-clamp-1">{event.title}</h3>
                <span className="bg-purple-900/20 text-purple-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                  Confirmed
                </span>
              </div>
              <div className="space-y-2 text-xs text-gray-400">
                <p className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {event.owner}
                </p>
                <p className="flex items-center">
                  <svg className="w-3 h-3 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {event.deadline}
                </p>
              </div>
              <a
                href={event.event_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center w-full py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 text-xs font-bold rounded transition-colors"
              >
                Open in Calendar
                <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarPanel;
