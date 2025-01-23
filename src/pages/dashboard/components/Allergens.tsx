import { AlertCircle, Search, Plus, X } from 'lucide-react';

export function Allergens() {
  const allergens = [
    { name: 'Peanuts', severity: 'High', notes: 'Avoid all tree nuts' },
    { name: 'Lactose', severity: 'Medium', notes: 'Small amounts ok' },
    { name: 'Gluten', severity: 'Low', notes: 'Mild sensitivity' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">My Allergens</h3>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Allergen
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search allergens..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          {allergens.map((allergen) => (
            <div key={allergen.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800">{allergen.name}</h4>
                  <p className="text-sm text-gray-600">{allergen.notes}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  allergen.severity === 'High' ? 'bg-red-100 text-red-800' :
                  allergen.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {allergen.severity}
                </span>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Allergens</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts',
            'Peanuts', 'Wheat', 'Soybeans', 'Sesame'
          ].map((item) => (
            <button
              key={item}
              className="p-3 border border-gray-200 rounded-lg text-left hover:border-green-500 hover:bg-green-50"
            >
              <span className="font-medium text-gray-800">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}