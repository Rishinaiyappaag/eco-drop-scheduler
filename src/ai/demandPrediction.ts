export function weightedMovingAverage(data: number[]) {
  const weights = [0.5, 0.3, 0.2]; // recent bias
  if (data.length < 3) return 0;

  const recent = data.slice(-3);
  return Math.round(
    recent[2] * weights[0] +
    recent[1] * weights[1] +
    recent[0] * weights[2]
  );
}
