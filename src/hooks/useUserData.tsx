import { useState, useEffect } from 'react';
import { apiService } from '../api';
import type { SleepData, UserScore } from '../index';

export const useUserData = (loginEmail: string, deviceUserID: string) => {
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [userScores, setUserScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (!loginEmail || !deviceUserID) return;

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sleepResponse, scoreResponse] = await Promise.all([
        apiService.getUserSleepData(loginEmail, deviceUserID),
        apiService.getUserScore(loginEmail, deviceUserID)
      ]);

      setSleepData(sleepResponse.data);
      setUserScores(scoreResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [loginEmail, deviceUserID]);

  return { sleepData, userScores, loading, error};
};