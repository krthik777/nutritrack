import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Camera, Calendar, AlertCircle, MessageSquare, User, LogOut, Leaf } from "lucide-react";
import { DashboardCont } from "./components/Dashboardcont";
import { ScanFood } from "./components/ScanFood";
import MealPlanner from "./components/MealPlanner";
import { Allergens } from "./components/Allergens";
import { AIChat } from "./components/AIChat";
import { Profile } from "./components/Profile";
import { useAuthStore } from "../../store/authStore";

function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const [hasDetails, setHasDetails] = useState(false);

  const handleSignout = () => {
    localStorage.removeItem("email"); // Clear email from localStorage
    signOut(); // Call signOut from the auth store
    navigate("/login"); // Redirect to login
  };

  const checkProfileDetails = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) {
        navigate("/login"); // Redirect to login if email is not found
        return;
      }
      const BackendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BackendUrl}/api/hasdetails?email=${email}`);
      const result = await response.json();
      setHasDetails(result.exists);
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
        return <DashboardCont />;
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
      default:
        return <DashboardCont />;
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
          <Leaf className="h-8 w-8 fill-green-500" />
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
              onClick={handleSignout}
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
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;