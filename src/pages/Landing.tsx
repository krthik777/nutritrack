import React from 'react';
import {
  Camera,
  Bot,
  AlertCircle,
  Brain,
  Utensils,
  Leaf,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600 text-2xl font-bold">
              <Leaf className="h-8 w-8" />
              <span>NutriTrack</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                AI-Powered Nutrition Tracking for{' '}
                <span className="text-green-600">Better Health</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Transform your health journey with 99.9% accurate food recognition and instant nutritional insights. Just snap, track, and thrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/login"
                  className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
                </Link>
                <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition border border-gray-200 flex items-center justify-center">
                  Watch Demo
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80"
                alt="NutriTrack App"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Features for Your Health Journey
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to track your nutrition and maintain a healthy lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="h-6 w-6" />,
                title: "AI Image Recognition",
                description: "Instantly recognize any food with 99.9% accuracy and get detailed nutritional information."
              },
              {
                icon: <Brain className="h-6 w-6" />,
                title: "Smart Analysis",
                description: "Get personalized insights and recommendations based on your eating habits and goals."
              },
              {
                icon: <Bot className="h-6 w-6" />,
                title: "AI Health Coach",
                description: "24/7 guidance and support from our advanced AI coach to help you stay on track."
              },
              {
                icon: <AlertCircle className="h-6 w-6" />,
                title: "Allergen Detection",
                description: "Automatic alerts for allergens and ingredients you need to avoid."
              },
              {
                icon: <Utensils className="h-6 w-6" />,
                title: "Meal Planning",
                description: "Smart meal suggestions and planning based on your preferences and nutritional needs."
              },
              {
                icon: <Leaf className="h-6 w-6" />,
                title: "Health Tracking",
                description: "Comprehensive health metrics and progress tracking to reach your goals."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-green-50 p-6 rounded-xl hover:shadow-lg transition">
                <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Start Your Health Journey Today
          </h2>
          <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">
            Join thousands of users who have transformed their lifestyle with NutriTrack's
            AI-powered nutrition tracking.
          </p>
          <Link
            to="/login"
            className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600 text-xl font-bold">
              <Leaf className="h-6 w-6" />
              <span>NutriTrack</span>
            </div>
            <p className="text-gray-600">© 2024 NutriTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
