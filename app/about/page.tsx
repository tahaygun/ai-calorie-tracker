/* eslint-disable react/no-unescaped-entities */
export default function AboutPage() {
  return (
    <div className='bg-gray-900 mx-auto px-4 py-8 max-w-4xl text-gray-100 container'>
      <h1 className='mb-8 font-bold text-3xl text-center'>
        About AI Calorie Tracker
      </h1>

      <section className='mb-8'>
        <h2 className='mb-4 font-semibold text-2xl'>How It Works</h2>
        <div className='space-y-4'>
          <p>
            AI Calorie Tracker uses advanced AI technology to analyze your meals
            and provide detailed nutritional information. Here's how the process
            works:
          </p>
          <ol className='space-y-2 pl-6 list-decimal'>
            <li>
              You enter a description of your meal (e.g., "2 scrambled eggs with
              toast and butter") or upload a photo of your food
            </li>
            <li>
              The app sends this description or image to OpenAI's API using your
              provided API key
            </li>
            <li>
              The AI model analyzes the food items and estimates their
              nutritional content
            </li>
            <li>
              The results are displayed, showing calories, protein, carbs, fat,
              and other nutrients
            </li>
            <li>
              You can save the meal to your daily log or add it to favorites for
              future use
            </li>
          </ol>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='mb-4 font-semibold text-2xl'>AI Model Selection</h2>
        <div className='space-y-4'>
          <p>You can choose between different OpenAI models for analysis:</p>
          <ul className='space-y-2 pl-6 list-disc'>
            <li>
              <strong>GPT-4o-mini</strong> - Recommended for most users - good
              balance of speed, cost and accuracy
            </li>
            <li>
              <strong>GPT-4o</strong> - Latest model with excellent nutritional
              analysis capabilities
            </li>
            <li>
              <strong>GPT-3.5 Turbo</strong> - Faster and less expensive option
            </li>
            <li>
              <strong>GPT-4</strong> - Original high-accuracy model
            </li>
            <li>
              <strong>Custom Model</strong> - Use your own fine-tuned model or
              other OpenAI models
            </li>
          </ul>
          <p className='text-gray-400 text-sm'>
            Note: The accuracy of nutritional information depends on the model
            used and the detail provided in your meal description or image
            quality.
          </p>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='mb-4 font-semibold text-2xl'>Image Analysis</h2>
        <div className='space-y-4'>
          <p>The app now supports analyzing food images:</p>
          <ul className='space-y-2 pl-6 list-disc'>
            <li>Upload photos of your meals for AI analysis</li>
            <li>Images are automatically compressed for faster processing</li>
            <li>
              For best results, ensure good lighting and clear visibility of all
              food items
            </li>
            <li>
              You can review and adjust the results before adding to your log
            </li>
          </ul>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='mb-4 font-semibold text-2xl'>Weight Tracking</h2>
        <div className='space-y-4'>
          <p>Track your weight progress alongside your nutrition:</p>
          <ul className='space-y-2 pl-6 list-disc'>
            <li>Record your weight entries with optional notes</li>
            <li>Visualize your progress with an interactive chart</li>
            <li>Set target weight goals that display on your progress chart</li>
            <li>Enter weights for current or past dates</li>
            <li>Manage your weight history with edit and delete options</li>
            <li>All weight data is stored locally with your nutrition data</li>
          </ul>
          <p className='text-gray-400 text-sm'>
            Tip: Consistent tracking at the same time of day (typically morning,
            after waking up) provides the most reliable progress data.
          </p>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='mb-4 font-semibold text-2xl'>Privacy & Data Storage</h2>
        <div className='space-y-4'>
          <p>Your privacy is important to us:</p>
          <ul className='space-y-2 pl-6 list-disc'>
            <li>All data is stored locally in your browser</li>
            <li>Your OpenAI API key is never sent to our servers</li>
            <li>
              Meal data and images are only sent directly to OpenAI for analysis
            </li>
            <li>No account or personal information is required</li>
            <li>
              You can export your data for backup or transfer between devices
            </li>
          </ul>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='mb-4 font-semibold text-2xl'>Data Portability</h2>
        <div className='space-y-4'>
          <p>Easily manage your nutrition data:</p>
          <ul className='space-y-2 pl-6 list-disc'>
            <li>Export all your meal data, favorites, and settings</li>
            <li>Import data on new devices or after clearing browser data</li>
            <li>All transfers happen locally with no server involvement</li>
          </ul>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='mb-4 font-semibold text-2xl'>Tips for Best Results</h2>
        <div className='space-y-4'>
          <ul className='space-y-2 pl-6 list-disc'>
            <li>
              Be specific with portions (e.g., "2 tablespoons" instead of
              "some")
            </li>
            <li>Include cooking methods when relevant</li>
            <li>Specify brands if you want more accurate results</li>
            <li>
              For images, take photos from above to show all items on the plate
            </li>
            <li>Use the favorites feature for frequently eaten meals</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className='mb-4 font-semibold text-2xl'>Open Source</h2>
        <p>
          This project is open source and available on{' '}
          <a
            href='https://github.com/tahaygun/ai-calorie-tracker'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-400 hover:text-blue-300 transition-colors'
          >
            GitHub
          </a>
          . Contributions and feedback are welcome!
        </p>
      </section>
    </div>
  );
}
