import { alpha } from "@mui/material";

const SCORE_CONFIG = {
  Stress: {
    color: "#d32f2f",
    bgColor: alpha("#d32f2f", 0.08),
    label: "Stress",
  },
  MildStress: {
    color: "#f57c00",
    bgColor: alpha("#f57c00", 0.08),
    label: "Mild Stress",
  },
  Recovery: {
    color: "#388e3c",
    bgColor: alpha("#388e3c", 0.08),
    label: "Recovery",
  },
  default: {
    color: "#1976d2",
    bgColor: alpha("#1976d2", 0.08),
    label: "Normal",
  },
} as const;

export const getScoreConfig = (scoreType?: string) =>
  (scoreType && SCORE_CONFIG[scoreType as keyof typeof SCORE_CONFIG]) ||
  SCORE_CONFIG.default;

export const getHRColor = (hr: number): "error" | "warning" | "success" => {
  if (hr < 50 || hr > 120) return "error";
  if (hr < 60 || hr > 100) return "warning";
  return "success";
};

export const getHRVColor = (hrv: number): "error" | "warning" | "success" => {
  if (hrv < 20) return "error";
  if (hrv < 30) return "warning";
  return "success";
};

export const getOxygenColor = (
  oxygen: number
): "error" | "warning" | "success" => {
  if (oxygen < 90) return "error";
  if (oxygen < 95) return "warning";
  return "success";
};
