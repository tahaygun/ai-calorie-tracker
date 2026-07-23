import React from 'react';
import { FaBrain, FaGithub, FaInfoCircle, FaLock, FaWeight } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen text-slate-100 pb-12">
      <main className="mx-auto p-4 sm:p-6 max-w-3xl space-y-6">
        <div className="text-center space-y-2 py-4 border-b border-slate-800/80">
          <h1 className="font-extrabold text-3xl text-slate-100 flex items-center justify-center gap-3">
            <FaInfoCircle className="w-7 h-7 text-blue-400" />
            <span>About AI Calorie Tracker</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Free, open-source nutrition counter powered by OpenAI. Track calories and macros effortlessly without accounts or server tracking.
          </p>
        </div>

        {/* How It Works */}
        <section className="bg-slate-900/70 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
          <h2 className="font-bold text-lg text-blue-400 flex items-center gap-2">
            <FaBrain className="w-5 h-5" />
            <span>How It Works</span>
          </h2>
          <ol className="space-y-2.5 text-sm text-slate-300 list-decimal pl-5 leading-relaxed">
            <li>Type a description of your meal (e.g. &quot;2 scrambled eggs with toast and butter&quot;) or take a photo of your food. You can also combine text and image for even better accuracy.</li>
            <li>The app sends your prompt or compressed photo directly to OpenAI using your stored API key.</li>
            <li>OpenAI evaluates the input and calculates accurate nutritional estimates (calories, protein, carbs, fat, fiber, grams).</li>
            <li>Review and customize the portion sizes using serving multipliers, then save directly to your local history.</li>
          </ol>
        </section>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-2">
            <h3 className="font-bold text-base text-emerald-400 flex items-center gap-2">
              <FaLock className="w-4 h-4" />
              <span>100% Privacy-First</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your API key and meal data remain stored exclusively inside your browser&apos;s local storage. No central database, no accounts, and no tracking.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-2">
            <h3 className="font-bold text-base text-purple-400 flex items-center gap-2">
              <FaWeight className="w-4 h-4" />
              <span>Weight Progress Analytics</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track body weight changes alongside your daily nutrition intake with interactive charts, target lines, and progress percentages.
            </p>
          </div>
        </div>

        {/* Open Source Footer Card */}
        <section className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-xl text-center space-y-3">
          <h2 className="font-bold text-xl text-slate-100 flex items-center justify-center gap-2">
            <FaGithub className="w-5 h-5 text-blue-400" />
            <span>Open Source Project</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            This application is completely open-source. Contributions, feature requests, and code improvements are welcome on GitHub!
          </p>
          <a
            href="https://github.com/tahaygun/ai-calorie-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
          >
            <span>View GitHub Repository</span>
          </a>
        </section>
      </main>
    </div>
  );
}
