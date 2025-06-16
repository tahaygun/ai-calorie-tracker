/* eslint-disable react/no-unescaped-entities */
export default function AboutPage() {
  return (
    <div className="bg-gray-900 mx-auto px-4 py-8 max-w-4xl text-gray-100 container">
      <h1 className="mb-8 font-bold text-3xl text-center">About AI Calorie Tracker</h1>

      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">How It Works</h2>
        <div className="space-y-4">
          <p>
            AI Calorie Tracker uses advanced AI technology to analyze your meals and provide
            detailed nutritional information. Here's how the process works:
          </p>
          <ol className="space-y-2 pl-6 list-decimal">
            <li>
              Create your account and sign in securely using email/password or Google authentication
            </li>
            <li>
              Enter a description of your meal (e.g., "2 scrambled eggs with toast and butter")
              or upload a photo of your food
            </li>
            <li>
              The app sends this description or image to our secure AI analysis service
            </li>
            <li>The AI model analyzes the food items and estimates their nutritional content</li>
            <li>
              The results are displayed, showing calories, protein, carbs, fat, and other nutrients
            </li>
            <li>You can save the meal to your daily log or add it to favorites for future use</li>
          </ol>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">AI Model Selection</h2>
        <div className="space-y-4">
          <p>You can choose between different AI models for analysis:</p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>
              <strong>GPT-4o-mini</strong> - Recommended for most users - good balance of speed
              and accuracy
            </li>
            <li>
              <strong>GPT-4o</strong> - Latest model with excellent nutritional analysis
              capabilities
            </li>
            <li>
              <strong>GPT-4.1</strong> - Most accurate model for detailed analysis
            </li>
          </ul>
          <p className="text-gray-400 text-sm">
            Note: The accuracy of nutritional information depends on the model used and the detail
            provided in your meal description or image quality.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">Custom Analysis Prompts</h2>
        <div className="space-y-4">
          <p>Personalize how the AI analyzes your food:</p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Customize text analysis prompts to better match your eating habits</li>
            <li>Tailor image analysis prompts for improved photo recognition</li>
            <li>Custom prompts are included when you export your data</li>
            <li>Easily restore default prompts optimized for nutrition analysis</li>
            <li>Find these options in Settings under "AI Customization"</li>
          </ul>
          <p className="text-gray-400 text-sm">
            Tip: If you frequently eat regional foods or follow a special diet, customizing prompts
            can significantly improve analysis accuracy.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">Image Analysis</h2>
        <div className="space-y-4">
          <p>The app supports analyzing food images:</p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Upload photos of your meals for AI analysis</li>
            <li>Images are automatically compressed for faster processing</li>
            <li>For best results, ensure good lighting and clear visibility of all food items</li>
            <li>You can review and adjust the results before adding to your log</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">Weight Tracking</h2>
        <div className="space-y-4">
          <p>Track your weight progress alongside your nutrition:</p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Record your weight entries with optional notes</li>
            <li>Visualize your progress with an interactive chart</li>
            <li>Set target weight goals that display on your progress chart</li>
            <li>Enter weights for current or past dates</li>
            <li>Manage your weight history with edit and delete options</li>
            <li>All weight data is stored securely with your account</li>
          </ul>
          <p className="text-gray-400 text-sm">
            Tip: Consistent tracking at the same time of day (typically morning, after waking up)
            provides the most reliable progress data.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">Privacy & Security</h2>
        <div className="space-y-4">
          <p>Your privacy and security are our top priorities:</p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Secure authentication with Firebase (Google's trusted platform)</li>
            <li>All data is associated with your secure user account</li>
            <li>Meal data and images are processed securely through our AI service</li>
            <li>No third parties have access to your personal nutrition data</li>
            <li>You can export your data for backup or transfer between devices</li>
            <li>Account deletion removes all associated data permanently</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">Data Portability</h2>
        <div className="space-y-4">
          <p>Easily manage your nutrition data:</p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Export all your meal data, favorites, and settings</li>
            <li>Import data on new devices or after account changes</li>
            <li>All transfers happen securely with your authenticated account</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">Tips for Best Results</h2>
        <div className="space-y-4">
          <ul className="space-y-2 pl-6 list-disc">
            <li>Be specific with portions (e.g., "2 tablespoons" instead of "some")</li>
            <li>Include cooking methods when relevant</li>
            <li>Specify brands if you want more accurate results</li>
            <li>For images, take photos from above to show all items on the plate</li>
            <li>Use the favorites feature for frequently eaten meals</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-2xl">Open Source</h2>
        <p>
          This project is open source and available on{' '}
          <a
            href="https://github.com/tahaygun/ai-calorie-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            GitHub
          </a>
          . Contributions and feedback are welcome!
        </p>
      </section>
    </div>
  );
}