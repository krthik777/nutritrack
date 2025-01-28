import { User, Mail, Phone, MapPin, Edit2 } from 'lucide-react';

export function Profile() {
  const profile = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    height: '5\'10"',
    weight: '160 lbs',
    goals: ['Lose weight', 'Build muscle', 'Improve energy'],
    dietaryPreferences: ['Vegetarian', 'Low-carb'],
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">{profile.name}</h3>
              <p className="text-gray-600">Premium Member</p>
            </div>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{profile.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Physical Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Height</p>
                <p className="text-lg font-medium text-gray-800">{profile.height}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Weight</p>
                <p className="text-lg font-medium text-gray-800">{profile.weight}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Health Goals</h4>
          <div className="space-y-2">
            {profile.goals.map((goal) => (
              <div key={goal} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-700">{goal}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Dietary Preferences</h4>
          <div className="flex flex-wrap gap-2">
            {profile.dietaryPreferences.map((pref) => (
              <span
                key={pref}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}