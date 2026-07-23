'use client';

import { useSettings } from '@/lib/contexts/SettingsContext';
import { useWeights } from '@/lib/hooks/useWeights';
import { WeightEntry } from '@/lib/types';
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from 'react-icons/fa';
import WeightStatCard from './WeightStatCard';

let chartRegistered = false;

type WeightChartData = ChartData<'line', number[], string>;

export default function WeightTracker() {
  const { targetWeight } = useSettings();
  const { weights, addWeight, deleteWeight, isLoading } = useWeights();

  const [newWeight, setNewWeight] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const chartData = useMemo<WeightChartData | null>(() => {
    if (isLoading) return null;

    const sortedEntries = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedEntries.length === 0) return null;

    const labels = sortedEntries.map(entry => formatDate(entry.date));
    const weightData = sortedEntries.map(entry => entry.weight);

    return {
      labels,
      datasets: [
        {
          label: 'Weight (kg)',
          data: weightData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#60a5fa',
          pointBorderColor: '#1d4ed8',
          pointHoverRadius: 6,
        },
        ...(targetWeight
          ? [
              {
                label: 'Target (kg)',
                data: Array(labels.length).fill(targetWeight),
                borderColor: '#10b981',
                borderDash: [5, 5],
                fill: false,
                tension: 0,
                pointRadius: 0,
              },
            ]
          : []),
      ],
    };
  }, [weights, targetWeight, isLoading]);

  // Register Chart.js components on mount
  useEffect(() => {
    if (!chartRegistered) {
      ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
      );
      chartRegistered = true;
    }
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const weightStats = useMemo(() => {
    if (weights.length === 0) return null;

    const sortedEntries = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstEntry = sortedEntries[0];
    const lastEntry = sortedEntries[sortedEntries.length - 1];

    const startWeight = firstEntry.weight;
    const currentWeight = lastEntry.weight;
    const weightChange = currentWeight - startWeight;
    const weightChangePercent = (weightChange / startWeight) * 100;

    let progressPercent = 0;
    if (targetWeight > 0) {
      if (startWeight > targetWeight) {
        const totalToLose = startWeight - targetWeight;
        const lost = startWeight - currentWeight;
        progressPercent = Math.min(100, Math.max(0, (lost / totalToLose) * 100));
      } else if (startWeight < targetWeight) {
        const totalToGain = targetWeight - startWeight;
        const gained = currentWeight - startWeight;
        progressPercent = Math.min(100, Math.max(0, (gained / totalToGain) * 100));
      } else {
        progressPercent = 100;
      }
    }

    return {
      startWeight,
      currentWeight,
      weightChange,
      weightChangePercent,
      progressPercent,
      entries: sortedEntries.length,
      isWeightLoss: startWeight > targetWeight,
    };
  }, [weights, targetWeight]);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();

    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) return;

    const dateISO = new Date(`${newDate}T12:00:00`).toISOString();

    addWeight(weightValue, newNote.trim() || undefined, dateISO);
    setNewWeight('');
    setNewNote('');
    setNewDate(new Date().toISOString().split('T')[0]);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this weight entry?')) {
      deleteWeight(id);
    }
  };

  const getPreviousEntry = (currentEntry: WeightEntry): WeightEntry | null => {
    if (weights.length <= 1) return null;

    const sortedEntries = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const currentIndex = sortedEntries.findIndex(entry => entry.id === currentEntry.id);
    if (currentIndex <= 0) return null;

    return sortedEntries[currentIndex - 1];
  };

  if (isLoading) {
    return <div className="py-8 text-center text-slate-400 font-mono">Loading weight data...</div>;
  }

  return (
    <div className="space-y-6">
      {weightStats && (
        <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl space-y-4 backdrop-blur-md">
          <div className="grid grid-cols-3 gap-3">
            <WeightStatCard label="Start" value={`${weightStats.startWeight} kg`} />
            <WeightStatCard label="Current" value={`${weightStats.currentWeight} kg`} accentClass="text-blue-400" />
            <WeightStatCard
              label="Change"
              value={`${weightStats.weightChange > 0 ? '+' : ''}${weightStats.weightChange.toFixed(1)} kg`}
              accentClass={
                weightStats.weightChange === 0
                  ? 'text-slate-300'
                  : weightStats.weightChange < 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
              }
            />
          </div>

          {targetWeight > 0 && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Target Progress</span>
                <span className="text-emerald-400 font-bold">
                  {weightStats.progressPercent.toFixed(0)}% ({Math.abs(targetWeight - weightStats.currentWeight).toFixed(1)} kg to go)
                </span>
              </div>
              <div className="bg-slate-950/80 rounded-full w-full h-3 p-0.5 border border-slate-800 overflow-hidden">
                <div
                  className="rounded-full h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 shadow-md shadow-emerald-500/20"
                  style={{ width: `${weightStats.progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Log weight entry form */}
      <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
        <h2 className="font-bold text-slate-100 text-base flex items-center gap-2">
          <span>⚖️</span> Log Weight Entry
        </h2>

        <form onSubmit={handleAddWeight} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="weight" className="block mb-1 font-semibold text-xs text-slate-300">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                placeholder="75.5"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 p-2.5 text-sm outline-none font-mono"
                step="0.1"
                min="0"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block mb-1 font-semibold text-xs text-slate-300">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 p-2.5 text-sm outline-none font-mono"
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label htmlFor="note" className="block mb-1 font-semibold text-xs text-slate-300">
                Note (optional)
              </label>
              <input
                type="text"
                id="note"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Post workout..."
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 p-2.5 text-sm outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span>Save Weight Entry</span>
          </button>
        </form>
      </div>

      {/* Chart visualization */}
      {chartData && (
        <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
          <h2 className="font-bold text-slate-100 text-base">Weight Progress Chart</h2>
          <div className="h-64 sm:h-80">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    grid: {
                      color: 'rgba(51, 65, 85, 0.4)',
                    },
                    ticks: {
                      color: '#94a3b8',
                      font: { family: 'monospace' },
                    },
                  },
                  x: {
                    grid: {
                      color: 'rgba(51, 65, 85, 0.4)',
                    },
                    ticks: {
                      color: '#94a3b8',
                      font: { family: 'monospace' },
                      maxRotation: 45,
                      minRotation: 45,
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: '#f8fafc',
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(51, 65, 85, 0.8)',
                    borderWidth: 1,
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* History table */}
      <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-slate-100 text-base">Weight Log History</h2>
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all"
          >
            {editMode ? 'Done' : 'Manage Log'}
          </button>
        </div>

        {weights.length === 0 ? (
          <p className="py-6 text-slate-400 text-sm text-center">No weight entries logged yet.</p>
        ) : (
          <div className="space-y-2.5">
            {[...weights]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry: WeightEntry) => {
                const prevEntry = getPreviousEntry(entry);
                const weightDiff = prevEntry ? entry.weight - prevEntry.weight : 0;

                return (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center font-bold text-slate-100 text-base font-mono">
                        <span>{entry.weight} kg</span>
                        {prevEntry && (
                          <span
                            className={`ml-2 text-xs flex items-center gap-0.5 px-2 py-0.5 rounded-full font-mono ${
                              weightDiff === 0
                                ? 'bg-slate-800 text-slate-400'
                                : weightDiff < 0
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {weightDiff > 0 ? '+' : ''}
                            {weightDiff.toFixed(1)} kg
                            {weightDiff !== 0 && (
                              <span>
                                {weightDiff < 0 ? (
                                  <FaChevronDown className="w-3 h-3" />
                                ) : (
                                  <FaChevronUp className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">{formatDate(entry.date)}</div>
                      {entry.note && <div className="mt-1 text-slate-300 text-xs italic">&quot;{entry.note}&quot;</div>}
                    </div>

                    {editMode && (
                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                        aria-label="Delete entry"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
