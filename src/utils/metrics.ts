export const getScoreColor = (
  scoreType: string
): "error" | "warning" | "success" | "secondary"=> {
  if (scoreType === "Stress") return "error";
  if (scoreType === "MildStress") return "warning";
  if (scoreType === "Recovery") return "success";
  return "secondary";
};

export const getHRColor = (hr: number): "error" | "warning" | "success" => {
  if (hr < 50 || hr > 120) return "error";
  if (hr < 60 || hr > 100) return "warning";
  return "success";
};

export const getHRVColor = (hrv: number): "error" | "warning" | "success" => {
  if (hrv < 30) return "error";
  if (hrv < 50) return "warning";
  return "success";
};

export const getOxygenColor = (
  oxygen: number
): "error" | "warning" | "success" => {
  if (oxygen < 90) return "error";
  if (oxygen < 95) return "warning";
  return "success";
};
