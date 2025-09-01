import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import { Psychology, Assessment, TrendingUp } from "@mui/icons-material";
import type { UserScoreTabProps } from "../index";
import { formatScoreType } from "../utils/formatters";
import { getScoreConfig } from "../utils/metrics";

const CircularScore: React.FC<{
  score: number;
  color: string;
  size?: number;
}> = ({ score, color, size = 160 }) => {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={alpha(color, 0.12)}
          strokeWidth={12}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={12}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1s ease-out",
            filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.1))",
          }}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontWeight: 800, color, lineHeight: 1, fontSize: "3.5rem" }}
        >
          {score}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            mt: 0.5,
            fontSize: "0.875rem",
          }}
        >
          Health Score
        </Typography>
      </Box>
    </Box>
  );
};

const ScoreBadge: React.FC<{ label: string; color: string }> = ({
  label,
  color,
}) => (
  <Box
    sx={{
      bgcolor: color,
      color: "white",
      px: 4,
      py: 2,
      borderRadius: 30,
      display: "inline-flex",
      alignItems: "center",
      gap: 1.5,
      boxShadow: `0 6px 20px ${alpha(color, 0.3)}`,
      transform: "translateY(-2px)",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: `0 8px 25px ${alpha(color, 0.4)}`,
      },
    }}
  >
    <TrendingUp fontSize="medium" />
    <Typography variant="h6" fontWeight={700}>
      {label}
    </Typography>
  </Box>
);

const ScoreInfoCard: React.FC<{ score: number; color: string }> = ({
  score,
  color,
}) => {
  const getWellnessLevel = (score: number) => {
    if (score >= 80) return "EXCELLENT";
    if (score >= 70) return "GOOD";
    if (score >= 60) return "FAIR";
    if (score >= 40) return "MODERATE";
    return "AT RISK";
  };

  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderRadius: 3,
        minWidth: 300,
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent sx={{ textAlign: "center", py: 4, px: 2 }}>
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
          sx={{ fontWeight: 600, fontSize: "1rem", mb: 1.5 }}
        >
          Wellness Level
        </Typography>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            color,
            fontSize: "1.8rem", 
            letterSpacing: "-0.02em",
          }}
        >
          {getWellnessLevel(score)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const UserScoreTab: React.FC<UserScoreTabProps> = ({ userScore }) => {
  const theme = useTheme();

  if (!userScore?.ScoreType || userScore.VitalzScore == null) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          px: 3,
          bgcolor: alpha(theme.palette.grey[100], 0.3),
          borderRadius: 3,
          minHeight: 300,
        }}
      >
        <Psychology sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Score Data Available
        </Typography>
        <Typography variant="body2" color="text.disabled" textAlign="center">
          Your wellness assessment will appear here when available
        </Typography>
      </Box>
    );
  }

  const scoreConfig = getScoreConfig(userScore.ScoreType);

  return (
    <Box sx={{ p: 0 }}>
      <Box
        sx={{
          bgcolor: scoreConfig.bgColor,
          borderRadius: 4,
          p: 4,
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${alpha(scoreConfig.color, 0.12)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 4 }}>
          <Avatar
            sx={{
              bgcolor: scoreConfig.color,
              color: "white",
              width: 56,
              height: 56,
              boxShadow: `0 4px 12px ${alpha(scoreConfig.color, 0.3)}`,
            }}
          >
            <Assessment fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              Health Score
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Your latest wellness assessment
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", 
            gap: 5,
            flexWrap: "wrap", 
          }}
        >
          <CircularScore
            score={userScore.VitalzScore}
            color={scoreConfig.color}
          />
          <ScoreBadge
            label={formatScoreType(userScore.ScoreType)}
            color={scoreConfig.color}
          />
          <ScoreInfoCard
            score={userScore.VitalzScore}
            color={scoreConfig.color}
          />
        </Box>
      </Box>
    </Box>
  );
};
