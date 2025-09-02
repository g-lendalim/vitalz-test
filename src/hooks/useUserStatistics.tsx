import { useState, useEffect, useMemo } from "react";
import { apiService } from "../api";
import type { UserStatistics, ProcessedStatistics } from "../index";
import { calculateMetricStats, formatTimeforStatistics, parseTimeToMinutes } from "../utils/formatters";

export const useUserStatistics = (
  loginEmail: string,
  deviceUserID: string,
  date: string
) => {
  const [statistics, setStatistics] = useState<UserStatistics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loginEmail || !deviceUserID || !date) return;

    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.getUserStatistics(
          loginEmail,
          deviceUserID,
          date
        );
        setStatistics(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [loginEmail, deviceUserID, date]);

  const processedStatistics = useMemo((): ProcessedStatistics | null => {
    if (statistics.length === 0) return null;

    const sortedStats = [...statistics].sort((a, b) => 
      parseTimeToMinutes(a.Time) - parseTimeToMinutes(b.Time)
    );

    const hrValues = sortedStats.map(s => s.HR);
    const hrvValues = sortedStats.map(s => s.HRV);
    const oxygenValues = sortedStats.map(s => s.OxygenSaturation);
    const times = sortedStats.map(s => s.Time).sort();
    const startTime = times[0];
    const endTime = times[times.length - 1];

    return {
      raw: sortedStats,
      hr: calculateMetricStats(hrValues),
      hrv: calculateMetricStats(hrvValues),
      oxygen: calculateMetricStats(oxygenValues),
      totalReadings: sortedStats.length,
      timeRange: {
        start: formatTimeforStatistics(startTime),
        end: formatTimeforStatistics(endTime)
      }
    };
  }, [statistics]);


  return { 
    statistics, 
    processedStatistics,
    loading, 
    error 
  };
};