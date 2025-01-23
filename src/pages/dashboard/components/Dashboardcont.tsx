import { PieChart, BarChart3 } from 'lucide-react';

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

export function DashboardCont({ nutritionSummary, recentMeals }: DashboardProps) {
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

      {/* Activity Chart */}
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
      </section>
    </>
  );
}