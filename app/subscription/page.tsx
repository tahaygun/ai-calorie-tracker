'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import stripePromise from '@/lib/stripe/client';
import { useEffect, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    priceId: null,
    features: [
      '10 AI analyses per month',
      'Basic nutrition tracking',
      'Weight tracking',
      'Meal history',
    ],
    limitations: [
      'Limited API calls',
      'No priority support',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$9.99',
    priceId: 'price_basic_monthly', // Replace with your actual Stripe price ID
    features: [
      '500 AI analyses per month',
      'All Free features',
      'Advanced nutrition insights',
      'Priority support',
      'Export data',
    ],
    limitations: [],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    priceId: 'price_pro_monthly', // Replace with your actual Stripe price ID
    features: [
      'Unlimited AI analyses',
      'All Basic features',
      'Custom AI prompts',
      'Premium support',
      'Early access to new features',
    ],
    limitations: [],
    popular: true,
  },
];

export default function SubscriptionPage() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [usage, setUsage] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUsage();
    }
  }, [user]);

  const fetchUsage = async () => {
    try {
      const token = await user!.getIdToken();
      const response = await fetch('/api/user/usage', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (!user) return;
    
    setLoading(priceId);
    
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    if (!user) return;
    
    setLoading('billing');
    
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error accessing billing portal:', error);
    } finally {
      setLoading(null);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentTier = userProfile.subscription.tier;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="mt-4 text-lg text-gray-600">
          Select the perfect plan for your nutrition tracking needs
        </p>
      </div>

      {/* Current Usage */}
      {usage && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Current Usage</h3>
          <div className="flex items-center justify-between">
            <span className="text-blue-700">
              API Calls This Month: {usage.currentUsage} / {usage.monthlyLimit === -1 ? 'Unlimited' : usage.monthlyLimit}
            </span>
            <span className="text-sm text-blue-600 capitalize">
              {usage.subscription} Plan
            </span>
          </div>
          {usage.monthlyLimit !== -1 && (
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min((usage.currentUsage / usage.monthlyLimit) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative rounded-lg border-2 ${
              plan.popular 
                ? 'border-blue-500 bg-blue-50' 
                : currentTier === plan.id 
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
            } p-6`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                  Popular
                </span>
              </div>
            )}
            
            {currentTier === plan.id && (
              <div className="absolute top-0 left-0 -translate-y-1/2 translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                  Current
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                {plan.price !== '$0' && <span className="text-gray-600">/month</span>}
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <FiCheck className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
              {plan.limitations.map((limitation, index) => (
                <li key={index} className="flex items-center">
                  <FiX className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-gray-500">{limitation}</span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              {currentTier === plan.id ? (
                <button
                  onClick={handleManageBilling}
                  disabled={loading === 'billing'}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {loading === 'billing' ? 'Loading...' : 'Manage Billing'}
                </button>
              ) : plan.priceId ? (
                <button
                  onClick={() => handleSubscribe(plan.priceId!)}
                  disabled={loading === plan.priceId}
                  className={`w-full font-medium py-2 px-4 rounded-lg disabled:opacity-50 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-900 text-white'
                  }`}
                >
                  {loading === plan.priceId ? 'Loading...' : `Upgrade to ${plan.name}`}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                >
                  Current Plan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ or Additional Info */}
      <div className="text-center text-gray-600">
        <p>All plans include access to our core nutrition tracking features.</p>
        <p className="mt-2">Need help choosing? Contact our support team for personalized recommendations.</p>
      </div>
    </div>
  );
}
