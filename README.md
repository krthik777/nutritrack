NutriTrack 🥗
AI-powered Nutrition Tracker — Capture meals via images, get calorie & nutrient estimates, and track your nutrition goals — all in a single React web app.

🚀 Project Overview
NutriTrack is a full-stack React application with an integrated backend API that leverages AI model gemini to recognize foods from images and provide detailed nutrition information. Users can log meals, monitor daily calorie and macronutrient intake, and visualize their nutritional progress over time — all from one intuitive web interface.

🧠 Key Features
📸 Image-based meal recognition: Upload meal photos, and NutriTrack detects food items using AI.

🍎 Calorie and macronutrient estimation for each logged meal.

🗓 Meal logging & history: Keep track of what you eat with timestamps and optional notes.

🎯 Personalized nutrition goals: Set daily calorie and macro targets, and monitor your progress.

📊 Interactive dashboards: Visualize your nutrient intake trends and goal achievement over days/weeks.

🔒 User authentication: Secure signup/login with session management.

♻️ Seamless React integration: Frontend and backend combined for smooth user experience.

📦 Tech Stack
Component	Technology
Frontend + Backend	React, Supabase(with integrated API routes)
AI/NLP	Integrated AI models for food recognition & nutrition estimation
Database	MongoDB (check project details)
Styling	CSS Modules Tailwind

⚙️ Installation & Setup
1. Clone the repository
bash
Copy
Edit
git clone https://github.com/krthik777/nutritrack.git
cd nutritrack
2. Install dependencies
bash
Copy
Edit
npm install
# or
yarn install
3. Setup environment variables
Create a .env file in the root directory with necessary API keys and config .



4. Start the development server
bash
Copy
Edit
npm start
# or
yarn start
The app will run on http://localhost:3000.

🧩 Usage Guide
Open the app in your browser.

Sign up or log in securely.

Upload an image of your meal.

View detected foods and their nutritional information.

Save the meal to your food diary.

Set or adjust your daily calorie and macronutrient goals.

Explore your nutrition dashboard with visual charts and history.

📁 Project Structure (High-Level)
bash
Copy
Edit
nutritrack/
├── public/                 # Static files (HTML, images, icons)
├── src/
│   ├── components/         # React UI components
│   ├── api/                # Integrated API handlers
│   ├── assets/             # Images, icons, CSS
│   ├── utils/              # Utility functions (e.g., nutrition calculations)
│   ├── App.js              # Main React app entry point
│   └── index.js            # React DOM rendering
├── .env                    # Environment variables
├── package.json            # Project metadata and dependencies
└── README.md               # ← This file
