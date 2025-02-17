import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Sun,
  Utensils,
  X,
  Plus,
  Check,
} from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from "date-fns";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface MealPlan {
  date: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  email: string;
}

function MealPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewingMeals, setIsViewingMeals] = useState(false);
  const [viewingDate, setViewingDate] = useState<Date | null>(null);
  const [meals, setMeals] = useState<
    Record<string, Omit<MealPlan, "date" | "email">>
  >({});
  const [newMeal, setNewMeal] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fetch meals from backend
  useEffect(() => {
    const fetchMeals = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        console.error("Email not found in localStorage");
        return;
      }

      try {
        const response = await axios.get<MealPlan[]>(
          "https://backend-production-d4c8.up.railway.app/api/mealPlanner",
          {
            params: { email },
          }
        );

        const mealsData = response.data.reduce(
          (acc, meal) => ({
            ...acc,
            [meal.date]: {
              breakfast: meal.breakfast,
              lunch: meal.lunch,
              dinner: meal.dinner,
            },
          }),
          {}
        );

        setMeals(mealsData);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  // Date calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navigation functions
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const handleDateClick = (date: Date) => {
    if (meals[formatDate(date)]) {
      setViewingDate(date);
      setIsViewingMeals(true);
    } else {
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const hasMeals = (date: string) => !!meals[date];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = localStorage.getItem("email");
    if (!email) {
      console.error("Email not found in localStorage");
      return;
    }

    const dateStr = formatDate(selectedDate);
    const mealData = {
      date: dateStr,
      email,
      ...newMeal,
    };

    try {
      await axios.post(
        "https://backend-production-d4c8.up.railway.app/api/mealPlanner",
        mealData
      );
      setMeals((prev) => ({
        ...prev,
        [dateStr]: newMeal,
      }));
      setNewMeal({ breakfast: "", lunch: "", dinner: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving meal:", error);
    }
  };

  const [mealBenefits, setMealBenefits] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const handleGenerateRecommendation = async () => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const dayOfWeek = format(selectedDate, "EEEE");
      const prompt = `
      Generate a healthy daily meal plan for ${dayOfWeek} with these requirements:
      1. Include breakfast, lunch, and dinner
      2. Each meal should have a short health benefit explanation (20-30 words)
      3. Focus on balanced nutrition
      4. Seasonal ingredients preferred
      5. Include vegetarian options
      6. Follow Indian Cuisine
      7. Provide only the meal name and health benefit
      
      Format response as JSON:
      {
        "breakfast": {
          "meal": "meal name",
          "benefit": "health benefit"
        },
        "lunch": {
          "meal": "meal name",
          "benefit": "health benefit"
        },
        "dinner": {
          "meal": "meal name",
          "benefit": "health benefit"
        }
      }
    `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const jsonResponse = JSON.parse(
        responseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim()
      );

      // Set meal names in the input fields
      setNewMeal({
        breakfast: jsonResponse.breakfast.meal,
        lunch: jsonResponse.lunch.meal,
        dinner: jsonResponse.dinner.meal,
      });

      // Set meal benefits below the input fields
      setMealBenefits({
        breakfast: jsonResponse.breakfast.benefit,
        lunch: jsonResponse.lunch.benefit,
        dinner: jsonResponse.dinner.benefit,
      });
    } catch (error) {
      console.error("Error generating recommendation:", error);
      alert("Could not generate meal plan. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add New Meal Button */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Meal Planner
          </h1>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Add New Meal
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg bg-opacity-90">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Calendar View
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <span className="text-lg font-medium text-gray-800">
                    {format(currentDate, "MMMM yyyy")}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-7 gap-4">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-600 py-2"
                  >
                    {day}
                  </div>
                ))}
                {daysInMonth.map((date, i) => {
                  const dateStr = formatDate(date);
                  return (
                    <div
                      key={i}
                      onClick={() => handleDateClick(date)}
                      className={`
                        aspect-square rounded-xl p-3 cursor-pointer relative group transition-all
                        ${!isSameMonth(date, currentDate) ? "opacity-50" : ""}
                        ${
                          isToday(date)
                            ? "bg-gradient-to-br from-emerald-50 to-teal-50"
                            : "bg-gray-50"
                        }
                        hover:bg-gradient-to-br hover:from-emerald-100 hover:to-teal-100 hover:shadow-md
                      `}
                    >
                      <span
                        className={`
                        text-sm font-medium
                        ${isToday(date) ? "text-emerald-600" : "text-gray-700"}
                      `}
                      >
                        {format(date, "d")}
                      </span>
                      {hasMeals(dateStr) && (
                        <div className="absolute right-2 bottom-2">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-1 rounded-full shadow-sm">
                            <Check className="h-3 w-3" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Today's Meals Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Today's Meals
            </h2>
            <div className="space-y-6">
              {meals[formatDate(new Date())] ? (
                <>
                  <div className="relative transform transition-all hover:scale-102">
                    <div className="absolute left-0 top-0 p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg shadow-sm">
                      <Coffee className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="pl-16">
                      <h3 className="text-lg font-medium text-gray-800">
                        Breakfast
                      </h3>
                      <p className="text-gray-600">
                        {meals[formatDate(new Date())].breakfast}
                      </p>
                    </div>
                  </div>
                  <div className="relative transform transition-all hover:scale-102">
                    <div className="absolute left-0 top-0 p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg shadow-sm">
                      <Sun className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="pl-16">
                      <h3 className="text-lg font-medium text-gray-800">
                        Lunch
                      </h3>
                      <p className="text-gray-600">
                        {meals[formatDate(new Date())].lunch}
                      </p>
                    </div>
                  </div>
                  <div className="relative transform transition-all hover:scale-102">
                    <div className="absolute left-0 top-0 p-2 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg shadow-sm">
                      <Utensils className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="pl-16">
                      <h3 className="text-lg font-medium text-gray-800">
                        Dinner
                      </h3>
                      <p className="text-gray-600">
                        {meals[formatDate(new Date())].dinner}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 shadow-sm">
                    <Utensils className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-gray-500">No meals planned for today</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Plan today's meals
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Meal Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Plan New Meals
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={formatDate(selectedDate)}
                      onChange={(e) =>
                        setSelectedDate(new Date(e.target.value))
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateRecommendation}
                      className="px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      AI Suggest
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Breakfast */}
                  <div className="relative">
                    <div className="absolute left-3 top-3 p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                      <Coffee className="h-5 w-5 text-amber-600" />
                    </div>
                    <input
                      type="text"
                      value={newMeal.breakfast}
                      onChange={(e) =>
                        setNewMeal((prev) => ({
                          ...prev,
                          breakfast: e.target.value,
                        }))
                      }
                      className="w-full pl-16 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Breakfast"
                    />
                    {mealBenefits.breakfast && (
                      <p className="text-sm text-gray-400 mt-1 pl-16">
                        {mealBenefits.breakfast}
                      </p>
                    )}
                  </div>

                  {/* Lunch */}
                  <div className="relative">
                    <div className="absolute left-3 top-3 p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
                      <Sun className="h-5 w-5 text-emerald-600" />
                    </div>
                    <input
                      type="text"
                      value={newMeal.lunch}
                      onChange={(e) =>
                        setNewMeal((prev) => ({
                          ...prev,
                          lunch: e.target.value,
                        }))
                      }
                      className="w-full pl-16 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Lunch"
                    />
                    {mealBenefits.lunch && (
                      <p className="text-sm text-gray-400 mt-1 pl-16">
                        {mealBenefits.lunch}
                      </p>
                    )}
                  </div>

                  {/* Dinner */}
                  <div className="relative">
                    <div className="absolute left-3 top-3 p-2 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg">
                      <Utensils className="h-5 w-5 text-indigo-600" />
                    </div>
                    <input
                      type="text"
                      value={newMeal.dinner}
                      onChange={(e) =>
                        setNewMeal((prev) => ({
                          ...prev,
                          dinner: e.target.value,
                        }))
                      }
                      className="w-full pl-16 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Dinner"
                    />
                    {mealBenefits.dinner && (
                      <p className="text-sm text-gray-400 mt-1 pl-16">
                        {mealBenefits.dinner}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Save Meals
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Meals Modal */}
        {isViewingMeals && viewingDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {format(viewingDate, "MMMM d, yyyy")}
                </h3>
                <button
                  onClick={() => setIsViewingMeals(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {meals[formatDate(viewingDate)] ? (
                  <>
                    <div className="relative transform transition-all hover:scale-102">
                      <div className="absolute left-0 top-0 p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg shadow-sm">
                        <Coffee className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="pl-16">
                        <h4 className="text-lg font-medium text-gray-800">
                          Breakfast
                        </h4>
                        <p className="text-gray-600">
                          {meals[formatDate(viewingDate)].breakfast}
                        </p>
                      </div>
                    </div>
                    <div className="relative transform transition-all hover:scale-102">
                      <div className="absolute left-0 top-0 p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg shadow-sm">
                        <Sun className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="pl-16">
                        <h4 className="text-lg font-medium text-gray-800">
                          Lunch
                        </h4>
                        <p className="text-gray-600">
                          {meals[formatDate(viewingDate)].lunch}
                        </p>
                      </div>
                    </div>
                    <div className="relative transform transition-all hover:scale-102">
                      <div className="absolute left-0 top-0 p-2 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg shadow-sm">
                        <Utensils className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="pl-16">
                        <h4 className="text-lg font-medium text-gray-800">
                          Dinner
                        </h4>
                        <p className="text-gray-600">
                          {meals[formatDate(viewingDate)].dinner}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-block p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 shadow-sm">
                      <Utensils className="h-6 w-6 text-gray-500" />
                    </div>
                    <p className="text-gray-500">
                      No meals planned for this date
                    </p>
                    <button
                      onClick={() => {
                        setIsViewingMeals(false);
                        setSelectedDate(viewingDate);
                        setIsModalOpen(true);
                      }}
                      className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Plan meals for this day
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsViewingMeals(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealPlanner;
