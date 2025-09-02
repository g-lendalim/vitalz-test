import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  alpha,
  Stack,
} from "@mui/material";
import {
  Bedtime,
  WbSunny,
  Hotel,
  AccessTime,
  NightsStay,
  WbTwilight,
  Schedule,
  Insights,
  CheckCircle,
  Warning,
  Error,
} from "@mui/icons-material";
import { formatDuration, formatTimeforSleepData } from "../utils/formatters";
import type { SleepDataTabProps, SleepStage, SleepMetric } from "../index";

const SLEEP_PARAMETERS = {
  totalSleep: { optimal: [7, 9], acceptable: [6, 10], unit: "hours" },
  deepSleep: { optimal: [15, 25], acceptable: [10, 30], unit: "%" },
  awake: { optimal: [0, 10], acceptable: [0, 15], unit: "%" },
};

const STATUS_CONFIG = {
  success: { icon: <CheckCircle />, color: "#2e7d32", label: "Optimal" },
  warning: { icon: <Warning />, color: "#ed6c02", label: "Acceptable" },
  danger: { icon: <Error />, color: "#d32f2f", label: "Needs Attention" },
};

const getStatusIndicator = (
  value: number,
  parameter: typeof SLEEP_PARAMETERS.totalSleep
) => {
  const isInOptimal =
    value >= parameter.optimal[0] && value <= parameter.optimal[1];
  const isInAcceptable =
    value >= parameter.acceptable[0] && value <= parameter.acceptable[1];

  if (isInOptimal) return STATUS_CONFIG.success;
  if (isInAcceptable) return STATUS_CONFIG.warning;
  return STATUS_CONFIG.danger;
};

const getSleepQualityRating = (
  totalSleep: string,
  deep: string,
  awake: string
) => {
  const totalHours = (parseInt(totalSleep) || 0) / 60;
  const deepPercent = parseInt(deep) || 0;
  const awakePercent = parseInt(awake) || 0;

  let score = 0;
  score +=
    totalHours >= 7 && totalHours <= 9
      ? 40
      : totalHours >= 6
      ? 30
      : totalHours >= 5
      ? 20
      : 10;
  score += deepPercent >= 20 ? 30 : deepPercent >= 15 ? 20 : 10;
  score +=
    awakePercent <= 5
      ? 30
      : awakePercent <= 10
      ? 25
      : awakePercent <= 15
      ? 20
      : 10;

  if (score >= 85)
    return {
      rating: "Excellent",
      color: "#2e7d32",
      description: "Outstanding sleep quality",
    };
  if (score >= 70)
    return {
      rating: "Good",
      color: "#388e3c",
      description: "Good restorative sleep",
    };
  if (score >= 55)
    return {
      rating: "Fair",
      color: "#f57c00",
      description: "Moderate sleep quality",
    };
  return {
    rating: "Poor",
    color: "#d32f2f",
    description: "Sleep needs improvement",
  };
};

const SleepMetricCard = ({ metric }: { metric: SleepMetric }) => (
  <Grid size={{ xs: 12 }} key={metric.label}>
    <Card
      elevation={0}
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(
          metric.color,
          0.04
        )} 0%, ${alpha(metric.color, 0.02)} 100%)`,
        border: `1px solid ${alpha(metric.color, 0.08)}`,
        borderRadius: 3,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: `0 12px 36px ${alpha(metric.color, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              width: 52,
              height: 52,
              background: `linear-gradient(135deg, ${alpha(
                metric.color,
                0.15
              )} 0%, ${alpha(metric.color, 0.08)} 100%)`,
              color: metric.color,
              mr: 2,
            }}
          >
            {metric.icon}
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}
            >
              {metric.label}
            </Typography>
            {metric.subtitle && (
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                {metric.subtitle}
              </Typography>
            )}
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: metric.color,
              fontWeight: 700,
              fontFamily: '"Inter", "Roboto", sans-serif',
              ml: "auto",
            }}
          >
            {metric.value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

const SleepStageCard = ({
  stage,
  statusInfo,
  normalRange,
}: {
  stage: SleepStage;
  statusInfo?: ReturnType<typeof getStatusIndicator>;
  normalRange?: string;
}) => (
  <Grid size={{ xs: 12, lg: 4 }} key={stage.label}>
    <Card
      elevation={0}
      sx={{
        background: alpha(stage.color, 0.02),
        border: `2px solid ${alpha(stage.color, 0.12)}`,
        borderRadius: 3,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: `0 8px 32px ${alpha(stage.color, 0.2)}`,
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: stage.gradient,
              mr: 2,
              boxShadow: `0 4px 16px ${alpha(stage.color, 0.3)}`,
            }}
          >
            {stage.icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
            >
              {stage.label}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "#64748b", textAlign: "center", mb: 3 }}
        >
          {stage.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            mb: 3,
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: stage.color,
              fontWeight: 800,
              mr: 1,
              fontFamily: '"Inter", "Roboto", sans-serif',
            }}
          >
            {stage.value}
          </Typography>
          <Typography variant="h5" sx={{ color: stage.color, fontWeight: 600 }}>
            %
          </Typography>
        </Box>
        <Box sx={{ position: "relative", mb: 3 }}>
          <Box
            sx={{
              height: 16,
              borderRadius: 8,
              backgroundColor: alpha(stage.color, 0.1),
              position: "relative",
              overflow: "hidden",
            }}
          >
            {normalRange && (
              <Box
                sx={{
                  position: "absolute",
                  left: `${
                    SLEEP_PARAMETERS[
                      stage.label === "Deep Sleep" ? "deepSleep" : "awake"
                    ].optimal[0]
                  }%`,
                  width: `${
                    SLEEP_PARAMETERS[
                      stage.label === "Deep Sleep" ? "deepSleep" : "awake"
                    ].optimal[1] -
                    SLEEP_PARAMETERS[
                      stage.label === "Deep Sleep" ? "deepSleep" : "awake"
                    ].optimal[0]
                  }%`,
                  height: "100%",
                  backgroundColor: alpha("#10b981", 0.3),
                  borderRadius: "4px",
                }}
              />
            )}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                width: `${Math.min(stage.value, 100)}%`,
                height: "100%",
                background: stage.gradient,
                borderRadius: 8,
                transition: "width 1s ease-out",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent 0%, ${alpha(
                  "#ffffff",
                  0.4
                )} 50%, transparent 100%)`,
                borderRadius: 8,
                pointerEvents: "none",
              }}
            />
          </Box>
        </Box>
        <Stack spacing={2} alignItems="center">
          {statusInfo && (
            <Chip
              icon={statusInfo.icon}
              label={statusInfo.label}
              size="small"
              sx={{
                backgroundColor: alpha(statusInfo.color, 0.1),
                color: statusInfo.color,
                fontWeight: 600,
                borderRadius: 2,
              }}
            />
          )}
          {normalRange && (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{ color: "#1f9647ff", fontWeight: 800 }}
              >
                Optimal Range
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#1f9647ff", fontWeight: 600 }}
              >
                {normalRange}
              </Typography>
            </Box>
          )}
          {stage.label === "Light Sleep" && (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{ color: "#1f9647ff", fontWeight: 800 }}
              >
                Typical Range
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#1f9647ff", fontWeight: 600 }}
              >
                45–55%
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  </Grid>
);

export const SleepDataTab: React.FC<SleepDataTabProps> = ({ sleepData }) => {
  if (!sleepData) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 350,
          textAlign: "center",
          p: 4,
          background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
          borderRadius: 2,
        }}
      >
        <NightsStay
          sx={{ fontSize: 72, color: "#9ca3af", mb: 3, opacity: 0.7 }}
        />
        <Typography
          variant="h6"
          sx={{ color: "#4b5563", mb: 1, fontWeight: 500 }}
        >
          No Sleep Data Available
        </Typography>
        <Typography variant="body2" sx={{ color: "#9ca3af", maxWidth: 300 }}>
          Select a date with recorded sleep data to view detailed metrics and
          clinical insights.
        </Typography>
      </Box>
    );
  }

  const deepPercent = parseInt(sleepData.Deep) || 0;
  const awakePercent = parseInt(sleepData.Awake) || 0;

  const sleepStages: SleepStage[] = [
    {
      label: "Deep Sleep",
      value: deepPercent,
      color: "#1565c0",
      icon: <Hotel />,
      description: "Restorative sleep phase for body and mind",
      gradient: "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
    },
    {
      label: "Light Sleep",
      value: parseInt(sleepData.Light) || 0,
      color: "#42a5f5",
      icon: <Bedtime />,
      description: "Transition phase supporting memory and recovery",
      gradient: "linear-gradient(135deg, #42a5f5 0%, #64b5f6 100%)",
    },
    {
      label: "Awake",
      value: awakePercent,
      color: "#ff9800",
      icon: <WbSunny />,
      description: "Periods of alertness or brief interruptions",
      gradient: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
    },
  ];

  const qualityAssessment = getSleepQualityRating(
    sleepData.TotalTimeAsleep,
    sleepData.Deep,
    sleepData.Awake
  );

  const sleepMetrics: SleepMetric[] = [
    {
      label: "Sleep Duration",
      value: formatDuration(sleepData.TotalTimeAsleep),
      icon: <AccessTime />,
      color: "#1976d2",
      subtitle: "Total time asleep",
    },
    {
      label: "Sleep Onset",
      value: formatTimeforSleepData(sleepData.SleepOnset),
      icon: <WbTwilight />,
      color: "#7b1fa2",
      subtitle: "Time you fell asleep",
    },
    {
      label: "Wake Time",
      value: formatTimeforSleepData(sleepData.WakeUpTime),
      icon: <WbSunny />,
      color: "#f57c00",
      subtitle: "Time you woke up",
    },
  ];

  const deepSleepStatus = getStatusIndicator(
    deepPercent,
    SLEEP_PARAMETERS.deepSleep
  );
  const awakeStatus = getStatusIndicator(awakePercent, SLEEP_PARAMETERS.awake);

  return (
    <Box
      sx={{
        p: 2,
        background: "linear-gradient(135deg, #fafbff 0%, #f6f8ff 100%)",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                qualityAssessment.color,
                0.08
              )} 0%, ${alpha(qualityAssessment.color, 0.03)} 100%)`,
              border: `2px solid ${alpha(qualityAssessment.color, 0.15)}`,
              borderRadius: 3,
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  margin: "0 auto 20px",
                  background: `linear-gradient(135deg, ${
                    qualityAssessment.color
                  } 0%, ${alpha(qualityAssessment.color, 0.8)} 100%)`,
                  fontSize: 42,
                  boxShadow: `0 8px 24px ${alpha(
                    qualityAssessment.color,
                    0.3
                  )}`,
                }}
              >
                <Insights />
              </Avatar>
              <Typography
                variant="h3"
                sx={{
                  color: qualityAssessment.color,
                  mb: 1,
                  fontWeight: 700,
                  fontFamily: '"Inter", "Roboto", sans-serif',
                }}
              >
                {qualityAssessment.rating}
              </Typography>
              <Chip
                label={qualityAssessment.description}
                sx={{
                  backgroundColor: alpha(qualityAssessment.color, 0.12),
                  color: qualityAssessment.color,
                  fontWeight: 600,
                  mb: 3,
                  borderRadius: 2,
                  fontSize: "0.875rem",
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Grid container spacing={2}>
            {sleepMetrics.map((metric) => (
              <SleepMetricCard key={metric.label} metric={metric} />
            ))}
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Schedule sx={{ mr: 2, color: "#3b82f6", fontSize: 28 }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#1e293b" }}
                >
                  Sleep Stage Distribution
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {sleepStages.map((stage) => {
                  let statusInfo, normalRange;
                  if (stage.label === "Deep Sleep") {
                    statusInfo = deepSleepStatus;
                    normalRange = `${SLEEP_PARAMETERS.deepSleep.optimal[0]}-${SLEEP_PARAMETERS.deepSleep.optimal[1]}%`;
                  } else if (stage.label === "Awake") {
                    statusInfo = awakeStatus;
                    normalRange = `${SLEEP_PARAMETERS.awake.optimal[0]}-${SLEEP_PARAMETERS.awake.optimal[1]}%`;
                  }
                  return (
                    <SleepStageCard
                      key={stage.label}
                      stage={stage}
                      statusInfo={statusInfo}
                      normalRange={normalRange}
                    />
                  );
                })}
              </Grid>
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: alpha("#3b82f6", 0.03),
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#4b5563",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  <strong>Clinical Reference:</strong> For restorative health,
                  aim for 7–9 hours of sleep, with 15–25% deep sleep and under
                  10% awake time.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
