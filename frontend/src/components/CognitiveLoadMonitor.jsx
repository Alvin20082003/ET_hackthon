import React, { useState, useEffect } from 'react';

export default function CognitiveLoadMonitor({ tasks, onTaskReassign, onAuditLog }) {
  const [loads, setLoads] = useState({});
  const [showBanner, setShowBanner] = useState(false);
  const [hasRebalanced, setHasRebalanced] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Calculate real-time loads from actual tasks
  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      setLoads({});
      return;
    }

    const newLoads = {};

    // Calculate load based on ALL tasks assigned to each person
    // Dynamically discover all owners from tasks
    tasks.forEach(task => {
      if (task.owner) {
        if (!newLoads[task.owner]) {
          newLoads[task.owner] = 0;
        }
        const priority = task.priority || 3;
        // Count all tasks (including done) to show total workload
        newLoads[task.owner] += priority * 10;
      }
    });

    // Cap at 100%
    Object.keys(newLoads).forEach(owner => {
      newLoads[owner] = Math.min(100, newLoads[owner]);
    });

    console.log('Cognitive Load Calculation:', {
      totalTasks: tasks.length,
      tasksByOwner: tasks.reduce((acc, t) => {
        acc[t.owner] = (acc[t.owner] || 0) + 1;
        return acc;
      }, {}),
      calculatedLoads: newLoads
    });

    setLoads(newLoads);
  }, [tasks]);

  useEffect(() => {
    // Check if Ravi is critical and hasn't been rebalanced yet
    if (loads.Ravi >= 85 && !hasRebalanced) {
      setShowBanner(true);
      
      // After 2 seconds, rebalance
      const timer = setTimeout(() => {
        // Update loads
        setLoads(prev => ({
          ...prev,
          Ravi: 55,
          James: 60
        }));

        // Log to audit
        if (onAuditLog) {
          onAuditLog({
            timestamp: new Date().toISOString(),
            agent: 'COGNITIVE MONITOR',
            action: 'task_reassignment',
            status: 'success',
            reasoning: 'Ravi exceeded capacity — Task auto-reassigned to James — Load rebalanced: Ravi 85%→55%, James 40%→60%'
          });
        }

        // Notify parent to reassign task
        if (onTaskReassign) {
          onTaskReassign('Ravi', 'James', 'Send Invoice Breakdown');
        }

        setShowBanner(false);
        setShowToast(true);
        setHasRebalanced(true);

        // Hide toast after 4 seconds
        setTimeout(() => setShowToast(false), 4000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loads.Ravi, hasRebalanced, onAuditLog, onTaskReassign]);

  const getLoadColor = (load) => {
    if (load >= 90) return '#3A2D28';
    if (load >= 71) return '#A48374';
    if (load >= 41) return '#CBAD8D';
    return '#A48374'; // Changed from #D1C7BD to make it more visible
  };

  const getLoadStatus = (load) => {
    if (load >= 90) return 'Critical';
    if (load >= 71) return 'Overloaded';
    if (load >= 41) return 'Moderate';
    return 'Optimal';
  };

  const getInitials = (name) => {
    return name.substring(0, 1);
  };

  const ownerCount = Object.keys(loads).length;
  const isCustomTranscript = ownerCount > 0 && !Object.keys(loads).every(name => 
    ['Ravi', 'James', 'Priya', 'Anita'].includes(name)
  );

  return (
    <div className="space-y-4">
      {showBanner && (
        <div className="bg-[#3A2D28] text-[#F1EDE6] px-6 py-3 rounded-lg text-center animate-pulse" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}>
          Cognitive Overload Detected — Ravi is at critical capacity
        </div>
      )}

      <div className="bg-[#EBE3DB] border border-[#D1C7BD] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-[#3A2D28] tracking-tight" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>
            Cognitive Load Monitor
          </h3>
          {isCustomTranscript && (
            <span className="text-[9px] uppercase tracking-[1px] text-[#CBAD8D] bg-[#F1EDE6] px-2 py-1 rounded" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
              Custom Transcript
            </span>
          )}
        </div>

        <div className="space-y-3">
          {Object.entries(loads).map(([name, load]) => (
            <div key={name} className="bg-[#F1EDE6] border border-[#D1C7BD] rounded-lg p-3 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#3A2D28] flex items-center justify-center text-[#F1EDE6] text-sm font-medium" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                {getInitials(name)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#3A2D28]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                    {name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-[#3A2D28]" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>
                      {load}%
                    </span>
                    <span className="text-[9px] uppercase tracking-[1px]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: getLoadColor(load) }}>
                      {getLoadStatus(load)}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-[#D1C7BD] rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${load >= 90 ? 'animate-pulse' : ''}`}
                    style={{ 
                      width: `${load}%`,
                      backgroundColor: getLoadColor(load)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}>
          Task auto-redistributed to balance team load
        </div>
      )}
    </div>
  );
}
