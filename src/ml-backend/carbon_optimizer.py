def calculate_emission(distance_km, load_kg, vehicle_type="diesel"):
    
    emission_factor = {
        "diesel": 2.68,   # kg CO2 per liter
        "petrol": 2.31,
        "electric": 0.5
    }

    fuel_efficiency = 15  # km per liter
    
    liters_used = distance_km / fuel_efficiency
    
    base_emission = liters_used * emission_factor.get(vehicle_type, 2.68)
    
    load_factor = 1 + (load_kg / 1000)

    return base_emission * load_factor
