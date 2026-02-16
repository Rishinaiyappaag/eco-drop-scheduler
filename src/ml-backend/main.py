from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import train_model
from clustering import cluster_locations
from strategy_engine import generate_strategy

import numpy as np
import requests
from datetime import datetime, timedelta
import math
import random

print("🔥 MAIN FILE LOADED SUCCESSFULLY 🔥")

# ---------------------------------------------------
# ✅ CREATE APP (ONLY ONCE)
# ---------------------------------------------------
app = FastAPI()

# ---------------------------------------------------
# ✅ CORS
# ---------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# 🔹 SUPABASE CONFIG
# ---------------------------------------------------
SUPABASE_URL = "https://fgmboyzcapekhvpvsdlm.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnbWJveXpjYXBla2h2cHZzZGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTI5MzAsImV4cCI6MjA1OTE4ODkzMH0.j0_IBTtVpvKYQ0kSZr_YbPYnbIxphaN_n2sYFiYXaoM"


HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

# ---------------------------------------------------
# 🔹 1. PREDICT + CLUSTER
# ---------------------------------------------------
@app.get("/predict")
def predict():

    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/e_waste_requests?status=in.(pending,accepted)&select=pickup_time,latitude,longitude",
        headers=HEADERS,
    )

    if response.status_code != 200:
        return {"predicted_orders": -1}

    orders = response.json()

    if not orders:
        return {
            "predicted_orders": 0,
            "total_orders": 0,
            "cluster_count": 0,
            "cluster_centers": [],
        }

    # ---- Forecast logic
    grouped = {}

    for order in orders:
        raw_dt = order.get("pickup_time")
        if not raw_dt:
            continue

        try:
            dt = datetime.fromisoformat(raw_dt)
            date_str = dt.date().isoformat()
            grouped[date_str] = grouped.get(date_str, 0) + 1
        except:
            continue

    order_history = [
        {"date": date, "count": count}
        for date, count in sorted(grouped.items())
    ]

    model = train_model(order_history)

    if model is None or len(order_history) < 3:
        predicted_value = len(orders)
    else:
        future_days = np.array(
            [(datetime.today() + timedelta(days=i)).toordinal() for i in range(1, 8)]
        ).reshape(-1, 1)

        predictions = model.predict(future_days)
        predicted_value = max(int(np.mean(predictions)), len(orders))

    # ---- Clustering
    locations = [
        [float(o["latitude"]), float(o["longitude"])]
        for o in orders
        if o["latitude"] is not None and o["longitude"] is not None
    ]

    cluster_centers = []
    cluster_count = 0

    if len(locations) >= 2:
        n_clusters = min(3, len(locations))
        clusters = cluster_locations(locations, n_clusters=n_clusters)

        if clusters:
            centers, _ = clusters
            cluster_centers = centers.tolist()
            cluster_count = len(centers)

    return {
        "predicted_orders": predicted_value,
        "total_orders": len(orders),
        "cluster_count": cluster_count,
        "cluster_centers": cluster_centers,
    }


# ---------------------------------------------------
# 🔹 2. CARBON OPTIMIZER
# ---------------------------------------------------
@app.get("/optimize-carbon")
def optimize_carbon():

    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/e_waste_requests?status=in.(pending,accepted)&select=latitude,longitude",
        headers=HEADERS,
    )

    if response.status_code != 200:
        return {"error": "Failed to fetch locations"}

    orders = response.json()

    raw_locations = [
        (float(o["latitude"]), float(o["longitude"]))
        for o in orders
        if o["latitude"] is not None and o["longitude"] is not None
    ]

    if len(raw_locations) < 2:
        return {
            "total_pickups": len(raw_locations),
            "naive_distance_km": 0,
            "optimized_distance_km": 0,
            "naive_co2_kg": 0,
            "optimized_co2_kg": 0,
            "carbon_saved_kg": 0,
            "carbon_efficiency": 0,
            "locations": raw_locations,
        }

    locations = list(set(raw_locations))
    random.shuffle(locations)

    def haversine(lat1, lon1, lat2, lon2):
        R = 6371
        dLat = math.radians(lat2 - lat1)
        dLon = math.radians(lon2 - lon1)

        a = (
            math.sin(dLat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dLon / 2) ** 2
        )

        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Naive
    naive_distance = sum(
        haversine(*locations[i], *locations[i + 1])
        for i in range(len(locations) - 1)
    )

    # Optimized (Nearest Neighbor)
    unvisited = locations.copy()
    route = [unvisited.pop(0)]

    while unvisited:
        last = route[-1]
        nearest = min(
            unvisited,
            key=lambda x: haversine(last[0], last[1], x[0], x[1])
        )
        route.append(nearest)
        unvisited.remove(nearest)

    optimized_distance = sum(
        haversine(*route[i], *route[i + 1])
        for i in range(len(route) - 1)
    )

    emission_factor = 0.192

    naive_co2 = naive_distance * emission_factor
    optimized_co2 = optimized_distance * emission_factor

    carbon_saved = max(naive_co2 - optimized_co2, 0)

    carbon_efficiency = (
        (carbon_saved / naive_co2) * 100 if naive_co2 > 0 else 0
    )

    # ✅ Store history safely
    try:
        history_payload = {
        "date": datetime.today().date().isoformat(),
        "naive_distance_km": round(naive_distance, 2),
        "optimized_distance_km": round(optimized_distance, 2),
        "naive_co2_kg": round(naive_co2, 2),
        "optimized_co2_kg": round(optimized_co2, 2),
        "carbon_saved_kg": round(carbon_saved, 2),
        }
        history_headers = HEADERS.copy()
        history_headers["Prefer"] = "resolution=merge-duplicates"
        requests.post(
        f"{SUPABASE_URL}/rest/v1/carbon_history",
        headers=history_headers,
        json=history_payload,
     )

    except Exception as e:
     print("Carbon history save error:", e)


# ---------------------------------------------------
# 🔹 3. STRATEGY
# ---------------------------------------------------
@app.get("/strategy")
def strategy():
    try:
        predict_res = requests.get("http://127.0.0.1:8000/predict").json()
        carbon_res = requests.get("http://127.0.0.1:8000/optimize-carbon").json()

        predicted = predict_res.get("predicted_orders", 0)
        carbon_cost = carbon_res.get("naive_co2_kg", 0)

        strategy_text = generate_strategy(predicted, carbon_cost)

        return {"strategy": strategy_text}

    except Exception as e:
        return {
            "strategy": "Failed to generate strategy",
            "error": str(e)
        }


# ---------------------------------------------------
# 🔹 4. GEOCODE
# ---------------------------------------------------
OPENCAGE_KEY = "b4a2c313b6dc4e57900b4076c9b8636a"

@app.get("/geocode")
def geocode(address: str):

    try:
        full_address = f"{address}, Bangalore, Karnataka, India"

        url = "https://api.opencagedata.com/geocode/v1/json"
        params = {"q": full_address, "key": OPENCAGE_KEY, "limit": 1}

        response = requests.get(url, params=params)
        data = response.json()

        if data.get("results"):
            lat = data["results"][0]["geometry"]["lat"]
            lng = data["results"][0]["geometry"]["lng"]
            return {"latitude": lat, "longitude": lng}

        return {"latitude": None, "longitude": None}

    except:
        return {"latitude": None, "longitude": None}
