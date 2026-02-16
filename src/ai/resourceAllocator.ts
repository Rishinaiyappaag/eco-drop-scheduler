export function allocateVehicles(predictedWaste: number, peakFactor: number) {
  const adjusted = predictedWaste * peakFactor;

  if (adjusted < 50) return 1;
  if (adjusted < 120) return 2;
  return 3;
}
