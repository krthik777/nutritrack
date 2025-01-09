import React, { useState } from 'react';
import '../App.css';
import '../index.css';

const Auth = () => {
  const [tab, setTab] = useState('login');

  return (
    <section
      id="auth"
      className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-xl shadow-md mx-auto">
        <div className="text-center mb-8">
          <img
            src="https://placehold.co/80x80?text=NT"
            alt="NutriTrack Logo"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome to NutriTrack</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your journey to better nutrition starts here
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-sm font-medium ${
                tab === 'login' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2 text-sm font-medium ${
                tab === 'register' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          {tab === 'login' && (
            <form className="space-y-6">
              <div>
                <label htmlFor="email-login" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email-login"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password-login"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <a href="#" className="text-sm font-medium text-gray-900 hover:text-gray-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Sign in
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form className="space-y-6">
              <div>
                <label htmlFor="name-register" className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <input
                  id="name-register"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label htmlFor="email-register" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email-register"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label htmlFor="password-register" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password-register"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  id="password-confirm"
                  name="password_confirmation"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-gray-900 hover:text-gray-700">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-gray-900 hover:text-gray-700">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Create account
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Auth;
