# AI Calorie Tracker

A free, open-source calorie tracking application powered by AI. Track your daily nutrition with advanced food analysis - no account needed!

![AI Calorie Tracker](public/icons/icon-512x512.png)

## 🌟 Features

- **AI-Powered Text Analysis**: Get instant nutritional information for any food or meal using OpenAI's advanced language models
- **Image Analysis**: Upload food photos for automatic analysis and nutritional breakdown
- **Enhanced Model Selection**: Choose from GPT-4o-mini (recommended), GPT-4o, GPT-3.5 Turbo, GPT-4, or use your own custom model
- **No Account Required**: Start tracking immediately - no sign-up, no hassle
- **Daily Summaries**: View your daily calorie and nutrition totals
- **Favorites System**: Save your frequently eaten meals for quick access
- **Data Portability**: Export and import your nutrition data for backup or transfer between devices
- **Debug Mode**: View token usage and detailed analysis information for technical users
- **PWA Support**: Install as a mobile app on any device
- **Offline Capable**: Continue using the app even without internet
- **Dark Theme**: Easy on the eyes with a modern dark interface
- **Local Storage**: All data stored locally on your device for privacy
- **Detailed About Page**: Learn how the app works and get tips for best results

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tahaygun/ai-calorie-tracker.git
cd ai-calorie-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 🔧 Technologies Used

- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **OpenAI API**: AI-powered food analysis with model selection
- **next-pwa**: Progressive Web App support
- **Local Storage**: Client-side data persistence

## 📱 PWA Features

- Installable on mobile devices
- Offline support
- Push notifications (coming soon)
- Background sync (coming soon)

## 🤖 AI Models

The app supports multiple OpenAI models:

- **GPT-4o-mini**: Recommended for most users - good balance of speed, cost and accuracy
- **GPT-4o**: Latest model with excellent nutritional analysis capabilities
- **GPT-3.5 Turbo**: Faster and less expensive option
- **GPT-4**: Original high-accuracy model
- **Custom Models**: Use your own fine-tuned models or other OpenAI models

You can change models in the Settings page, accessible from the main navigation.

## 📷 Image Analysis

The app now supports food image analysis:

1. Click the camera icon in the meal input form
2. Upload a photo of your food
3. The AI will analyze the image and identify food items
4. Review and adjust the nutritional information as needed
5. Add the meal to your daily log

Tips for best image analysis results:

- Ensure good lighting and clear visibility of all food items
- Take photos from above to show all items on the plate
- For packaged foods, consider including the nutrition label in the image
- Images are compressed automatically for faster upload and processing

## 💾 Data Portability

The app now features data import and export capabilities:

- **Export Data**: Back up all your meal data, favorites, and settings
- **Import Data**: Restore your data on a new device or after clearing your browser
- **Privacy-Focused**: All data transfers happen locally with no server involvement

Access these features from the Settings page under "Data Management".

## 🔍 Debug Mode

For technical users or troubleshooting:

- **Token Usage Tracking**: View prompt and completion tokens used for API calls
- **Detailed Response Information**: See how the AI interpreted your food descriptions
- **Performance Optimization**: Useful for minimizing API costs or identifying issues

Enable Debug Mode in the Settings page.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## 📝 License

This project is available under a dual-license model:

1. **GNU GPL v3 License** - For non-commercial use:

   - Free to use, modify, and distribute
   - Any modifications must be open-sourced
   - Perfect for personal use, educational purposes, and open-source projects

2. **Commercial License** - For business use:
   - Allows commercial use and integration
   - Keep modifications private
   - Priority support and updates
   - Contact [@tahaygun](https://github.com/tahaygun) for commercial licensing

For more details, see the [LICENSE](LICENSE) file.

## 🙏 Credits

- Created by [@tahaygun](https://github.com/tahaygun)
- Powered by [OpenAI](https://openai.com/)
- Built with [Next.js](https://nextjs.org/)

## 🔗 Links

- [Live Demo](https://ai-calorietracker.vercel.app)
- [GitHub Repository](https://github.com/tahaygun/ai-calorie-tracker)
- [Report Bug](https://github.com/tahaygun/ai-calorie-tracker/issues)
- [Request Feature](https://github.com/tahaygun/ai-calorie-tracker/issues)

## 📸 Screenshots

[Coming Soon]

---

Made with ❤️ by [@tahaygun](https://github.com/tahaygun)
