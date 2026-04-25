import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function MetricsBar({ metrics, onViewAnalytics }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = metrics.autonomy_rate || 0;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-6 bg-[#EBE3DB] border border-[#D1C7BD] px-6 py-2 rounded-2xl">
      <div className="flex flex-col items-center">
        <span className="text-[10px] text-[#A48374] font-bold uppercase">Total</span>
        <span className="text-lg font-bold text-[#3A2D28]">{metrics.total}</span>
      </div>
      <div className="w-[1px] h-8 bg-[#D1C7BD]" />
      <div className="flex flex-col items-center text-green-600">
        <span className="text-[10px] text-[#A48374] font-bold uppercase">Done</span>
        <span className="text-lg font-bold">{metrics.completed}</span>
      </div>
      <div className="w-[1px] h-8 bg-[#D1C7BD]" />
      <div className="flex flex-col items-center text-[#ff3355]">
        <span className="text-[10px] text-[#A48374] font-bold uppercase">Failed</span>
        <span className="text-lg font-bold">{metrics.failed}</span>
      </div>
      <div className="w-[1px] h-8 bg-[#D1C7BD]" />
      <div className="flex flex-col items-center text-[#CBAD8D]">
        <span className="text-[10px] text-[#A48374] font-bold uppercase">Escalated</span>
        <span className="text-lg font-bold">{metrics.escalated}</span>
      </div>
      <div className="w-[1px] h-8 bg-[#D1C7BD]" />

      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="24" cy="24" r={radius}
              className="stroke-[#D1C7BD] fill-none"
              strokeWidth="4"
            />
            <circle
              cx="24" cy="24" r={radius}
              stroke="#A48374"
              className="fill-none transition-all duration-1000"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#3A2D28]">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-[#A48374] font-bold uppercase">Autonomy</span>
          <span className="text-[10px] text-[#A48374] font-bold uppercase tracking-widest">Rate</span>
        </div>
      </div>

      <div className="w-[1px] h-8 bg-[#D1C7BD]" />

      <button
        onClick={onViewAnalytics}
        className="flex items-center gap-2 bg-[#CBAD8D]/20 hover:bg-[#CBAD8D]/40 text-[#A48374] px-3 py-1.5 rounded-lg border border-[#CBAD8D]/40 transition-all group"
      >
        <BarChart2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-bold uppercase">View Analytics</span>
      </button>
    </div>
  );
}
