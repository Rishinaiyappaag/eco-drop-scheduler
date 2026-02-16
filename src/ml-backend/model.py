from sklearn.linear_model import LinearRegression
import numpy as np
from datetime import datetime

def train_model(order_history):

    if len(order_history) < 3:
        return None

    # Convert dates to ordinal numbers
    X = []
    y = []

    for entry in order_history:
        date_obj = datetime.strptime(entry["date"], "%Y-%m-%d")
        X.append(date_obj.toordinal())
        y.append(entry["count"])

    X = np.array(X).reshape(-1, 1)
    y = np.array(y)

    model = LinearRegression()
    model.fit(X, y)

    return model
