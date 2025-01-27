import { Bell, Lock, Eye, Moon, Sun, Globe } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Notifications */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-gray-800" />
            <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              'Email notifications',
              'Push notifications',
              'Weekly report',
              'Monthly newsletter'
            ].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-gray-700">{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-gray-800" />
            <h3 className="text-xl font-semibold text-gray-800">Privacy</h3>
          </div>
          <div className="space-y-4">
            {[
              'Make profile private',
              'Hide activity status',
              'Block third-party tracking'
            ].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-gray-700">{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="h-6 w-6 text-gray-800" />
            <h3 className="text-xl font-semibold text-gray-800">Appearance</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700">Theme</p>
                <p className="text-sm text-gray-500">Choose your preferred theme</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button className="p-2 rounded bg-white shadow-sm">
                  <Sun className="h-5 w-5 text-gray-700" />
                </button>
                <button className="p-2 rounded hover:bg-white hover:shadow-sm">
                  <Moon className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Font Size</label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-gray-800" />
            <h3 className="text-xl font-semibold text-gray-800">Language</h3>
          </div>
          <div>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
}