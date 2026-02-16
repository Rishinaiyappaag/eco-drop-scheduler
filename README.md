# 🚀 Eco Drop Scheduler (AI-Powered)

## 📘 Project Overview

Eco Drop Scheduler is a full-stack AI-powered web application designed to manage e-waste collection scheduling efficiently and intelligently.

It allows users to schedule pickups and enables administrators to optimize operations using Artificial Intelligence.

### 🔥 Key AI Capabilities
- 📈 Demand Prediction
- 📍 Pickup Hotspot Clustering
- 🚛 AI Route Optimization
- 🌱 Carbon Emission Optimization
- 🧠 LLM-Based Strategy Recommendations

This system combines a modern React frontend with a FastAPI-based AI backend.

---

# 🔗 Repository

https://github.com/Rishinaiyappaag/eco-drop-scheduler.git

---

# 🧩 Tech Stack

## 🌐 Frontend

- ⚡ Vite – Fast build tool
- ⚛️ React – UI library
- 🧠 TypeScript – Type safety
- 🎨 Tailwind CSS – Styling
- 🧱 shadcn-ui – UI components
- 🗺️ Leaflet – Interactive maps
- 📊 Recharts – Data visualization
- 🗃️ Supabase – Database & Auth

---

## 🤖 Backend / AI

- 🐍 FastAPI – Python backend
- 📊 Custom ML Model – Demand prediction
- 📍 K-Means Clustering – Hotspot detection
- 🚛 Nearest Neighbor Algorithm – Route optimization
- 🌱 Carbon Emission Calculator
- 🧠 Ollama + LLaMA3 – AI strategy engine
- 🌍 OpenCage API – Geocoding

---

# 🧠 AI Features Explained

## 1️⃣ Demand Prediction
Forecasts upcoming pickup demand based on historical data.

## 2️⃣ AI Hotspot Clustering
Groups nearby pickup locations to detect high-demand zones.

## 3️⃣ Route Optimization
Optimizes pickup routes to:
- Reduce travel distance
- Reduce CO₂ emissions
- Improve operational efficiency

## 4️⃣ Carbon Savings Tracker
Calculates:
- Naive route emissions
- Optimized route emissions
- Carbon saved (kg)
- Efficiency percentage

Stores daily results in `carbon_history` table.

## 5️⃣ AI Strategy Generator
Uses LLaMA3 (via Ollama) to generate:
- Vehicle deployment strategy
- Emission reduction suggestions
- Operational improvements

---

# 🏗️ System Architecture

Frontend (React + Vite)
        ↓
FastAPI AI Backend
        ↓
Supabase Database

---

# 🛠️ Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Rishinaiyappaag/eco-drop-scheduler.git
cd eco-drop-scheduler


🔹 Frontend Setup
Install Dependencies
npm install

Create .env File
Create a .env file in root:
VITE_BACKEND_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

Run Frontend
npm run dev

App runs at:
http://localhost:5173/


🔹 Backend Setup (AI Engine)
Navigate to backend:
cd src/ml-backend

Create Virtual Environment
python -m venv venv

Activate:
Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

Install Requirements
pip install -r requirements.txt

Run Backend
uvicorn main:app --reload

Backend runs at:
http://127.0.0.1:8000

Swagger Docs:
http://127.0.0.1:8000/docs


🗃️ Database Tables (Supabase)
e_waste_requests
Stores pickup data:


address


latitude


longitude


pickup_time


status


carbon_history
Stores carbon optimization data:


date


naive_distance_km


optimized_distance_km


naive_co2_kg


optimized_co2_kg


carbon_saved_kg



📁 Project Structure
├── src/
│   ├── ai/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── CarbonTrendChart.tsx
│   │   │   ├── HotspotMap.tsx
│   │   │   └── RouteOptimizerMap.tsx
│   ├── hooks/
│   ├── pages/
│   └── integrations/
│
├── src/ml-backend/
│   ├── main.py
│   ├── model.py
│   ├── clustering.py
│   ├── carbon_optimizer.py
│   ├── strategy_engine.py
│   └── requirements.txt
│
├── public/
├── package.json
└── README.md


💡 Useful Commands
Frontend:
npm run dev
npm run build
npm run preview
npm run lint

Backend:
uvicorn main:app --reload


🌍 API Endpoints
EndpointDescription/predictDemand forecasting + clustering/optimize-carbonRoute + carbon optimization/strategyAI deployment strategy/geocodeAddress → Latitude/Longitude

📊 Admin Dashboard Features


Real-time order stats


AI demand forecast


Carbon savings trend


Hotspot cluster map


Optimized route map


AI strategy recommendation



🔐 Security Notes


.env is excluded from Git


Never push API keys


Keep Supabase credentials secure






## 👨‍💻 Author
Rishin Aiyappa
AI & ML Engineer | Full Stack Developer

