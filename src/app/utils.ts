export function isNil(value: any): value is null | undefined {
  return value === null || value === undefined;
}

export function average(data: Array<any>): number {
  const sum = data.reduce((a, b) => a + b, 0);
  return sum / data.length || 0;
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
