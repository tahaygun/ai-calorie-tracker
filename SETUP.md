# Firebase & Stripe Setup Guide

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "ai-calorie-tracker")
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication
1. In Firebase Console, go to Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Enable "Google" (optional)

### 3. Create Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location close to your users

### 4. Get Firebase Config
1. Go to Project Settings (gear icon)
2. In "Your apps" section, click web icon
3. Register your app
4. Copy the config object

### 5. Generate Service Account Key
1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values for environment variables

## Environment Variables

Create `.env.local` file with these variables:

```env
# Firebase Config (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Stripe Setup

### 1. Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create account or sign in

### 2. Create Products and Prices
1. Go to Products in Stripe Dashboard
2. Create products for your subscription plans:

**Basic Plan:**
- Name: "Basic Plan"
- Price: $9.99/month
- Copy the price ID (starts with `price_`)

**Pro Plan:**
- Name: "Pro Plan"  
- Price: $19.99/month
- Copy the price ID (starts with `price_`)

### 3. Update Price IDs
Update the price IDs in:
- `app/subscription/page.tsx` (SUBSCRIPTION_PLANS array)
- `app/api/stripe/webhook/route.ts` (getPlanFromPriceId function)

### 4. Set up Webhook
1. Go to Webhooks in Stripe Dashboard
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select these events:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_failed
4. Copy the webhook secret

## Firestore Security Rules

Add these security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow access to user's subcollections
      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Testing

### 1. Test Authentication
1. Run the development server: `npm run dev`
2. Go to `/auth` and try signing up/in
3. Check Firebase Console → Authentication to see users

### 2. Test API Endpoints
1. Sign in to the app
2. Try adding a meal (should call OpenAI API)
3. Check Firestore to see data being saved

### 3. Test Stripe Integration
1. Use Stripe test cards: `4242424242424242`
2. Try subscribing to a plan
3. Check Stripe Dashboard for test payments

## Production Deployment

1. Update environment variables on your hosting platform
2. Update Stripe webhook URL to production domain
3. Switch Stripe to live mode
4. Update Firebase security rules if needed
5. Test the complete flow in production

## Troubleshooting

### Common Issues
1. **Firebase Auth not working**: Check API keys and domain configuration
2. **Stripe webhook failing**: Verify webhook secret and endpoint URL
3. **API calls failing**: Check OpenAI API key and rate limits
4. **Firestore permissions**: Verify security rules and authentication

### Debug Steps
1. Check browser console for errors
2. Check server logs for API errors  
3. Verify environment variables are set correctly
4. Test each service integration separately
