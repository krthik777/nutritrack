import { PieChart, Newspaper, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Navigate } from "react-router-dom";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  time: string;
  timestamp: Date;
}

interface NewsArticle {
  url: string;
  urlToImage: string;
  title: string;
  description: string;
  source: {
    name: string;
  };
}

interface WeeklyNutrition {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function DashboardCont() {
  const [healthNews, setHealthNews] = useState<NewsArticle[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyNutrition[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    target: 2000,
  });

  useEffect(() => {
    const mail = localStorage.getItem("email");
    if (!mail) {
      window.location.href = "/login";
    }

    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://saurav.tech/NewsAPI/top-headlines/category/health/in.json"
        );
        const data = await response.json();
        setHealthNews(data.articles.slice(0, 3));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const fetchData = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) return;

        const url = import.meta.env.VITE_BACKEND_URL;
        const [mealsResponse, weeklyResponse] = await Promise.all([
          fetch(`${url}/api/foodlog?email=${email}`),
          fetch(`${url}/api/weeklycalo?email=${email}`),
        ]);

        if (!mealsResponse.ok || !weeklyResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const mealsData = await mealsResponse.json();
        const weeklyData = await weeklyResponse.json();

        const transformedMeals = mealsData.map((meal: any) => ({
          id: meal.id,
          name: meal.dishName,
          calories: Number(meal.calories) || 0,
          protein: Number(meal.protein) || 0,
          carbs: Number(meal.carbs) || 0,
          fat: Number(meal.fat) || 0,
          date: new Date(meal.timestamp).toLocaleDateString(),
          time: new Date(meal.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date(meal.timestamp),
        }));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysMeals = transformedMeals.filter((meal: { timestamp: string | number | Date; }) => {
          const mealDate = new Date(meal.timestamp);
          mealDate.setHours(0, 0, 0, 0);
          return mealDate.getTime() === today.getTime();
        });

        const summary = todaysMeals.reduce(
          (acc: any, meal: any) => ({
            calories: acc.calories + (Number(meal.calories) || 0),
            protein: acc.protein + (Number(meal.protein) || 0),
            carbs: acc.carbs + (Number(meal.carbs) || 0),
            fat: acc.fat + (Number(meal.fat) || 0),
            target: 2000,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0, target: 2000 }
        );

        // Update the state with this filtered summary
        setNutritionSummary({
          calories: summary.calories,
          protein: Math.round(summary.protein),
          carbs: Math.round(summary.carbs),
          fat: Math.round(summary.fat),
          target: 2000,
        });

        setMeals(transformedMeals);
        setWeeklyData(weeklyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNews();
    fetchData();
  }, []);

  const totalMacros =
    nutritionSummary.protein + nutritionSummary.carbs + nutritionSummary.fat;
  const macroDistribution = [
    {
      name: "Protein",
      value:
        totalMacros > 0 ? (nutritionSummary.protein / totalMacros) * 100 : 0,
      color: "#3B82F6", // Changed from #10B981 to more vibrant blue
    },
    {
      name: "Carbs",
      value: totalMacros > 0 ? (nutritionSummary.carbs / totalMacros) * 100 : 0,
      color: "#10B981", // Changed from #3B82F6 to teal green
    },
    {
      name: "Fat",
      value: totalMacros > 0 ? (nutritionSummary.fat / totalMacros) * 100 : 0,
      color: "#F59E0B",
    },
  ];

  const renderGraphModal = () => {
    if (!selectedGraph) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{selectedGraph} Details</h3>
            <button
              onClick={() => setSelectedGraph(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {selectedGraph === "Macronutrients" && (
            <div className="h-96">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {macroDistribution.map((macro) => (
                  <div key={macro.name} className="text-center">
                    <div
                      className="w-4 h-4 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: macro.color }}
                    />
                    <p className="font-medium">{macro.name}</p>
                    <p className="text-gray-600">{macro.value.toFixed(1)}%</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: `conic-gradient(
              ${macroDistribution
                .map((macro, i) => {
                  const start = macroDistribution
                    .slice(0, i)
                    .reduce((acc, m) => acc + m.value, 0);
                  return `${macro.color} ${start}% ${start + macro.value}%`;
                })
                .join(", ")})`,
                    }}
                  />
                  <div className="absolute inset-2 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          )}

          {selectedGraph === "Weekly Progress" && (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number) => [`${value} cal`, "Calories"]}
                  />
                  <Bar
                    dataKey="calories"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    name="Calories"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm">Daily Calories</h3>
            <PieChart className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-800">
              {nutritionSummary.calories}
            </span>
            <span className="text-gray-500 ml-2">
              / {nutritionSummary.target}
            </span>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${Math.min(
                  (nutritionSummary.calories / nutritionSummary.target) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {[
          { label: "Protein", value: nutritionSummary.protein, unit: "g" },
          { label: "Carbs", value: nutritionSummary.carbs, unit: "g" },
          { label: "Fat", value: nutritionSummary.fat, unit: "g" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-800">
              {stat.value}
              <span className="text-gray-500 text-sm ml-1">{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer hover:shadow-md"
          onClick={() => setSelectedGraph("Macronutrients")}
        >
          <h3 className="text-xl font-semibold mb-4">
            Macronutrient Distribution
          </h3>
          <div className="flex justify-center items-center h-48">
            <div className="relative w-32 h-32">
              {macroDistribution.map((macro, index) => (
                <div
                  key={macro.name}
                  className="absolute w-32 h-32 rounded-full border-8"
                  style={{
                    borderColor: macro.color,
                    transform: `rotate(${index * 120}deg)`,
                    clipPath: "inset(0 50% 0 0)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer hover:shadow-md"
          onClick={() => setSelectedGraph("Weekly Progress")}
        >
          <h3 className="text-xl font-semibold mb-4">Weekly Calorie Intake</h3>
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A7F3D0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.8} />
                  </linearGradient>
                </defs>

                <Bar
                  dataKey="calories"
                  fill="url(#miniGradient)"
                  radius={[4, 4, 0, 0]}
                  animationDuration={300}
                />

                <Tooltip
                  cursor={false}
                  content={({ active, payload }) =>
                    active && payload ? (
                      <div className="bg-white px-3 py-2 rounded-md shadow-sm text-sm border border-gray-100">
                        <p className="font-medium text-gray-700">
                          {payload[0].payload.day}: {payload[0].value} kcal
                        </p>
                      </div>
                    ) : null
                  }
                />

                <ReferenceLine
                  y={2000}
                  stroke="#EF4444"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  ifOverflow="extendDomain"
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Custom scale indicator */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center text-xs text-gray-400 px-2">
              <span>0</span>
              <span>2500 kcal</span>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Recent Meals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div key={meal.id} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800">{meal.name}</h4>
              <div className="space-y-1 mt-2">
                <p className="text-gray-600">{meal.calories} calories</p>
                <div className="flex gap-2 text-sm text-gray-600">
                  <span>🍗 {meal.protein}g</span>
                  <span>🍞 {meal.carbs}g</span>
                  <span>🥑 {meal.fat}g</span>
                </div>
                <p className="text-sm text-gray-500">
                  {meal.date} at {meal.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Latest Health News
          </h3>
          <Newspaper className="h-5 w-5 text-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {healthNews.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                  {article.description || "No description available"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {article.source.name}
                  </span>
                  <span className="text-blue-500 text-sm hover:underline">
                    Read more
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {renderGraphModal()}
    </>
  );
}
