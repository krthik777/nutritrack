import { Camera, Upload } from 'lucide-react';

export function ScanFood() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Scan Your Food</h3>
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-medium text-gray-800 mb-2">Take a Photo</h4>
            <p className="text-gray-600 mb-4">Use your camera to capture your meal</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Open Camera
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-medium text-gray-800 mb-2">Upload Image</h4>
            <p className="text-gray-600 mb-4">Select a photo from your device</p>
            <label className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg inline-flex items-center gap-2 cursor-pointer hover:bg-gray-200">
              <Upload className="h-5 w-5" />
              Choose File
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-6">
        <h4 className="text-lg font-medium text-green-800 mb-2">How it works</h4>
        <p className="text-green-700">
          Our AI-powered food recognition system can identify foods and estimate portions
          from your photos. Simply take a clear photo of your meal, and we'll do the rest!
        </p>
      </div>
    </div>
  );
}