import { Camera, Upload, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { Circles, ThreeDots } from 'react-loader-spinner'; // Import the loading spinner

export function ScanFood() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [calorieEstimation, setCalorieEstimation] = useState<string | null>(null);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [allergenAlert, setAllergenAlert] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false); // State for capture button loading
  const cameraRef = useRef<any>(null);

  // Fetch allergens from the backend
  useEffect(() => {
    const fetchAllergens = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        console.error('Email not found in localStorage');
        return;
      }

      try {
        const BackendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${BackendUrl}/api/allergens`, {
          params: { email },
        });
        const userAllergens = response.data.map((allergen: { name: string }) =>
          allergen.name.toLowerCase().trim()
        );
        setAllergens(userAllergens);
      } catch (error) {
        console.error('Error fetching allergens:', error);
      }
    };

    fetchAllergens();
  }, []);

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
          setPhotoUrl(base64Image);
          await estimateCalories(file);
        };
        reader.readAsDataURL(file);

        setIsUploading(false);
      }
    }
  };

  // Handle camera photo capture
  const capturePhoto = async () => {
    if (cameraRef.current) {
      setIsCapturing(true); // Start loading
      const imageSrc = cameraRef.current.getScreenshot();
      if (imageSrc) {
        setIsUploading(true);
        setPhotoUrl(imageSrc);

        // Convert the base64 image to a Blob for upload
        const byteArray = new Uint8Array(atob(imageSrc.split(',')[1]).split('').map(char => char.charCodeAt(0)));
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        // Convert Blob to File
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

        // Estimate calories using the file
        await estimateCalories(file);

        setIsUploading(false);
      }
      setIsCapturing(false); // Stop loading
    }
  };

  // Estimate calories using Gemini API
  const estimateCalories = async (file: File) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Convert the file to a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result?.toString().split(',')[1];

        if (!base64Data) {
          throw new Error('Failed to convert file to base64.');
        }

        // Use the base64 image with the Gemini model
        const result = await model.generateContent([
          "You are a professional nutritionist. Analyze this food image and provide:\n1.Name of dish / food item \n2. Calorie estimate\n3. Main ingredients\n4. Recommended serving size according to WHO standards\n5. Healthiness score (1-10)\nFormat as a concise JSON object with keys: dish_name, calories, ingredients, serving_size, healthiness. If not food, return { error: 'Not a food image' }",
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
        ]);

        const responseText = result.response.text();
        const resultData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());

        if (resultData.error) {
          setCalorieEstimation(resultData.error);
          setAllergenAlert(null);
        } else {
          const estimation = `
            Dish Name: ${resultData.dish_name}
            Estimated Calories: ${resultData.calories}
            Ingredients: ${resultData.ingredients.join(', ')}
            Recommended Serving: ${resultData.serving_size}
            Healthiness Score: ${resultData.healthiness}/10
          `;
          setCalorieEstimation(estimation);

          // Enhanced allergen detection
          const ingredientsList = resultData.ingredients
            .map((ingredient: string) => ingredient.toLowerCase().trim())
            .join(', ');

          const detectedAllergens = allergens.filter(allergen => {
            const regex = new RegExp(`\\b${allergen}\\b`, 'i');
            return regex.test(ingredientsList);
          });

          if (detectedAllergens.length > 0) {
            setAllergenAlert(`⚠️ Allergy Warning: Contains ${detectedAllergens.join(', ')}`);
          } else {
            setAllergenAlert(null);
          }

          // Send the food details to the backend
          const email = localStorage.getItem('email');
          if (email) {
            const BackendUrl = import.meta.env.VITE_BACKEND_URL;
            await axios.post(`${BackendUrl}/api/foodLog`, {
              email,
              dishName: resultData.dish_name,
              calories: resultData.calories,
              ingredients: resultData.ingredients,
              servingSize: resultData.serving_size,
              healthiness: resultData.healthiness,
            });
          }
        }
      };
    } catch (error) {
      console.error('Error estimating calories', error);
      setCalorieEstimation('Error: Unable to analyze image. Please try again.');
      setAllergenAlert(null);
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
                  <button
                    onClick={capturePhoto}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
                    disabled={isCapturing}
                  >
                    {isCapturing ? (
                      <ThreeDots height="20" width="20" color="#ffffff" />
                    ) : (
                      'Capture Photo'
                    )}
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
                <p className="text-gray-600 whitespace-pre-line">{calorieEstimation}</p>
              </div>
            )}
            {allergenAlert && (
              <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">{allergenAlert}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {isUploading ? (
              <p>Uploading...<Circles/></p>
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