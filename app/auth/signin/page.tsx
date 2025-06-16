'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';

export default function SignInPage() {
  const { user, signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="flex justify-center items-center bg-gray-900 min-h-screen px-4">
      <div className="bg-gray-800 shadow-lg p-8 rounded-lg w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-2xl text-white">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your AI Calorie Tracker account</p>
        </div>

        {error && (
          <div className="bg-red-900/50 mb-4 p-3 border border-red-700 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-sm text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-gray-700 p-3 border border-gray-600 rounded w-full text-gray-100 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-sm text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-gray-700 p-3 border border-gray-600 rounded w-full text-gray-100 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 p-3 rounded w-full font-medium text-white transition-colors disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-gray-600 border-t"></div>
          <span className="mx-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 border-gray-600 border-t"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="flex justify-center items-center gap-3 bg-white hover:bg-gray-100 p-3 rounded w-full font-medium text-gray-900 transition-colors disabled:cursor-not-allowed"
          disabled={loading}
        >
          <FaGoogle className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}