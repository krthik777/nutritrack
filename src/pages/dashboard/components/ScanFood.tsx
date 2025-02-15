import { Camera, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';

export function ScanFood() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [calorieEstimation, setCalorieEstimation] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  // Upload file to backend
  const uploadFile = async (file: File | Blob) => {
    const form = new FormData();
    form.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/scanfood', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) {
        return { error: 'Error uploading file' };
      } else {
        return { url: response.data.url }; // URL returned by the backend
      }
    } catch (error) {
      console.error(error);
      return { error: 'Error uploading file' };
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setIsUploading(true);

        // Convert the file to a base64 string for preview
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64Image = event.target?.result as string;

          // Set the photo URL for preview
          setPhotoUrl(base64Image);

          // Upload the file to the backend (envs.sh)
          const uploadResponse = await uploadFile(file);

          if (uploadResponse.url) {
            // Estimate calories using the public URL
            await estimateCalories(uploadResponse.url);
          } else {
            console.error(uploadResponse.error);
          }
        };
        reader.readAsDataURL(file);

        setIsUploading(false);
      }
    }
  };

  // Handle camera photo capture
  const capturePhoto = async () => {
    if (cameraRef.current) {
      const imageSrc = cameraRef.current.getScreenshot();
      if (imageSrc) {
        setIsUploading(true);

        // Set the photo URL for preview
        setPhotoUrl(imageSrc);

        // Convert the base64 image to a Blob for upload
        const byteArray = new Uint8Array(atob(imageSrc.split(',')[1]).split('').map(char => char.charCodeAt(0)));
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        // Upload the Blob to the backend (envs.sh)
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        const uploadResponse = await uploadFile(file);

        if (uploadResponse.url) {
          // Estimate calories using the public URL
          await estimateCalories(uploadResponse.url);
        } else {
          console.error(uploadResponse.error);
        }

        setIsUploading(false);
      }
    }
  };

  // Estimate calories using Gemini API
  const estimateCalories = async (imageUrl: string) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
      // Ensure the image URL is valid
      if (!imageUrl.startsWith('https://')) {
        throw new Error('Invalid image URL');
      }
  
      // Send the image URL to Gemini within the text field
      alert(imageUrl);
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Imagine that you are a nutritionist with great knowledge of food items and their calorie values. Analyze this image: ${imageUrl} identify the food dish and return its calorie value and how much serving should be made in one meal as per the WHO standards. If it is not a food or if the image is not clear, return an error.`,
                },
              ],
            },
          ],
        }
      );
  
      // Extract the calorie estimation from the response
      const calorieText = response.data.candidates[0].content.parts[0].text;
      setCalorieEstimation(calorieText);
    } catch (error) {
      console.error('Error estimating calories', error);
      setCalorieEstimation('Error: Unable to estimate calories. Please try again.');
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
            {calorieEstimation && (
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Calorie Estimation</h4>
                <p className="text-gray-600">{calorieEstimation}</p>
              </div>
            )}
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