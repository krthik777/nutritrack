import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export function MealPlanner() {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Meal Calendar</h3>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="text-lg font-medium text-gray-800">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square border border-gray-200 rounded-lg p-2 hover:border-green-500 cursor-pointer"
            >
              <span className="text-sm text-gray-600">{i + 1}</span>
              {Math.random() > 0.7 && (
                <div className="mt-1 p-1 bg-green-100 rounded text-xs text-green-800">
                  Meal planned
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Quick Add Meal</h4>
          <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 flex items-center justify-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Meal
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Meals</h4>
          <div className="space-y-4">
            {[
              { name: 'Breakfast', time: '8:00 AM', calories: 450 },
              { name: 'Lunch', time: '12:30 PM', calories: 650 },
              { name: 'Dinner', time: '7:00 PM', calories: 550 },
            ].map((meal) => (
              <div key={meal.time} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-800">{meal.name}</h5>
                  <p className="text-sm text-gray-600">{meal.time}</p>
                </div>
                <span className="text-sm text-gray-600">{meal.calories} cal</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}