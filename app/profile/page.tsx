'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useState } from 'react';
import { FiCalendar, FiMail, FiShield, FiUser } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [targetCalories, setTargetCalories] = useState(userProfile?.targetCalories || 2000);
  const [targetWeight, setTargetWeight] = useState(userProfile?.targetWeight || 70);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!userProfile) return;
    
    setSaving(true);
    try {
      await updateUserProfile({
        displayName: displayName || undefined,
        targetCalories,
        targetWeight,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(userProfile?.displayName || '');
    setTargetCalories(userProfile?.targetCalories || 2000);
    setTargetWeight(userProfile?.targetWeight || 70);
    setIsEditing(false);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                <FiUser className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {userProfile.displayName || 'User'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiUser className="inline h-4 w-4 mr-1" />
                    Display Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your display name"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile.displayName || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiMail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <p className="text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">Email cannot be changed here</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiCalendar className="inline h-4 w-4 mr-1" />
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {userProfile.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Goals & Preferences */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Goals & Preferences</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Daily Calories
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={targetCalories}
                      onChange={(e) => setTargetCalories(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1000"
                      max="5000"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile.targetCalories} calories</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Weight (kg)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="30"
                      max="200"
                      step="0.1"
                    />
                  ) : (
                    <p className="text-gray-900">{userProfile.targetWeight} kg</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <FiShield className="inline h-5 w-5 mr-1" />
              Subscription Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="text-lg font-medium text-gray-900 capitalize">
                  {userProfile.subscription.tier}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-lg font-medium capitalize ${
                  userProfile.subscription.status === 'active' ? 'text-green-600' :
                  userProfile.subscription.status === 'past_due' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {userProfile.subscription.status}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">API Usage This Month</p>
                <p className="text-lg font-medium text-gray-900">
                  {userProfile.apiUsage.currentMonth}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
