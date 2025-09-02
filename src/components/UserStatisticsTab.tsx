import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Favorite, Timeline, Air, Assessment } from "@mui/icons-material";
import { useUserStatistics } from "../hooks/useUserStatistics";
import type { UserStatisticsTabProps } from "../index";
import { getHRColor, getHRVColor, getOxygenColor } from "../utils/metrics";
import { MetricCard } from "./MetricCard";

const StatusBox = ({
  title,
  description,
  color,
  background,
  border,
}: {
  title: string;
  description: string;
  color: string;
  background: string;
  border: string;
}) => (
  <Box
    sx={{
      px: 3,
      borderRadius: 3,
      background,
      border,
      minHeight: 140,
      boxShadow: `0 2px 8px ${color}20`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600, letterSpacing: "0.5px" }}
    >
      {title}
    </Typography>
    <Typography variant="body1" fontWeight="500" sx={{ mt: 1, color }}>
      {description}
    </Typography>
  </Box>
);

export const UserStatisticsTab: React.FC<UserStatisticsTabProps> = ({
  loginEmail,
  deviceUserID,
  date,
}) => {
  const { statistics, processedStatistics, loading, error } = useUserStatistics(
    loginEmail,
    deviceUserID,
    date
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          p: 4,
          minHeight: 300,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <CircularProgress size={48} sx={{ color: "#1976d2" }} />
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          Loading health metrics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          m: 2,
          borderRadius: 3,
          border: "1px solid #ffcdd2",
          background: "linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)",
        }}
      >
        <Typography variant="body2">
          Unable to load statistics: {error}
        </Typography>
      </Alert>
    );
  }

  if (!processedStatistics) {
    return (
      <Box
        sx={{
          textAlign: "center",
          p: 6,
          m: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Assessment
          sx={{ fontSize: 64, color: "text.secondary", mb: 3, opacity: 0.7 }}
        />
        <Typography
          variant="h5"
          color="text.secondary"
          gutterBottom
          fontWeight={300}
        >
          No Data Available
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ opacity: 0.8 }}
        >
          No health metrics recorded for {new Date(date).toLocaleDateString()}
        </Typography>
      </Box>
    );
  }

  const vitals = [
    {
      label: "Heart Rate",
      stats: processedStatistics.hr,
      unit: "bpm",
      color: getHRColor(processedStatistics.hr.average),
      icon: <Favorite />,
      rawData: statistics.map((s) => s.HR),
      description:
        "Number of times your heart beats per minute, reflecting your overall cardiovascular activity",
    },
    {
      label: "Heart Rate Variability",
      stats: processedStatistics.hrv,
      unit: "ms",
      color: getHRVColor(processedStatistics.hrv.average),
      icon: <Timeline />,
      rawData: statistics.map((s) => s.HRV),
      description:
        "Fluctuation in time between heartbeats, showing how your body balances stress and recovery",
    },
    {
      label: "Oxygen Saturation",
      stats: processedStatistics.oxygen,
      unit: "%",
      color: getOxygenColor(processedStatistics.oxygen.average),
      icon: <Air />,
      rawData: statistics.map((s) => s.OxygenSaturation),
      description:
        "Percentage of oxygen in your blood, reflecting how effectively oxygen is delivered to your body",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        minHeight: "100%",
        borderRadius: 2,
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          border: "1px solid #90caf9",
          background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
          boxShadow: "0 2px 8px rgba(33,150,243,0.15)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 550, color: "#1565c0", mb: 1 }}
        >
          Health Metrics Overview
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          <strong>{processedStatistics.totalReadings}</strong> readings
          collected from <strong>{processedStatistics.timeRange.start}</strong>{" "}
          to <strong>{processedStatistics.timeRange.end}</strong>
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {vitals.map((vital) => (
          <Grid key={vital.label} size={{ xs: 12, lg: 4 }}>
            <MetricCard {...vital} processedStatistics={processedStatistics} />
          </Grid>
        ))}
      </Grid>

      <Card
        sx={{
          mt: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5ece5ff 0%, #fadfd6ff 100%)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 3,
              fontWeight: 500,
              color: "#e65913ff",
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(251, 149, 86, 0.2)",
              }}
            >
              <Assessment sx={{ color: "#da5e20ff" }} />
            </Box>
            Daily Health Summary
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatusBox
                title="OVERALL STATUS"
                description={
                  vitals.filter((v) => v.color === "success").length === 3
                    ? "All key metrics are within healthy range"
                    : vitals.some((v) => v.color === "error")
                    ? "Attention needed - consult healthcare provider"
                    : "Generally good with minor variations"
                }
                color="#2e7d32"
                background="linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)"
                border="1px solid #a5d6a7"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatusBox
                title="MOST DYNAMIC"
                description={`${
                  vitals.reduce((prev, current) =>
                    prev.stats.standardDeviation >
                    current.stats.standardDeviation
                      ? prev
                      : current
                  ).label
                } showed the most variation today`}
                color="#f57c00"
                background="linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)"
                border="1px solid #ffcc02"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatusBox
                title="DATA QUALITY"
                description={`${vitals.reduce(
                  (sum, vital) => sum + vital.stats.outliers.length,
                  0
                )} irregular readings detected across all metrics`}
                color="#1976d2"
                background="linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
                border="1px solid #90caf9"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
