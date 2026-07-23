import React from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const SERVING_SIZE_OPTIONS = [
  { value: '0.25', label: '1/4' },
  { value: '0.33', label: '1/3' },
  { value: '0.5', label: '1/2' },
  { value: '0.75', label: '3/4' },
  { value: '1', label: '1x' },
  { value: '1.5', label: '1.5x' },
  { value: '2', label: '2x' },
];

interface ServingSizeSelectorProps {
  activeServingEdit: string;
  onServingChange: (_value: string) => void;
  onCommit: () => void;
  onButtonClick: (_value: string) => void;
}

export default function ServingSizeSelector({
  activeServingEdit,
  onServingChange,
  onCommit,
  onButtonClick,
}: ServingSizeSelectorProps) {
  const currentNum = parseFloat(activeServingEdit) || 1;

  const handleStep = (delta: number) => {
    const nextVal = Math.max(0.1, Math.round((currentNum + delta) * 10) / 10);
    onServingChange(nextVal.toString());
    onButtonClick(nextVal.toString());
  };

  return (
    <div className="pt-4 border-t border-slate-800/80 space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-sm font-semibold text-slate-200 block">Serving Size Multiplier</span>
          <span className="text-xs text-slate-400">Scales all item nutrition values proportionally</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleStep(-0.1)}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Decrease serving size"
          >
            <FaMinus className="w-3 h-3" />
          </button>
          <div className="flex items-center px-1">
            <input
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={activeServingEdit}
              onChange={e => onServingChange(e.target.value)}
              onBlur={onCommit}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onCommit();
                }
              }}
              className="w-12 text-center bg-transparent font-mono font-bold text-sm text-emerald-400 outline-none"
            />
            <span className="text-xs text-slate-400 pr-1">serving(s)</span>
          </div>
          <button
            type="button"
            onClick={() => handleStep(0.1)}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Increase serving size"
          >
            <FaPlus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Serving size quick selection pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {SERVING_SIZE_OPTIONS.map(option => {
          const isActive = Math.abs(currentNum - parseFloat(option.value)) < 0.02;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onButtonClick(option.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/40 scale-[1.03]'
                  : 'bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
