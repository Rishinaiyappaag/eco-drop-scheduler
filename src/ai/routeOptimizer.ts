export interface Location {
  x: number;
  y: number;
}

export function calculateDistanceMatrix(locations: Location[]) {
  const matrix: number[][] = [];

  for (let i = 0; i < locations.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < locations.length; j++) {
      matrix[i][j] = Math.sqrt(
        Math.pow(locations[i].x - locations[j].x, 2) +
        Math.pow(locations[i].y - locations[j].y, 2)
      );
    }
  }

  return matrix;
}
