/* eslint-disable react/no-unescaped-entities */
export default function AboutPage() {
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-8 text-center'>About AI Calorie Tracker</h1>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>How It Works</h2>
        <div className='space-y-4'>
          <p>
            AI Calorie Tracker uses advanced AI technology to analyze your meals and provide detailed nutritional information. Here's how
            the process works:
          </p>
          <ol className='list-decimal pl-6 space-y-2'>
            <li>You enter a description of your meal (e.g., "2 scrambled eggs with toast and butter")</li>
            <li>The app sends this description to OpenAI's API using your provided API key</li>
            <li>The AI model analyzes the food items and estimates their nutritional content</li>
            <li>The results are displayed, showing calories, protein, carbs, fat, and other nutrients</li>
            <li>You can save the meal to your daily log or add it to favorites for future use</li>
          </ol>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>AI Model Selection</h2>
        <div className='space-y-4'>
          <p>You can choose between different OpenAI models for analysis:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>
              <strong>GPT-4</strong> - Most accurate but slower and more expensive
            </li>
            <li>
              <strong>GPT-3.5 Turbo</strong> - Good balance of accuracy and speed
            </li>
            <li>
              <strong>Custom Model</strong> - Use your own fine-tuned model or other OpenAI models
            </li>
          </ul>
          <p className='text-sm text-gray-400'>
            Note: The accuracy of nutritional information depends on the model used and the detail provided in your meal description.
          </p>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Privacy & Data Storage</h2>
        <div className='space-y-4'>
          <p>Your privacy is important to us:</p>
          <ul className='list-disc pl-6 space-y-2'>
            <li>All data is stored locally in your browser</li>
            <li>Your OpenAI API key is never sent to our servers</li>
            <li>Meal data is only sent directly to OpenAI for analysis</li>
            <li>No account or personal information is required</li>
          </ul>
        </div>
      </section>

      <section className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Tips for Best Results</h2>
        <div className='space-y-4'>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Be specific with portions (e.g., "2 tablespoons" instead of "some")</li>
            <li>Include cooking methods when relevant</li>
            <li>Specify brands if you want more accurate results</li>
            <li>Use the favorites feature for frequently eaten meals</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className='text-2xl font-semibold mb-4'>Open Source</h2>
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
