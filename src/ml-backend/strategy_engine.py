def generate_strategy(predicted_demand, carbon_cost):
    try:
        import ollama
        prompt = f"""
        Predicted demand: {predicted_demand}
        Estimated carbon cost: {carbon_cost}

        Suggest optimal vehicle deployment strategy.
        Keep response short (5 bullet points max).
        """
        response = ollama.chat(
            model="phi3",
            messages=[{"role": "user", "content": prompt}],
            options={"num_predict": 150, "temperature": 0.3}
        )
        return response["message"]["content"]
    except Exception:
        pass

    # Rule-based fallback when Ollama is not available
    return _rule_based_strategy(predicted_demand, carbon_cost)


def _rule_based_strategy(predicted_demand, carbon_cost):
    vehicles = max(1, round(predicted_demand / 8))
    efficiency_tip = (
        "High carbon cost detected — prioritize route clustering and batch pickups."
        if carbon_cost > 5
        else "Carbon cost is low — current routes are efficient."
    )

    demand_tier = (
        "High demand" if predicted_demand > 20
        else "Moderate demand" if predicted_demand > 10
        else "Low demand"
    )

    return f"""AI Strategy Recommendation:

• {demand_tier} forecast: {predicted_demand} orders predicted for the next cycle.
• Deploy approximately {vehicles} vehicle(s) to handle the expected load.
• {efficiency_tip}
• Focus pickup clusters in high-density hotspot zones to reduce travel distance.
• Schedule morning pickups (8–11 AM) to avoid peak traffic and reduce idle emissions.
"""
