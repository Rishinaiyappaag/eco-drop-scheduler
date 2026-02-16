from sklearn.cluster import KMeans
import numpy as np


def cluster_locations(locations, n_clusters=3):
    if len(locations) < 2:
        return None

    # If less points than clusters, reduce clusters
    n_clusters = min(n_clusters, len(locations))

    coords = np.array(locations)

    model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    model.fit(coords)

    return model.cluster_centers_, model.labels_
