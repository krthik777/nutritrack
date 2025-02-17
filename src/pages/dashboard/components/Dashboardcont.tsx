import { PieChart, BarChart3, Newspaper, X } from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';

interface DashboardProps {
  nutritionSummary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    target: number;
  };
  recentMeals: Array<{
    name: string;
    calories: number;
    time: string;
    image: string;
  }>;
}

interface NewsArticle {
  image: string | undefined;
  date: ReactNode;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  source: {
    name: string;
  };
}

export function DashboardCont({ nutritionSummary, recentMeals }: DashboardProps) {
  const [healthNews, setHealthNews] = useState<NewsArticle[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://saurav.tech/NewsAPI/top-headlines/category/health/in.json'
        );
        const data = await response.json();
        setHealthNews(data.articles.slice(0, 3));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);
  // Visualization data
  const macroDistribution = [
    { name: 'Protein', value: nutritionSummary.protein, color: '#10B981' },
    { name: 'Carbs', value: nutritionSummary.carbs, color: '#3B82F6' },
    { name: 'Fat', value: nutritionSummary.fat, color: '#F59E0B' },
  ];

  const weeklyProgress = [
    { day: 'Mon', calories: 1800 },
    { day: 'Tue', calories: 2100 },
    { day: 'Wed', calories: 1950 },
    { day: 'Thu', calories: 2050 },
    { day: 'Fri', calories: 2200 },
    { day: 'Sat', calories: 2300 },
    { day: 'Sun', calories: 2000 },
  ];

  const renderGraphModal = () => {
    if (!selectedGraph) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {selectedGraph} Details
            </h3>
            <button 
              onClick={() => setSelectedGraph(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {selectedGraph === 'Macronutrients' && (
            <div className="h-96">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {macroDistribution.map((macro) => (
                  <div key={macro.name} className="text-center">
                    <div 
                      className="w-4 h-4 rounded-full mx-auto mb-2" 
                      style={{ backgroundColor: macro.color }}
                    />
                    <p className="font-medium">{macro.name}</p>
                    <p className="text-gray-600">{macro.value}g</p>
                  </div>
                ))}
              </div>
              <div className="relative w-full h-64">
                {macroDistribution.map((macro, index) => (
                  <div
                    key={macro.name}
                    className="absolute h-64 w-64 rounded-full border-8"
                    style={{
                      borderColor: macro.color,
                      transform: `rotate(${index * 120}deg)`,
                      clipPath: 'inset(0 50% 0 0)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedGraph === 'Weekly Progress' && (
            <div className="h-96">
              <div className="flex items-end h-64 gap-2 justify-between">
                {weeklyProgress.map((day) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-green-100 rounded-t-lg"
                      style={{ height: `${(day.calories / 2500) * 100}%` }}
                    >
                      <div
                        className="w-full bg-green-500 rounded-t-lg"
                        style={{ height: '100%' }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 mt-2">{day.day}</span>
                    <span className="text-xs text-gray-500">{day.calories}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm">Daily Calories</h3>
            <PieChart className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-800">{nutritionSummary.calories}</span>
            <span className="text-gray-500 ml-2">/ {nutritionSummary.target}</span>
          </div>
          <div className="mt-3 h-2 bg-gray-100 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${(nutritionSummary.calories / nutritionSummary.target) * 100}%` }}
            />
          </div>
        </div>

        {[
          { label: 'Protein', value: nutritionSummary.protein, unit: 'g' },
          { label: 'Carbs', value: nutritionSummary.carbs, unit: 'g' },
          { label: 'Fat', value: nutritionSummary.fat, unit: 'g' },
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

      {/* Visualization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div 
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer hover:shadow-md"
          onClick={() => setSelectedGraph('Macronutrients')}
        >
          <h3 className="text-xl font-semibold mb-4">Macronutrient Distribution</h3>
          <div className="flex justify-center items-center h-48">
            <div className="relative w-32 h-32">
              {macroDistribution.map((macro, index) => (
                <div
                  key={macro.name}
                  className="absolute w-32 h-32 rounded-full border-8"
                  style={{
                    borderColor: macro.color,
                    transform: `rotate(${index * 120}deg)`,
                    clipPath: 'inset(0 50% 0 0)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl shadow-sm cursor-pointer hover:shadow-md"
          onClick={() => setSelectedGraph('Weekly Progress')}
        >
          <h3 className="text-xl font-semibold mb-4">Weekly Calorie Intake</h3>
          <div className="flex items-end h-48 gap-2 justify-between">
            {weeklyProgress.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-100 rounded-t-lg"
                  style={{ height: `${(day.calories / 2500) * 100}%` }}
                >
                  <div
                    className="w-full bg-green-500 rounded-t-lg"
                    style={{ height: '100%' }}
                  />
                </div>
                <span className="text-sm text-gray-600 mt-2">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Meals */}
      <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Meals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentMeals.map((meal) => (
            <div key={meal.name} className="bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                <p className="text-gray-600">{meal.calories} calories</p>
                <p className="text-sm text-gray-500">{meal.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Chart
      <section className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Weekly Activity</h3>
          <BarChart3 className="h-5 w-5 text-green-500" />
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-green-100 rounded-t-lg"
                style={{ height: `${Math.random() * 100}%` }}
              >
                <div 
                  className="w-full bg-green-500 rounded-t-lg transition-all duration-300"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 mt-2">{day}</span>
            </div>
          ))}
        </div>
      </section> */}

       {/* Health News Section */}
       <section className="bg-white rounded-xl shadow-sm p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Latest Health News</h3>
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
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                  {article.description || 'No description available'}
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