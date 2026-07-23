import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-950/80 backdrop-blur-md py-4 border-t border-slate-800/80 w-full text-xs mt-auto">
      <div className="mx-auto px-4 max-w-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-slate-400 text-center sm:text-left text-[11px]">
            Free AI Calorie Tracker • No account required
          </p>
          <div className="flex items-center space-x-3 text-[11px]">
            <Link
              href="https://github.com/tahaygun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Created by @tahaygun
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="https://github.com/tahaygun/ai-calorie-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              GitHub Source
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
