export const formatDuration = (seconds: string): string => {
  const totalSeconds = parseInt(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}hr ${minutes}min`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTimeforSleepData = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTimeforStatistics = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatScoreType = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const isSameDay = (date1: Date, date2: Date): boolean =>
  getDateString(date1) === getDateString(date2);

export const getMonthYear = (date: Date): string =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

import type { DateRange } from "../index";

export const getDateRange = (dates: string[]): DateRange | null => {
  if (dates.length === 0) return null;

  const sortedDates = dates
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  return {
    start: sortedDates[0],
    end: sortedDates[sortedDates.length - 1],
  };
};

import type { MetricStats } from "../index";

export const calculateMetricStats = (values: number[]): MetricStats => {
  if (values.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      range: 0,
      standardDeviation: 0,
      outliers: [],
      trend: 'stable',
      variabilityScore: 'low'
    };
  }

  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);

  const outliers = values.filter(val => Math.abs(val - average) > 2 * standardDeviation);

  const coefficientOfVariation = (standardDeviation / average) * 100;
  let variabilityScore: 'low' | 'medium' | 'high' = 'low';
  if (coefficientOfVariation > 15) variabilityScore = 'high';
  else if (coefficientOfVariation > 8) variabilityScore = 'medium';
  
  const midpoint = Math.floor(values.length / 2);
  const firstHalfAvg = values.slice(0, midpoint).reduce((sum, val) => sum + val, 0) / midpoint;
  const secondHalfAvg = values.slice(midpoint).reduce((sum, val) => sum + val, 0) / (values.length - midpoint);
  const trendThreshold = standardDeviation * 0.5;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (secondHalfAvg - firstHalfAvg > trendThreshold) trend = 'up';
  else if (firstHalfAvg - secondHalfAvg > trendThreshold) trend = 'down';

  return {
    average: Math.round(average * 100) / 100,
    min,
    max,
    range,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    outliers,
    trend,
    variabilityScore
  };
};

export const parseTimeToMinutes = (timeString: string): number => {
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  } catch {
    return 0;
  }
};