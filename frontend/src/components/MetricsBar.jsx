import React from 'react';
import { Target, CheckCircle, XCircle, UserX, Zap, BarChart2 } from 'lucide-react';

export default function MetricsBar({ metrics, onViewAnalytics }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = metrics.autonomy_rate || 0;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-6 glass px-6 py-2 rounded-2xl">
      <div className="flex flex-col items-center">
        <span className="text-[10px] text-gray-500 font-bold uppercase">Total</span>
        <span className="text-lg font-bold text-gray-100">{metrics.total}</span>
      </div>
      <div className="w-[1px] h-8 bg-gray-800" />
      <div className="flex flex-col items-center text-green-500">
        <span className="text-[10px] text-gray-500 font-bold uppercase">Done</span>
        <span className="text-lg font-bold">{metrics.completed}</span>
      </div>
      <div className="w-[1px] h-8 bg-gray-800" />
      <div className="flex flex-col items-center text-red-500">
        <span className="text-[10px] text-gray-500 font-bold uppercase">Failed</span>
        <span className="text-lg font-bold">{metrics.failed}</span>
      </div>
      <div className="w-[1px] h-8 bg-gray-800" />
      <div className="flex flex-col items-center text-amber-500">
        <span className="text-[10px] text-gray-500 font-bold uppercase">Escalated</span>
        <span className="text-lg font-bold">{metrics.escalated}</span>
      </div>
      <div className="w-[1px] h-8 bg-gray-800" />

      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="24" cy="24" r={radius}
              className="stroke-gray-800 fill-none"
              strokeWidth="4"
            />
            <circle
              cx="24" cy="24" r={radius}
              className="stroke-blue-500 fill-none transition-all duration-1000"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase">Autonomy</span>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Rate</span>
        </div>
      </div>

      <div className="w-[1px] h-8 bg-gray-800" />

      <button
        onClick={onViewAnalytics}
        className="flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all group"
      >
        <BarChart2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-bold uppercase">View Analytics</span>
      </button>
    </div>
  );
}
