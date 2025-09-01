export const formatDuration = (seconds: string): string => {
  const totalSeconds = parseInt(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}hr ${minutes}min`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatScoreType = (str: string): string => {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const getDateString = (date: Date): string => date.toISOString().split("T")[0];

export const isSameDay = (date1: Date, date2: Date): boolean => 
  getDateString(date1) === getDateString(date2);

export const getMonthYear = (date: Date): string => 
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

import type { DateRange } from "../index";

export const getDateRange = (dates: string[]): DateRange | null => {
  if (dates.length === 0) return null;
  
  const sortedDates = dates
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());
  
  return {
    start: sortedDates[0],
    end: sortedDates[sortedDates.length - 1]
  };
};