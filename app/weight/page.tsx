'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const DynamicWeightTracker = dynamic(() => import('../components/WeightTracker'), {
  loading: () => <div className="py-12 text-center text-slate-400 font-mono">Loading weight tracker...</div>,
  ssr: false,
});

export default function WeightPage() {
  return (
    <div className="min-h-screen text-slate-100 pb-12">
      <main className="mx-auto p-4 sm:p-6 max-w-4xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
          <div>
            <h1 className="font-bold text-2xl text-slate-100">Weight Tracker</h1>
            <p className="text-xs text-slate-400">Log body weight entries and view progress trend analytics</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-all active:scale-[0.98]"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span>Dashboard</span>
          </Link>
        </div>

        <Suspense fallback={<div className="py-12 text-center text-slate-400 font-mono">Loading weight tracker...</div>}>
          <DynamicWeightTracker />
        </Suspense>
      </main>
    </div>
  );
}
