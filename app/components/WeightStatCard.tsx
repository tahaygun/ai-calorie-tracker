import React from 'react';

interface WeightStatCardProps {
  label: string;
  value: string;
  subtext?: string;
  accentClass?: string;
}

export default function WeightStatCard({ label, value, subtext, accentClass = 'text-slate-100' }: WeightStatCardProps) {
  return (
    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-center flex flex-col justify-center">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
        {label}
      </span>
      <span className={`font-extrabold text-base sm:text-lg font-mono ${accentClass}`}>
        {value}
      </span>
      {subtext && <span className="text-[10px] text-slate-500 font-mono mt-0.5">{subtext}</span>}
    </div>
  );
}
