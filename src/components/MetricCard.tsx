import { useState, useMemo } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ExpandMore,
  ExpandLess,
  ShowChart,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { MetricCardProps } from "../index";
import {
  formatTimeforStatistics,
  parseTimeToMinutes,
} from "../utils/formatters";

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp fontSize="small" sx={{ color: "#4caf50" }} />;
    case "down":
      return <TrendingDown fontSize="small" sx={{ color: "#f44336" }} />;
    default:
      return <TrendingFlat fontSize="small" sx={{ color: "#9e9e9e" }} />;
  }
};

const getVariabilityColor = (score: string) => {
  switch (score) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    default:
      return "success";
  }
};

const getMetricColors = (color: string) => {
  const palettes = {
    success: {
      primary: "#e8f5e8",
      stroke: "#2e7d32",
      icon: "#1b5e20",
      text: "#2e7d32",
    },
    warning: {
      primary: "#fff8e1",
      stroke: "#f57c00",
      icon: "#e65100",
      text: "#f57c00",
    },
    error: {
      primary: "#ffebee",
      stroke: "#d32f2f",
      icon: "#b71c1c",
      text: "#d32f2f",
    },
  };
  return palettes[color as keyof typeof palettes] || palettes.error;
};

const MetricInfoBox = ({
  title,
  value,
}: {
  title: string;
  value: React.ReactNode;
  textAlign?: "left" | "center" | "right";
}) => (
  <Box
    sx={{
      p: 1.5,
      borderRadius: 2,
      background: "rgba(255,255,255,0.6)",
      border: "1px solid rgba(0,0,0,0.08)",
      textAlign: "center",
    }}
  >
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 500 }}
    >
      {title}
    </Typography>
    <Typography variant="body2" fontWeight="600" sx={{ color: "#333" }}>
      {value}
    </Typography>
  </Box>
);

const RangeVariability = ({ stats, unit }: { stats: any; unit: string }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      mb: 3,
      p: 2,
      borderRadius: 2,
      background: "rgba(255,255,255,0.7)",
      border: "1px solid rgba(0,0,0,0.08)",
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "row", gap: 4, mb: 1 }}>
      <Typography variant="caption" fontWeight="600" sx={{ color: "#333" }}>
        RANGE
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight="500">
        {stats.min}-{stats.max} {unit}
      </Typography>
    </Box>

    <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
      <Typography variant="caption" fontWeight="600" sx={{ color: "#333" }}>
        VARIABILITY
      </Typography>

      <Chip
        size="small"
        variant="filled"
        color={getVariabilityColor(stats.variabilityScore)}
        sx={{
          height: 20,
          fontSize: "0.7rem",
          fontWeight: 500,
          textTransform: "capitalize",
        }}
        label={stats.variabilityScore}
      />
    </Box>
  </Box>
);

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  stats,
  unit,
  icon,
  color,
  rawData,
  description,
  processedStatistics,
}) => {
  const [expanded, setExpanded] = useState(false);
  const colors = getMetricColors(color);

  const chartData = useMemo(
    () =>
      rawData
        .map((value, index) => ({
          time: formatTimeforStatistics(
            processedStatistics?.raw[index]?.Time || "00:00"
          ),
          value,
          isOutlier: stats.outliers.includes(value),
          minutes: parseTimeToMinutes(
            processedStatistics?.raw[index]?.Time || "00:00"
          ),
        }))
        .sort((a, b) => a.minutes - b.minutes),
    [processedStatistics?.raw, rawData, stats.outliers]
  );

  const sampledData =
    rawData.length > 100
      ? chartData.filter(
          (_, index) => index % Math.ceil(rawData.length / 100) === 0
        )
      : chartData;

  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${colors.primary} 0%, #fafafa 100%)`,
        border: `1px solid ${colors.primary}`,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.icon,
              }}
            >
              {icon}
            </Box>
            <Typography
              variant="subtitle2"
              fontWeight="800"
              sx={{ color: "#333" }}
            >
              {label}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
            sx={{
              ml: "auto",
              background: "rgba(255,255,255,0.8)",
              "&:hover": { background: "rgba(255,255,255,0.9)" },
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 2 }}>
            <Typography
              variant="h3"
              component="span"
              sx={{ fontWeight: 400, color: colors.text }}
            >
              {stats.average}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400 }}
            >
              {unit}
            </Typography>
            <Box sx={{ ml: 1 }}>{getTrendIcon(stats.trend)}</Box>
          </Box>

          <Chip
            label={
              color === "success"
                ? "Normal Range"
                : color === "warning"
                ? "Attention"
                : "Critical Alert"
            }
            color={color}
            size="small"
            sx={{
              mb: 2,
              fontWeight: 500,
              borderRadius: 2,
              background: colors.primary,
              color: colors.text,
              border: `1px solid ${colors.stroke}`,
              "& .MuiChip-label": { px: 2 },
            }}
          />
        </Box>

        <RangeVariability stats={stats} unit={unit} />

        {!expanded && (
          <Box
            sx={{
              height: 80,
              mb: 2,
              p: 2,
              borderRadius: 2,
              background: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampledData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors.stroke}
                  strokeWidth={2}
                  dot={false}
                />
                <ReferenceLine
                  y={stats.average}
                  stroke="#666"
                  strokeDasharray="3 3"
                  opacity={0.6}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic", textAlign: "center" }}
        >
          {description}
        </Typography>

        <Collapse in={expanded}>
          <Divider sx={{ my: 3, opacity: 0.3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 600,
                color: "#333",
              }}
            >
              <ShowChart fontSize="small" /> 24-Hour Trend Analysis
            </Typography>
            <Box
              sx={{
                height: 220,
                p: 1,
                borderRadius: 2,
                background: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampledData}>
                  <XAxis
                    dataKey="time"
                    fontSize={11}
                    ticks={["12:00 AM", "12:00 PM", "11:59 PM"]}
                    stroke="#666"
                  />
                  <YAxis
                    fontSize={11}
                    domain={["dataMin - 5", "dataMax + 5"]}
                    stroke="#666"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={colors.stroke}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <ReferenceLine
                    y={stats.average}
                    stroke="#666"
                    strokeDasharray="4 4"
                    label={{
                      value: "Average",
                      position: "insideTopRight",
                      fontSize: 11,
                      fill: "#666",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <MetricInfoBox title="MINIMUM" value={`${stats.min} ${unit}`} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <MetricInfoBox title="MAXIMUM" value={`${stats.max} ${unit}`} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <MetricInfoBox
                title="IRREGULAR READINGS DETECTED"
                value={
                  stats.outliers.length === 0
                    ? "0 reading"
                    : `${stats.outliers.join(", ")} ${unit}`
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  STABILITY SCORE
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={
                      stats.variabilityScore === "low"
                        ? 85
                        : stats.variabilityScore === "medium"
                        ? 60
                        : 30
                    }
                    sx={{
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(0,0,0,0.1)",
                    }}
                    color={getVariabilityColor(stats.variabilityScore)}
                  />
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ color: "#333" }}
                  >
                    {stats.variabilityScore === "low"
                      ? "Stable"
                      : stats.variabilityScore === "medium"
                      ? "Moderate"
                      : "Variable"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};
