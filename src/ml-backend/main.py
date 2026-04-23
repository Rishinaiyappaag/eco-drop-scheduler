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
    # Use ALL non-cancelled orders for demand prediction (historical data)
    all_response = requests.get(
        f"{SUPABASE_URL}/rest/v1/e_waste_requests?status=not.eq.cancelled&select=pickup_time,latitude,longitude,status",
        headers=HEADERS,
    )

    if all_response.status_code != 200:
        return {"predicted_orders": -1}

    all_orders = all_response.json()

    if not all_orders:
        return {
            "predicted_orders": 0,
            "total_orders": 0,
            "cluster_count": 0,
            "cluster_centers": [],
        }

    # ---- Forecast using full history
    grouped = {}
    for order in all_orders:
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
        predicted_value = len(all_orders)
    else:
        future_days = np.array(
            [(datetime.today() + timedelta(days=i)).toordinal() for i in range(1, 8)]
        ).reshape(-1, 1)
        predictions = model.predict(future_days)
        predicted_value = max(int(np.mean(predictions)), len(all_orders))

    # ---- Clustering on ACTIVE orders only (pending/accepted)
    # Completed/cancelled orders are excluded so maps reset when orders are done
    active_response = requests.get(
        f"{SUPABASE_URL}/rest/v1/e_waste_requests?status=in.(pending,accepted)&select=latitude,longitude",
        headers=HEADERS,
    )
    active_orders = active_response.json() if active_response.status_code == 200 else []

    active_locations = [
        [float(o["latitude"]), float(o["longitude"])]
        for o in active_orders
        if o.get("latitude") is not None and o.get("longitude") is not None
        and 12.7 <= float(o["latitude"]) <= 13.2
        and 77.3 <= float(o["longitude"]) <= 77.8
    ]

    cluster_centers = []
    cluster_labels = []
    cluster_count = 0

    if len(active_locations) >= 2:
        n_clusters = min(3, len(active_locations))
        clusters = cluster_locations(active_locations, n_clusters=n_clusters)
        if clusters:
            centers, labels = clusters
            cluster_centers = centers.tolist()
            cluster_labels = labels.tolist()
            cluster_count = len(centers)

    return {
        "predicted_orders": predicted_value,
        "total_orders": len(all_orders),
        "cluster_count": cluster_count,
        "cluster_centers": cluster_centers,
        "cluster_points": active_locations,
        "cluster_labels": cluster_labels,
    }


# ---------------------------------------------------
# 🔹 2. CARBON OPTIMIZER
# ---------------------------------------------------
@app.get("/optimize-carbon")
def optimize_carbon():
    # Only route active (pending/accepted) pickups — these are today's workload
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/e_waste_requests?status=in.(pending,accepted)&select=latitude,longitude",
        headers=HEADERS,
    )

    if response.status_code != 200:
        return {"error": "Failed to fetch locations"}

    orders = response.json()

    # Filter to valid Bangalore-area coordinates only (lat 12.7–13.2, lon 77.3–77.8)
    raw_locations = [
        (float(o["latitude"]), float(o["longitude"]))
        for o in orders
        if o["latitude"] is not None and o["longitude"] is not None
        and 12.7 <= float(o["latitude"]) <= 13.2
        and 77.3 <= float(o["longitude"]) <= 77.8
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

    locations = list(raw_locations)

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

    def route_distance(r):
        return sum(haversine(*r[i], *r[i + 1]) for i in range(len(r) - 1))

    # Naive = original submission order (unoptimized)
    naive_distance = route_distance(locations)

    # For ≤ 8 stops: brute-force all permutations for true shortest route
    # For > 8 stops: nearest-neighbor heuristic
    from itertools import permutations as _perms

    if len(locations) <= 8:
        best_route = locations
        best_dist = naive_distance
        start = locations[0]
        for perm in _perms(locations[1:]):
            candidate = [start] + list(perm)
            d = route_distance(candidate)
            if d < best_dist:
                best_dist = d
                best_route = candidate
        route = best_route
        optimized_distance = best_dist
    else:
        unvisited = locations.copy()
        route = [unvisited.pop(0)]
        while unvisited:
            last = route[-1]
            nearest = min(unvisited, key=lambda x: haversine(last[0], last[1], x[0], x[1]))
            route.append(nearest)
            unvisited.remove(nearest)
        optimized_distance = route_distance(route)

    emission_factor = 0.192

    naive_co2 = naive_distance * emission_factor
    optimized_co2 = optimized_distance * emission_factor

    carbon_saved = max(naive_co2 - optimized_co2, 0)

    carbon_efficiency = (
        (carbon_saved / naive_co2) * 100 if naive_co2 > 0 else 0
    )

    # Store history
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

    return {
        "total_pickups": len(raw_locations),
        "naive_distance_km": round(naive_distance, 2),
        "optimized_distance_km": round(optimized_distance, 2),
        "naive_co2_kg": round(naive_co2, 2),
        "optimized_co2_kg": round(optimized_co2, 2),
        "carbon_saved_kg": round(carbon_saved, 2),
        "carbon_efficiency": round(carbon_efficiency, 2),
        "locations": [list(loc) for loc in route],
    }


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

def geocode_opencage(full_address: str):
    try:
        url = "https://api.opencagedata.com/geocode/v1/json"
        params = {"q": full_address, "key": OPENCAGE_KEY, "limit": 1}
        response = requests.get(url, params=params, timeout=5)
        data = response.json()
        if data.get("results"):
            lat = data["results"][0]["geometry"]["lat"]
            lng = data["results"][0]["geometry"]["lng"]
            return {"latitude": lat, "longitude": lng}
    except Exception as e:
        print(f"OpenCage error: {e}")
    return None

def geocode_nominatim(full_address: str):
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": full_address, "format": "json", "limit": 1}
        headers = {"User-Agent": "EcoDrop/1.0 (rishinaiyappa@skypoint.ai)"}
        response = requests.get(url, params=params, headers=headers, timeout=5)
        data = response.json()
        if data:
            return {"latitude": float(data[0]["lat"]), "longitude": float(data[0]["lon"])}
    except Exception as e:
        print(f"Nominatim error: {e}")
    return None

@app.get("/geocode")
def geocode(address: str):
    lower = address.lower()
    already_has_city = any(x in lower for x in ["bangalore", "bengaluru", "karnataka"])
    full_address = address if already_has_city else f"{address}, Bangalore, Karnataka, India"

    result = geocode_opencage(full_address)
    if result:
        return result

    # Fallback to Nominatim (OpenStreetMap) — free, no key needed
    result = geocode_nominatim(full_address)
    if result:
        return result

    return {"latitude": None, "longitude": None}
