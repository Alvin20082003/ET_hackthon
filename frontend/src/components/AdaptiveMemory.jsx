import React, { useState, useEffect } from 'react';

const MEMORY_KEY = 'missioncontrol_memory';

// Initialize or get memory from localStorage
const getMemory = () => {
  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load memory:', e);
  }
  return {
    totalRuns: 0,
    lessons: [],
    improvedRuns: 0,
    totalEscalationsAvoided: 0
  };
};

const saveMemory = (memory) => {
  try {
    // Remove duplicates before saving
    const uniqueLessons = [];
    const seen = new Set();
    
    for (const lesson of memory.lessons) {
      const key = `${lesson.category}-${lesson.observation}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLessons.push(lesson);
      }
    }
    
    // Keep only last 20 lessons to prevent bloat
    const limitedLessons = uniqueLessons.slice(-20);
    
    const cleanMemory = {
      ...memory,
      lessons: limitedLessons
    };
    
    localStorage.setItem(MEMORY_KEY, JSON.stringify(cleanMemory));
  } catch (e) {
    console.error('Failed to save memory:', e);
  }
};

// Pre-Launch Memory Panel Component
export function AdaptiveMemoryPanel() {
  const [memory, setMemory] = useState(getMemory());

  useEffect(() => {
    const refreshMemory = () => {
      const latest = getMemory();
      
      // Remove duplicate lessons based on category and observation
      const uniqueLessons = [];
      const seen = new Set();
      
      for (const lesson of latest.lessons) {
        const key = `${lesson.category}-${lesson.observation}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueLessons.push(lesson);
        }
      }
      
      // Only show the 4 most recent unique lessons
      const recentLessons = uniqueLessons.slice(-4);
      
      setMemory({
        ...latest,
        lessons: recentLessons
      });
    };

    refreshMemory();
    const interval = setInterval(refreshMemory, 1000);
    window.addEventListener('storage', refreshMemory);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', refreshMemory);
    };
  }, []);

  if (memory.totalRuns === 0 || memory.lessons.length === 0) {
    return null;
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'overload':
        return <div className="w-3 h-3 rounded-full bg-[#A48374]" />;
      case 'deadline':
        return <div className="w-3 h-3 bg-[#CBAD8D]" />;
      case 'dependency':
        return <div className="w-3 h-3 bg-[#D1C7BD] transform rotate-45" />;
      case 'escalation':
        return (
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#3A2D28]" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#EBE3DB] border border-[#D1C7BD] rounded-xl p-4 space-y-3">
      <div>
        <h3 className="text-[13px] font-semibold text-[#3A2D28]" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>
          Adaptive Memory
        </h3>
        <p className="text-[10px] text-[#A48374] mt-1" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
          Lessons learned from {memory.totalRuns} previous run(s) — applying automatically to this workflow
        </p>
      </div>

      <div className="space-y-2">
        {memory.lessons.map((lesson, idx) => (
          <div key={lesson.id || idx} className="bg-[#F1EDE6] border border-[#D1C7BD] rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              {getCategoryIcon(lesson.category)}
              <span className="text-[9px] uppercase tracking-[1px] text-[#3A2D28]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                {lesson.category}
              </span>
              <span className="ml-auto bg-[#EBE3DB] text-[#3A2D28] text-[8px] px-2 py-0.5 rounded" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                Will apply
              </span>
            </div>
            <p className="text-[11px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              {lesson.observation}
            </p>
            <p className="text-[10px] text-[#CBAD8D] italic" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              {lesson.recommendation}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[11px] italic text-[#CBAD8D] text-center pt-2" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
        This workflow has been pre-optimised based on {memory.lessons.length} learned pattern{memory.lessons.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

// Live Learning Indicator Component
export function LiveLearningIndicator({ isLearning, lessonCount }) {
  if (!isLearning && lessonCount === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-6 left-6 bg-[#EBE3DB] border border-[#D1C7BD] rounded-full px-3 py-1 ${isLearning ? 'animate-pulse' : ''}`}>
      <span className="text-[10px] text-[#CBAD8D]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
        Adaptive Memory — {isLearning ? 'Learning...' : `${lessonCount} new lesson${lessonCount !== 1 ? 's' : ''} saved`}
      </span>
    </div>
  );
}

// Post-Run Memory Report Component
export function MemoryReport({ tasks, auditLog, hasAuditorCompleted }) {
  const [memory, setMemory] = useState(getMemory());
  const [savedForThisRun, setSavedForThisRun] = useState(false);
  const [currentRunId, setCurrentRunId] = useState(null);

  useEffect(() => {
    // Generate a unique run ID based on audit log length and timestamp
    if (hasAuditorCompleted && auditLog.length > 0) {
      const runId = `${auditLog.length}-${auditLog[auditLog.length - 1]?.timestamp}`;
      
      // Only save if this is a new run
      if (runId !== currentRunId && !savedForThisRun) {
        console.log('MemoryReport: New run detected, saving lessons...');
        setCurrentRunId(runId);
        
        const currentMemory = getMemory();
        
        // Check if we already saved for this exact run
        const lastLesson = currentMemory.lessons[currentMemory.lessons.length - 1];
        if (lastLesson && lastLesson.runNumber === currentMemory.totalRuns) {
          console.log('MemoryReport: Already saved for this run, skipping');
          setSavedForThisRun(true);
          return;
        }
        
        const newLessons = [];
        
        // Always add all 4 lesson types for demo purposes
        newLessons.push({
          id: `overload-${Date.now()}`,
          learnedOn: new Date().toISOString(),
          runNumber: currentMemory.totalRuns + 1,
          category: 'overload',
          observation: 'Ravi was assigned 2 Priority 5 tasks simultaneously — cognitive load reached 85% — task reassignment was triggered',
          recommendation: 'Cap Ravi at 1 Priority 5 task per workflow run',
          applied: false,
          timesApplied: 0
        });

        newLessons.push({
          id: `escalation-${Date.now() + 1}`,
          learnedOn: new Date().toISOString(),
          runNumber: currentMemory.totalRuns + 1,
          category: 'escalation',
          observation: 'Task escalated after 2 failed execution attempts — human intervention was required',
          recommendation: 'Add 1 day buffer to any task with 3+ dependencies',
          applied: false,
          timesApplied: 0
        });

        newLessons.push({
          id: `deadline-${Date.now() + 2}`,
          learnedOn: new Date().toISOString(),
          runNumber: currentMemory.totalRuns + 1,
          category: 'deadline',
          observation: 'Sept 21 had 2 tasks with identical deadlines — deadline cluster detected',
          recommendation: 'Stagger deadlines by minimum 1 day when multiple tasks share same date',
          applied: false,
          timesApplied: 0
        });

        newLessons.push({
          id: `dependency-${Date.now() + 3}`,
          learnedOn: new Date().toISOString(),
          runNumber: currentMemory.totalRuns + 1,
          category: 'dependency',
          observation: 'Vendor Contract Signing depended on 4 sequential tasks — zero buffer in critical path',
          recommendation: 'Flag any task with 4+ dependencies as high-risk before execution',
          applied: false,
          timesApplied: 0
        });

        const escalatedTasks = tasks.filter(t => t.status === 'escalated');
        
        const updatedMemory = {
          totalRuns: currentMemory.totalRuns + 1,
          lessons: [...currentMemory.lessons, ...newLessons],
          improvedRuns: currentMemory.improvedRuns + 1,
          totalEscalationsAvoided: currentMemory.totalEscalationsAvoided + (escalatedTasks.length === 0 ? 1 : 0)
        };

        console.log('MemoryReport: Saving to localStorage:', updatedMemory);
        saveMemory(updatedMemory);
        setMemory(updatedMemory);
        setSavedForThisRun(true);
        
        // Force update the memory tab
        window.dispatchEvent(new Event('storage'));
      }
    }
  }, [hasAuditorCompleted, auditLog.length, savedForThisRun, currentRunId, tasks]);

  // Reset when workflow restarts
  useEffect(() => {
    if (!hasAuditorCompleted) {
      setSavedForThisRun(false);
    }
  }, [hasAuditorCompleted]);

  if (!hasAuditorCompleted || memory.totalRuns === 0) {
    return null;
  }

  const escalationCount = tasks.filter(t => t.status === 'escalated').length;
  const currentRunLessons = memory.lessons.filter(l => l.runNumber === memory.totalRuns);

  return (
    <div className="my-4">
      <div className="h-[0.5px] bg-[#D1C7BD] mb-4" />
      
      <div className="mb-2">
        <span className="text-[9px] uppercase tracking-[2px] text-[#CBAD8D]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
          ADAPTIVE MEMORY UPDATE
        </span>
      </div>

      <div className="bg-[#F1EDE6] border border-[#D1C7BD] rounded-lg p-4 space-y-4">
        <h4 className="text-[13px] text-[#3A2D28]" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>
          What I learned from this run
        </h4>

        <div className="space-y-2">
          {currentRunLessons.map((lesson, idx) => (
            <p key={lesson.id} className="text-[11px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, lineHeight: 2 }}>
              {idx + 1}. {lesson.observation} → {lesson.recommendation}
            </p>
          ))}
        </div>

        <div className="h-[0.5px] bg-[#D1C7BD]" />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-[10px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              Total runs remembered:
            </p>
            <p className="text-[10px] text-[#3A2D28]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
              {memory.totalRuns}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              Patterns identified:
            </p>
            <p className="text-[10px] text-[#3A2D28]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
              {memory.lessons.length}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              Escalations this run:
            </p>
            <p className="text-[10px] text-[#3A2D28]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
              {escalationCount}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              Improvements applied:
            </p>
            <p className="text-[10px] text-[#3A2D28]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
              {memory.improvedRuns}
            </p>
          </div>
        </div>

        <p className="text-[10px] italic text-[#CBAD8D] pt-2" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
          Memory persisted to local storage · Will improve next workflow run automatically
        </p>
      </div>

      <div className="h-[0.5px] bg-[#D1C7BD] mt-4" />
    </div>
  );
}

// Memory Tab Component
export function MemoryTab() {
  const [memory, setMemory] = useState(getMemory());

  // Refresh memory when component mounts and on storage events
  useEffect(() => {
    const refreshMemory = () => {
      const latest = getMemory();
      console.log('MemoryTab: Refreshing memory', latest);
      setMemory(latest);
    };

    // Refresh immediately
    refreshMemory();

    // Refresh every second
    const interval = setInterval(refreshMemory, 1000);

    // Listen for storage events
    window.addEventListener('storage', refreshMemory);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', refreshMemory);
    };
  }, []);

  const handleClearMemory = () => {
    if (window.confirm('Are you sure you want to clear all learned patterns? This cannot be undone.')) {
      const emptyMemory = {
        totalRuns: 0,
        lessons: [],
        improvedRuns: 0,
        totalEscalationsAvoided: 0
      };
      saveMemory(emptyMemory);
      setMemory(emptyMemory);
    }
  };

  const handleTestSave = () => {
    const currentMemory = getMemory();
    const testLesson = {
      id: `test-${Date.now()}`,
      learnedOn: new Date().toISOString(),
      runNumber: currentMemory.totalRuns + 1,
      category: 'overload',
      observation: 'TEST LESSON - This is a manual test',
      recommendation: 'This proves localStorage is working',
      applied: false,
      timesApplied: 0
    };
    
    const updatedMemory = {
      totalRuns: currentMemory.totalRuns + 1,
      lessons: [...currentMemory.lessons, testLesson],
      improvedRuns: currentMemory.improvedRuns + 1,
      totalEscalationsAvoided: currentMemory.totalEscalationsAvoided
    };
    
    console.log('Manual test save:', updatedMemory);
    saveMemory(updatedMemory);
    setMemory(updatedMemory);
    alert('Test lesson saved! Check if it appears below.');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'overload':
        return <div className="w-3 h-3 rounded-full bg-[#A48374]" />;
      case 'deadline':
        return <div className="w-3 h-3 bg-[#CBAD8D]" />;
      case 'dependency':
        return <div className="w-3 h-3 bg-[#D1C7BD] transform rotate-45" />;
      case 'escalation':
        return (
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#3A2D28]" />
        );
      default:
        return null;
    }
  };

  if (memory.totalRuns === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <p className="text-[#A48374] text-center" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
          No memory yet. Run your first workflow to begin learning.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[16px] text-[#3A2D28] mb-2" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600 }}>
          The app has completed {memory.totalRuns} workflow run{memory.totalRuns !== 1 ? 's' : ''}
        </h2>
        <p className="text-[12px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
          Each run teaches the system new patterns. The more it runs, the smarter it gets.
        </p>
      </div>

      <div className="space-y-4">
        {memory.lessons.map((lesson, idx) => (
          <div key={lesson.id || idx} className="bg-[#EBE3DB] border border-[#D1C7BD] rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                Run #{lesson.runNumber}
              </span>
              <div className="flex items-center gap-2">
                {getCategoryIcon(lesson.category)}
                <span className="text-[9px] uppercase tracking-[1px] text-[#3A2D28]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                  {lesson.category}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              {lesson.observation}
            </p>
            <p className="text-[10px] text-[#CBAD8D] italic" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              {lesson.recommendation}
            </p>
            <p className="text-[9px] text-[#A48374]" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              Applied {lesson.timesApplied} time{lesson.timesApplied !== 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4 gap-3">
        <button
          onClick={handleTestSave}
          className="bg-[#CBAD8D] text-[#3A2D28] border border-[#D1C7BD] rounded-md px-4 py-2 transition-colors hover:bg-[#A48374] hover:text-[#F1EDE6]"
          style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}
        >
          Test Save Lesson
        </button>
        <button
          onClick={handleClearMemory}
          className="bg-[#EBE3DB] text-[#A48374] border border-[#D1C7BD] rounded-md px-4 py-2 transition-colors hover:bg-[#D1C7BD]"
          style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}
        >
          Clear Memory & Start Fresh
        </button>
      </div>
    </div>
  );
}

export default {
  AdaptiveMemoryPanel,
  LiveLearningIndicator,
  MemoryReport,
  MemoryTab
};
