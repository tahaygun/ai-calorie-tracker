# AI Calorie Tracker

A secure, AI-powered calorie tracking application with user authentication. Track your daily nutrition with advanced food analysis using your personal account.

![AI Calorie Tracker](public/icons/icon-512x512.png)

## 🌟 Features

- **Secure User Authentication**: Sign up with email/password or Google authentication via Firebase
- **AI-Powered Analysis**: Get instant nutritional information for any food or meal using advanced AI models
- **Image Analysis**: Upload food photos for automatic analysis and nutritional breakdown
- **Weight Tracking**: Monitor your weight progress with interactive charts and target weight goals
- **Personal Data**: All your data is securely stored with your user account
- **Enhanced Model Selection**: Choose from GPT-4o-mini (recommended), GPT-4o, or GPT-4.1
- **Customizable Analysis Prompts**: Tailor the text and image analysis prompts to improve results
- **Chronological Meal Display**: View your meals in chronological order with newest entries at the top
- **Daily Summaries**: View your daily calorie and nutrition totals
- **Favorites System**: Save your frequently eaten meals for quick access
- **Data Portability**: Export and import your nutrition data for backup or transfer
- **Debug Mode**: View detailed analysis information for technical users
- **PWA Support**: Install as a mobile app on any device
- **Dark Theme**: Easy on the eyes with a modern dark interface
- **Secure Cloud Storage**: All data associated with your authenticated account

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Authentication enabled
- OpenAI API key

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

3. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your Firebase and OpenAI credentials:

```bash
cp .env.example .env.local
```

4. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password and Google providers
   - Generate a service account key for Firebase Admin SDK
   - Add your configuration to `.env.local`

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 🔧 Technologies Used

- **Next.js 15**: React framework for production
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **Firebase**: Authentication and user management
- **OpenAI API**: AI-powered food analysis (server-side)
- **next-pwa**: Progressive Web App support
- **Local Storage**: Client-side data persistence (user-specific)

## 🔐 Authentication & Security

- **Firebase Authentication**: Secure user management with email/password and Google sign-in
- **Server-side API**: OpenAI API key is stored securely on the server
- **User-specific Data**: All data is isolated per user account
- **Token Verification**: All API requests are authenticated with Firebase tokens
- **Data Privacy**: No user data is shared between accounts

## 📱 PWA Features

- Installable on mobile devices
- Offline support for cached data
- Secure authentication persistence

## 🤖 AI Models

The app supports multiple OpenAI models:

- **GPT-4o-mini**: Recommended for most users - good balance of speed and accuracy
- **GPT-4o**: Latest model with excellent nutritional analysis capabilities
- **GPT-4.1**: Most accurate model for detailed analysis

You can change models in the Settings page after signing in.

## 🧠 Custom Analysis Prompts

The app supports customizable analysis prompts:

- **Text Analysis Prompt**: Customize how the AI interprets your text descriptions
- **Image Analysis Prompt**: Tailor the AI's approach to analyzing food images
- **Prompt Export/Import**: Your custom prompts are included in data export/import
- **Default Restoration**: Easily reset to the app's optimized default prompts

Customize these in the Settings page under "AI Customization".

## 📷 Image Analysis

The app supports food image analysis:

1. Sign in to your account
2. Click the camera icon in the meal input form
3. Upload a photo of your food
4. The AI will analyze the image and identify food items
5. Review and adjust the nutritional information as needed
6. Add the meal to your daily log

Tips for best image analysis results:

- Ensure good lighting and clear visibility of all food items
- Take photos from above to show all items on the plate
- For packaged foods, consider including the nutrition label in the image
- Images are compressed automatically for faster upload and processing

## ⚖️ Weight Tracking

Track your weight progress with the built-in weight tracker:

- **Visual Progress**: See your weight journey with an interactive chart
- **Target Weight**: Set and visualize target weight goals
- **Detailed History**: View and manage all your weight entries
- **Date Selection**: Record weights for specific dates
- **Add Notes**: Include optional notes with each weight entry
- **Secure Storage**: Weight data is stored securely with your account

Access the weight tracker from the navigation menu after signing in.

## 💾 Data Portability

The app features secure data import and export capabilities:

- **Export Data**: Back up all your meal data, favorites, and settings
- **Import Data**: Restore your data on a new device or after account changes
- **Account-based**: All data transfers are associated with your authenticated account

Access these features from the Settings page under "Data Management".

## 🔍 Debug Mode

For technical users or troubleshooting:

- **Token Usage Tracking**: View prompt and completion tokens used for API calls
- **Detailed Response Information**: See how the AI interpreted your food descriptions
- **Performance Optimization**: Useful for understanding API usage

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
- Authentication by [Firebase](https://firebase.google.com/)
- Built with [Next.js](https://nextjs.org/)

## 🔗 Links

- [Live Demo](https://ai-calorietracker.vercel.app)
- [GitHub Repository](https://github.com/tahaygun/ai-calorie-tracker)
- [Report Bug](https://github.com/tahaygun/ai-calorie-tracker/issues)
- [Request Feature](https://github.com/tahaygun/ai-calorie-tracker/issues)

---

Made with ❤️ by [@tahaygun](https://github.com/tahaygun)