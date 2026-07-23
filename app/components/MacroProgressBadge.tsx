import React from 'react';

interface MacroProgressBadgeProps {
  label: string;
  value: number;
}

const BADGE_CONFIG: Record<string, { colorClass: string; bgClass: string }> = {
  protein: {
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10 border-blue-500/20',
  },
  carbs: {
    colorClass: 'text-yellow-400',
    bgClass: 'bg-yellow-500/10 border-yellow-500/20',
  },
  fat: {
    colorClass: 'text-pink-400',
    bgClass: 'bg-pink-500/10 border-pink-500/20',
  },
  fiber: {
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10 border-emerald-500/20',
  },
};

export default function MacroProgressBadge({ label, value }: MacroProgressBadgeProps) {
  const key = label.toLowerCase();
  const config = BADGE_CONFIG[key] || {
    colorClass: 'text-slate-300',
    bgClass: 'bg-slate-800/40 border-slate-700/50',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border ${config.bgClass} backdrop-blur-sm transition-all`}
    >
      <span className="font-extrabold text-sm text-slate-100 font-mono">
        {Math.round(value)}g
      </span>
      <span className={`text-[10px] font-bold tracking-wider uppercase mt-0.5 ${config.colorClass}`}>
        {label}
      </span>
    </div>
  );
}
