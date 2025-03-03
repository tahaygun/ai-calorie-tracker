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
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';

// Instead of registering at module level, we'll register in an effect
// This ensures it only happens on client-side when component is mounted
let chartRegistered = false;

type WeightChartData = ChartData<'line', number[], string>;

export default function WeightTracker() {
  const { targetWeight } = useSettings();
  const { weights, addWeight, deleteWeight, isLoading } = useWeights();

  const [newWeight, setNewWeight] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today's date in YYYY-MM-DD format
  const [editMode, setEditMode] = useState<boolean>(false);
  const [chartData, setChartData] = useState<WeightChartData | null>(null);

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

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Calculate weight statistics
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

    // Calculate progress towards target if target weight is set
    let progressPercent = 0;
    if (targetWeight > 0) {
      // Different calculation based on whether we're trying to lose or gain weight
      if (startWeight > targetWeight) {
        // Weight loss goal
        const totalToLose = startWeight - targetWeight;
        const lost = startWeight - currentWeight;
        progressPercent = Math.min(100, Math.max(0, (lost / totalToLose) * 100));
      } else if (startWeight < targetWeight) {
        // Weight gain goal
        const totalToGain = targetWeight - startWeight;
        const gained = currentWeight - startWeight;
        progressPercent = Math.min(100, Math.max(0, (gained / totalToGain) * 100));
      } else {
        // Already at target
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
      duration: Math.ceil(
        (new Date(lastEntry.date).getTime() - new Date(firstEntry.date).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    };
  }, [weights, targetWeight]);

  // Prepare chart data
  useEffect(() => {
    if (isLoading) return;

    // Move sorting logic inside the effect instead of using getSortedWeights
    const sortedEntries = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ); // Oldest to newest for the chart

    if (sortedEntries.length === 0) return;

    const labels = sortedEntries.map(entry => formatDate(entry.date));
    const weightData = sortedEntries.map(entry => entry.weight);

    // Create target weight line if set
    const targetData = targetWeight ? Array(labels.length).fill(targetWeight) : [];

    setChartData({
      labels,
      datasets: [
        {
          label: 'Weight',
          data: weightData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
        },
        ...(targetWeight
          ? [
              {
                label: 'Target',
                data: targetData,
                borderColor: 'rgba(255, 99, 132, 0.7)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderDash: [5, 5],
                pointRadius: 0,
              },
            ]
          : []),
      ],
    });
  }, [weights, targetWeight, isLoading]); // Removed getSortedWeights from dependencies

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();

    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) return;

    // Create ISO string from the date input (which is in YYYY-MM-DD format)
    // Set the time to noon to avoid timezone issues
    const dateISO = new Date(`${newDate}T12:00:00`).toISOString();

    addWeight(weightValue, newNote.trim() || undefined, dateISO);
    setNewWeight('');
    setNewNote('');
    // Reset date to today after submission
    setNewDate(new Date().toISOString().split('T')[0]);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this weight entry?')) {
      deleteWeight(id);
    }
  };

  // Helper function to get the previous weight entry for comparison
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
    return <div className="py-4 text-center">Loading weight data...</div>;
  }

  return (
    <div className="space-y-5">
      {weightStats && (
        <div className="bg-gray-800 shadow-lg p-4 rounded-lg">
          <div className="gap-2 grid grid-cols-3 mb-3">
            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400 text-xs">Start</div>
              <div className="font-bold text-base sm:text-lg">{weightStats.startWeight} kg</div>
            </div>

            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400 text-xs">Current</div>
              <div className="font-bold text-base sm:text-lg">{weightStats.currentWeight} kg</div>
            </div>

            <div className="bg-gray-700 p-2 rounded-lg text-center">
              <div className="text-gray-400 text-xs">Change</div>
              <div
                className={`font-bold text-base sm:text-lg flex items-center justify-center ${
                  weightStats.weightChange === 0
                    ? 'text-gray-300'
                    : weightStats.weightChange < 0
                      ? 'text-green-400'
                      : 'text-red-400'
                }`}
              >
                {weightStats.weightChange > 0 ? '+' : ''}
                {weightStats.weightChange.toFixed(1)}
                {weightStats.weightChange !== 0 && (
                  <span className="ml-1">
                    {weightStats.weightChange < 0 ? (
                      <FaChevronUp className="w-4 h-4" />
                    ) : (
                      <FaChevronDown className="w-4 h-4" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          {targetWeight > 0 && (
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="text-gray-400">
                  Progress: {weightStats.progressPercent.toFixed(0)}%
                </span>
                <span className="text-gray-400">
                  {Math.abs(targetWeight - weightStats.currentWeight).toFixed(1)} kg to go
                </span>
              </div>
              <div className="bg-gray-700 mb-1 rounded-full w-full h-2">
                <div
                  className="rounded-full h-2 transition-all duration-500"
                  style={{
                    width: `${weightStats.progressPercent}%`,
                    backgroundColor: weightStats.isWeightLoss ? '#4ade80' : '#8b5cf6',
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-gray-400 text-xs">
                <div>{weightStats.startWeight} kg</div>
                <div>{targetWeight} kg</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-800 shadow-lg p-6 rounded-lg">
        <h2 className="mb-4 font-semibold text-xl">Track Your Weight</h2>

        <form onSubmit={handleAddWeight} className="space-y-4">
          <div className="flex sm:flex-row flex-col gap-3">
            <div className="flex-1">
              <label htmlFor="weight" className="block mb-1 font-medium text-sm">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                placeholder="Enter weight"
                className="bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100"
                step="0.1"
                min="0"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="date" className="block mb-1 font-medium text-sm">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100"
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="note" className="block mb-1 font-medium text-sm">
                Note (optional)
              </label>
              <input
                type="text"
                id="note"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a note"
                className="bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full text-sm transition-colors"
          >
            Add Weight Entry
          </button>
        </form>
      </div>

      {chartData && (
        <div className="bg-gray-800 shadow-lg p-6 rounded-lg">
          <h2 className="mb-4 font-semibold text-xl">Weight Progress</h2>
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
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  },
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      maxRotation: 45,
                      minRotation: 45,
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                },
              }}
            />
          </div>

          {targetWeight > 0 && (
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Target weight:{' '}
                <span className="font-semibold text-pink-400">{targetWeight} kg</span>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-800 shadow-lg p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-xl">Weight History</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-gray-300 hover:text-white text-sm"
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>

        {weights.length === 0 ? (
          <p className="py-4 text-gray-400 text-center">
            No weight entries yet. Add your first entry above.
          </p>
        ) : (
          <div className="space-y-3">
            {[...weights]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
              .map((entry: WeightEntry) => {
                const prevEntry = getPreviousEntry(entry);
                const weightDiff = prevEntry ? entry.weight - prevEntry.weight : 0;

                return (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center bg-gray-700 hover:bg-gray-650 p-3 rounded transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center font-medium">
                        {entry.weight} kg
                        {prevEntry && (
                          <span
                            className={`ml-2 text-sm ${
                              weightDiff === 0
                                ? 'text-gray-400'
                                : weightDiff < 0
                                  ? 'text-green-400'
                                  : 'text-red-400'
                            }`}
                          >
                            {weightDiff > 0 ? '+' : ''}
                            {weightDiff.toFixed(1)} kg
                          </span>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">{formatDate(entry.date)}</div>
                      {entry.note && <div className="mt-1 text-gray-300 text-xs">{entry.note}</div>}
                    </div>

                    {editMode && (
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Delete entry"
                      >
                        <FaTrash className="w-5 h-5" />
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
