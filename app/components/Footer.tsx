import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-3 border-gray-800 border-t w-full text-xs">
      <div className="mx-auto px-4 container">
        <div className="flex md:flex-row flex-col md:justify-between items-center space-y-2 md:space-y-0">
          <p className="text-gray-400 md:text-left text-center">
            Free AI-powered calorie and nutrition tracking - No account needed
          </p>
          <div className="flex items-center space-x-3">
            <Link
              href="https://github.com/tahaygun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Made by @tahaygun
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="https://github.com/tahaygun/ai-calorie-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Open Source
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
