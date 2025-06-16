'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiActivity, FiCalendar, FiSettings, FiTrendingUp } from 'react-icons/fi';

export default function UsagePage() {
  const { user, userProfile } = useAuth();
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!usage || !userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Usage Dashboard</h1>
          <p className="mt-2 text-gray-600">Unable to load usage data</p>
        </div>
      </div>
    );
  }

  const usagePercentage = usage.monthlyLimit === -1 
    ? 0 
    : Math.min((usage.currentUsage / usage.monthlyLimit) * 100, 100);

  const getUsageColor = () => {
    if (usage.monthlyLimit === -1) return 'blue';
    if (usagePercentage >= 90) return 'red';
    if (usagePercentage >= 70) return 'yellow';
    return 'green';
  };

  const usageColor = getUsageColor();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Usage Dashboard</h1>
        <p className="mt-2 text-gray-600">Monitor your AI nutrition analysis usage and subscription details</p>
      </div>

      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FiSettings className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Plan</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{usage.subscription}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FiActivity className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usage This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {usage.currentUsage} / {usage.monthlyLimit === -1 ? '∞' : usage.monthlyLimit}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FiCalendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resets On</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Usage</h2>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>API Calls Used</span>
            <span>{usage.currentUsage} / {usage.monthlyLimit === -1 ? 'Unlimited' : usage.monthlyLimit}</span>
          </div>
          
          {usage.monthlyLimit !== -1 && (
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  usageColor === 'red' ? 'bg-red-500' :
                  usageColor === 'yellow' ? 'bg-yellow-500' :
                  usageColor === 'green' ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          )}
        </div>

        {usage.monthlyLimit !== -1 && (
          <div className="text-sm text-gray-600">
            {usagePercentage >= 90 && (
              <p className="text-red-600 font-medium">
                ⚠️ You're approaching your monthly limit. Consider upgrading your plan.
              </p>
            )}
            {usagePercentage >= 70 && usagePercentage < 90 && (
              <p className="text-yellow-600 font-medium">
                ⚡ You've used {Math.round(usagePercentage)}% of your monthly quota.
              </p>
            )}
            {usagePercentage < 70 && (
              <p className="text-green-600">
                ✅ You have plenty of usage remaining this month.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Subscription Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`font-medium capitalize ${
              usage.subscriptionStatus === 'active' ? 'text-green-600' :
              usage.subscriptionStatus === 'past_due' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {usage.subscriptionStatus}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Next Billing Date</p>
            <p className="font-medium text-gray-900">
              {usage.currentPeriodEnd ? new Date(usage.currentPeriodEnd).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/subscription"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors"
        >
          <FiTrendingUp className="inline h-5 w-5 mr-2" />
          Manage Subscription
        </Link>
        
        <button
          onClick={fetchUsage}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <FiActivity className="inline h-5 w-5 mr-2" />
          Refresh Usage
        </button>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-2">💡 Tips to Optimize Usage</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Batch similar food items in a single analysis</li>
          <li>• Use clear, descriptive meal descriptions for better accuracy</li>
          <li>• Review and edit results instead of re-analyzing</li>
          <li>• Save frequently used items as favorites</li>
        </ul>
      </div>
    </div>
  );
}
