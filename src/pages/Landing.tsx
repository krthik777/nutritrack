import React from 'react';
import { Link } from 'react-router-dom';
import { Salad, Brain, Battery, MessageSquare } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Salad className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">NutriTrack</span>
          </div>
          <div>
            <Link
              to="/login"
              className="px-6 py-2 text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              Smart Calorie Tracking for Better Health
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Advanced AI-powered food recognition for precise calorie estimation. Take control of your nutrition journey with NutriTrack.
            </p>
            <Link
              to="/login"
              className="px-8 py-3 text-lg text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors inline-block"
            >
              Start Your Journey
            </Link>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <img
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352"
              alt="Healthy Food"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-green-50 rounded-lg">
              <Brain className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Accurate calorie estimation through advanced image recognition technology.
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <Battery className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Health Monitoring</h3>
              <p className="text-gray-600">
                Track your nutritional intake and maintain a balanced diet effortlessly.
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <MessageSquare className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Health Assistant</h3>
              <p className="text-gray-600">
                Get personalized health advice and dietary recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;