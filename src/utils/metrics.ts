export const getScoreColor = (score: number): 'error' | 'warning' | 'success' => {
  if (score < 50) return 'error';
  if (score < 80) return 'warning';
  return 'success';
};

export const getScoreLabel = (score: number): string => {
  if (score < 40) return 'Poor';
  if (score < 70) return 'Moderate';
  return 'Excellent';
};

export const getHRColor = (hr: number): 'error' | 'warning' | 'success' => {
  if (hr < 50 || hr > 120) return 'error';
  if (hr < 60 || hr > 100) return 'warning';
  return 'success';
};

export const getHRVColor = (hrv: number): 'error' | 'warning' | 'success' => {
  if (hrv < 30) return 'error';
  if (hrv < 50) return 'warning';
  return 'success';
};

export const getOxygenColor = (oxygen: number): 'error' | 'warning' | 'success' => {
  if (oxygen < 90) return 'error';
  if (oxygen < 95) return 'warning';
  return 'success';
};
