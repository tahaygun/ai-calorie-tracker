'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense } from 'react';

// Dynamically import the WeightTracker component
// This ensures Chart.js is only loaded when this page is visited
const DynamicWeightTracker = dynamic(() => import('../components/WeightTracker'), {
  loading: () => <div className="py-6 text-center">Loading weight tracker...</div>,
  ssr: false, // Disable server-side rendering for chart components
});

export default function WeightPage() {
  return (
    <div className="bg-gray-900 mx-auto px-4 py-6 max-w-4xl container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-2xl">Weight Tracker</h1>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      <Suspense fallback={<div className="py-6 text-center">Loading weight tracker...</div>}>
        <DynamicWeightTracker />
      </Suspense>
    </div>
  );
}
