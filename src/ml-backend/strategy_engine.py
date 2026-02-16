import ollama

def generate_strategy(predicted_demand, carbon_cost):
    try:
        prompt = f"""
        Predicted demand: {predicted_demand}
        Estimated carbon cost: {carbon_cost}

        Suggest optimal vehicle deployment strategy.
        Keep response short (5 bullet points max).
        """

        response = ollama.chat(
            model="phi3",
            messages=[{"role": "user", "content": prompt}],
            options={
                "num_predict": 150,
                "temperature": 0.3
            }
        )

        return response["message"]["content"]

    except Exception as e:
        print("🔥 OLLAMA ERROR:", str(e))
        return "Strategy engine failed."
