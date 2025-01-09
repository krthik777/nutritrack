import React, { useState } from 'react';
import "./App.css";

const App = () => {
  const [tab, setTab] = useState('login');

  return (
    <section id="auth" className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Auth Container */}
        <div className="bg-white p-8 border border-neutral-200/20 rounded-xl">
          <div className="text-center mb-8">
            <img
              src="https://placehold.co/80x80?text=NT"
              alt="NutriTrack Logo"
              className="mx-auto h-12 w-auto"
            />
            <h2 className="mt-6 text-3xl font-bold text-neutral-900">Welcome to NutriTrack</h2>
            <p className="mt-2 text-sm text-neutral-600">Your journey to better nutrition starts here</p>
          </div>

          {/* Auth Tabs */}
          <div className="space-y-8">
            <div className="flex border-b border-neutral-200/20">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-2 text-sm font-medium text-neutral-900 hover:text-neutral-700 ${
                  tab === 'login' ? 'border-b-2 border-neutral-900' : ''
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-2 text-sm font-medium text-neutral-900 hover:text-neutral-700 ${
                  tab === 'register' ? 'border-b-2 border-neutral-900' : ''
                }`}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {tab === 'login' && (
              <form className="space-y-6">
                <div>
                  <label htmlFor="email-login" className="block text-sm font-medium text-neutral-700">
                    Email address
                  </label>
                  <input
                    id="email-login"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-neutral-200/20 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label htmlFor="password-login" className="block text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <input
                    id="password-login"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-neutral-200/20 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-neutral-900 rounded border-neutral-200/20 focus:ring-neutral-900"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                      Remember me
                    </label>
                  </div>

                  <a href="#" className="text-sm font-medium text-neutral-900 hover:text-neutral-700">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
                  onClick={() => (window.location.href = '/dashboard.html')}
                >
                  Sign in
                </button>
              </form>
            )}

            {/* Register Form */}
            {tab === 'register' && (
              <form className="space-y-6">
                <div>
                  <label htmlFor="name-register" className="block text-sm font-medium text-neutral-700">
                    Full name
                  </label>
                  <input
                    id="name-register"
                    name="name"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-neutral-200/20 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label htmlFor="email-register" className="block text-sm font-medium text-neutral-700">
                    Email address
                  </label>
                  <input
                    id="email-register"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-neutral-200/20 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label htmlFor="password-register" className="block text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <input
                    id="password-register"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-neutral-200/20 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label htmlFor="password-confirm" className="block text-sm font-medium text-neutral-700">
                    Confirm password
                  </label>
                  <input
                    id="password-confirm"
                    name="password_confirmation"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-neutral-200/20 rounded-lg text-sm focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-neutral-900 rounded border-neutral-200/20 focus:ring-neutral-900"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
                    I agree to the{' '}
                    <a href="#" className="font-medium text-neutral-900 hover:text-neutral-700">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-medium text-neutral-900 hover:text-neutral-700">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
                >
                  Create account
                </button>
              </form>
            )}
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-600">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-neutral-200/20 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                Google
              </button>

              <button className="w-full flex items-center justify-center px-4 py-2 border border-neutral-200/20 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
