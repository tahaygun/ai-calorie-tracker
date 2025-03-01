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
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

// Instead of registering at module level, we'll register in an effect
// This ensures it only happens on client-side when component is mounted
let chartRegistered = false;

type WeightChartData = ChartData<'line', number[], string>;

export default function WeightTracker() {
  const { targetWeight } = useSettings();
  const { weights, addWeight, deleteWeight, isLoading } = useWeights();

  const [newWeight, setNewWeight] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  ); // Default to today's date in YYYY-MM-DD format
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

  // Prepare chart data
  useEffect(() => {
    if (isLoading) return;

    // Move sorting logic inside the effect instead of using getSortedWeights
    const sortedEntries = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ); // Oldest to newest for the chart

    if (sortedEntries.length === 0) return;

    const labels = sortedEntries.map((entry) => formatDate(entry.date));
    const weightData = sortedEntries.map((entry) => entry.weight);

    // Create target weight line if set
    const targetData = targetWeight
      ? Array(labels.length).fill(targetWeight)
      : [];

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

  if (isLoading) {
    return <div className='py-4 text-center'>Loading weight data...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='bg-gray-800 shadow-lg p-6 rounded-lg'>
        <h2 className='mb-4 font-semibold text-xl'>Track Your Weight</h2>

        <form onSubmit={handleAddWeight} className='space-y-4'>
          <div className='flex sm:flex-row flex-col gap-3'>
            <div className='flex-1'>
              <label
                htmlFor='weight'
                className='block mb-1 font-medium text-sm'
              >
                Weight (kg)
              </label>
              <input
                type='number'
                id='weight'
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder='Enter weight'
                className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
                step='0.1'
                min='0'
                required
              />
            </div>
            <div className='flex-1'>
              <label htmlFor='date' className='block mb-1 font-medium text-sm'>
                Date
              </label>
              <input
                type='date'
                id='date'
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
                max={new Date().toISOString().split('T')[0]} // Prevent future dates
                required
              />
            </div>
            <div className='flex-1'>
              <label htmlFor='note' className='block mb-1 font-medium text-sm'>
                Note (optional)
              </label>
              <input
                type='text'
                id='note'
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder='Add a note'
                className='bg-gray-700 p-2 border border-gray-600 rounded w-full text-gray-100'
              />
            </div>
          </div>
          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full text-sm transition-colors'
          >
            Add Weight Entry
          </button>
        </form>
      </div>

      {chartData && (
        <div className='bg-gray-800 shadow-lg p-6 rounded-lg'>
          <h2 className='mb-4 font-semibold text-xl'>Weight Progress</h2>
          <div className='h-64 sm:h-80'>
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
            <div className='mt-4 text-center'>
              <p className='text-gray-400 text-sm'>
                Target weight:{' '}
                <span className='font-semibold text-pink-400'>
                  {targetWeight} kg
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      <div className='bg-gray-800 shadow-lg p-6 rounded-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='font-semibold text-xl'>Weight History</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className='text-gray-300 hover:text-white text-sm'
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>

        {weights.length === 0 ? (
          <p className='py-4 text-gray-400 text-center'>
            No weight entries yet. Add your first entry above.
          </p>
        ) : (
          <div className='space-y-3'>
            {[...weights]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              ) // Sort by date, newest first
              .map((entry: WeightEntry) => (
                <div
                  key={entry.id}
                  className='flex justify-between items-center bg-gray-700 hover:bg-gray-650 p-3 rounded transition-colors'
                >
                  <div>
                    <div className='font-medium'>{entry.weight} kg</div>
                    <div className='text-gray-400 text-sm'>
                      {formatDate(entry.date)}
                    </div>
                    {entry.note && (
                      <div className='mt-1 text-gray-300 text-xs'>
                        {entry.note}
                      </div>
                    )}
                  </div>

                  {editMode && (
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className='text-red-400 hover:text-red-300 transition-colors'
                      aria-label='Delete entry'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='w-5 h-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
