import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-4 mt-1 text-center bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-4">
            <Link
              href="https://github.com/tahaygun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Made by @tahaygun
            </Link>
            <span className="text-gray-500">•</span>
            <Link
              href="https://github.com/tahaygun/ai-calorie-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Open Source
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            Free AI-powered calorie and nutrition tracking - No account needed
          </p>
        </div>
      </div>
    </footer>
  );
}
