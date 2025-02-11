import { Camera, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam'; // Use ES6 import here

// This is the main ScanFood component
export function ScanFood() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraRef = useRef<any>(null);  // Ref to access camera component

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
          // Upload the file to envs.sh
          const response = await axios.post('https://envs.sh', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // envs.sh returns a URL for the uploaded file
          setPhotoUrl(response.data.url);
        } catch (error) {
          console.error('Error uploading file', error);
        } finally {
          setIsUploading(false);
        }
      }
    }
  };

  // Handle camera photo capture
  const capturePhoto = async () => {
    if (cameraRef.current) {
      const imageSrc = cameraRef.current.getScreenshot();
      if (imageSrc) {
        setIsUploading(true);
        
        // Convert the base64 image to a Blob before uploading
        const byteArray = new Uint8Array(atob(imageSrc.split(',')[1]).split('').map(char => char.charCodeAt(0)));
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        const formData = new FormData();
        formData.append('file', blob, 'image.jpg');

        try {
          // Send the captured photo to envs.sh
          const response = await axios.post('https://envs.sh', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // envs.sh returns a URL for the uploaded image
          setPhotoUrl(response.data.url);
        } catch (error) {
          console.error('Error uploading photo', error);
        } finally {
          setIsUploading(false);
        }
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Scan Your Food</h3>

        {/* Camera option for mobile view */}
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">

            {/* Camera UI for mobile */}
            <div className="block sm:hidden">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-gray-800 mb-2">Take a Photo</h4>
              <p className="text-gray-600 mb-4">Use your camera to capture your meal</p>
              {isCameraActive ? (
                <div>
                  <Webcam
                    ref={cameraRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={{
                      facingMode: 'environment',
                    }}
                  />
                  <button onClick={capturePhoto} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2">
                    Capture Photo
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsCameraActive(true)} className="bg-green-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Open Camera
                </button>
              )}
            </div>

            {/* Upload option for desktop */}
            <div className="hidden sm:block">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-gray-800 mb-2">Upload Image</h4>
              <p className="text-gray-600 mb-4">Select a photo from your device</p>
              <label className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg inline-flex items-center gap-2 cursor-pointer hover:bg-gray-200">
                <Upload className="h-5 w-5" />
                Choose File
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview and Upload Section */}
      <div className="bg-gray-50 rounded-xl shadow-sm p-6 mb-8">
        {photoUrl ? (
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Your Meal</h4>
            <img src={photoUrl} alt="Food" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {isUploading ? (
              <p>Uploading...</p>
            ) : (
              <p>No image uploaded or captured yet.</p>
            )}
          </div>
        )}
      </div>

      {/* How it works section */}
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
