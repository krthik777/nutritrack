import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Camera, Calendar, AlertCircle, MessageSquare, User, Settings, Apple, LogOut } from "lucide-react";
import { DashboardCont } from "./components/Dashboardcont";
import { ScanFood } from "./components/ScanFood";
import MealPlanner from "./components/MealPlanner";
import { Allergens } from "./components/Allergens";
import { AIChat } from "./components/AIChat";
import { Profile } from "./components/Profile";
import { Settings as SettingsPage } from "./components/Settings";
import { useAuthStore } from "../../store/authStore"; // Import the auth store

function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state to handle sidebar visibility
  const { signOut } = useAuthStore(); // Access the signOut function
  const navigate = useNavigate(); // Initialize useNavigate
  const [hasDetails, setHasDetails] = useState(false);

  const nutritionSummary = {
    calories: 1330,
    protein: 75,
    carbs: 160,
    fat: 45,
    target: 2000,
  };

  const recentMeals = [
    {
      name: "Breakfast",
      calories: 450,
      time: "8:30 AM",
      image:
        "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=300&h=200",
    },
    {
      name: "Lunch",
      calories: 680,
      time: "1:15 PM",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300&h=200",
    },
    {
      name: "Snack",
      calories: 200,
      time: "4:00 PM",
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=300&h=200",
    },
  ];

  const checkProfileDetails = async () => {
    try {
      const email = localStorage.getItem("email"); // Retrieve the email from localStorage
      if(!email) {
        navigate("/login"); // Redirect to login if email doesn't exist
      }
      const response = await fetch(`https://backend-production-d4c8.up.railway.app/api/hasdetails?email=${email}`);
      const result = await response.json();
      setHasDetails(result.exists);
      // if (!result.exists) {
      //   navigate("/profile"); // Redirect to profile if details don't exist
      // }
    } catch (error) {
      console.error("Failed to check profile details:", error);
    }
  };

  useEffect(() => {
    checkProfileDetails();
  }, []); 

  const renderContent = () => {
    if (!hasDetails) {
      return <Profile />;
    }

    switch (selectedTab) {
      case "dashboard":
        return (
          <DashboardCont
            nutritionSummary={nutritionSummary}
            recentMeals={recentMeals}
          />
        );
      case "scan":
        return <ScanFood />;
      case "planner":
        return <MealPlanner />;
      case "allergens":
        return <Allergens />;
      case "chat":
        return <AIChat />;
      case "profile":
        return <Profile />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <DashboardCont
            nutritionSummary={nutritionSummary}
            recentMeals={recentMeals}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Hamburger Button */}
      <div className="md:hidden flex items-center p-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white border-r border-gray-200 p-6 fixed inset-y-0 md:relative md:block transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-2 mb-8">
          <Apple className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">NutriTrack</h1>
        </div>

        {/* Close Button for Sidebar on Mobile */}
        <div className="md:hidden absolute top-4 right-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="space-y-2">
          {[
            { icon: BarChart3, label: "Dashboard", id: "dashboard" },
            { icon: Camera, label: "Scan Food", id: "scan" },
            { icon: Calendar, label: "Meal Planner", id: "planner" },
            { icon: AlertCircle, label: "Allergens", id: "allergens" },
            { icon: MessageSquare, label: "AI Chat", id: "chat" },
            { icon: User, label: "Profile", id: "profile" },
            { icon: Settings, label: "Settings", id: "settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg ${
                selectedTab === item.id
                  ? "bg-green-50 text-green-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          {/* Sign Out Button */}
          <div className="absolute bottom-6 w-full px-6">
            <button
              onClick={signOut}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          {/* <header className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome back, Alex!
            </h2>
            <p className="text-gray-600">
              Track your nutrition and stay healthy
            </p>
          </header> */}

          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
