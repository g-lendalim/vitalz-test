import { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  FirstPage,
  LastPage,
} from "@mui/icons-material";
import { getScoreConfig } from "../utils/metrics";
import type { UserScore, CalendarDateSelectorProps, DayInfo } from "../index";
import {
  formatScoreType,
  getDateString,
  getMonthYear,
  isSameDay,
  getDateRange,
} from "../utils/formatters";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const CALENDAR_WEEKS = 6;
const DAYS_PER_WEEK = 7;
const TOTAL_CALENDAR_DAYS = CALENDAR_WEEKS * DAYS_PER_WEEK;

const cardStyles = {
  borderRadius: 3,
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

const navButtonStyles = {
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  border: "1px solid rgba(102, 126, 234, 0.1)",
  "&:hover": {
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    transform: "scale(1.05)",
  },
  transition: "all 0.2s ease-in-out",
};

const LegendItem: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: color,
      }}
    />
    <Typography variant="caption" sx={{ fontWeight: 500 }}>
      {label}
    </Typography>
  </Box>
);

const QuickNavButton: React.FC<{
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
}> = ({ tooltip, onClick, disabled, icon }) => (
  <Tooltip title={tooltip}>
    <span>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={{
          "&:hover": { backgroundColor: "rgba(102, 126, 234, 0.1)" },
        }}
      >
        {icon}
      </IconButton>
    </span>
  </Tooltip>
);

export const CalendarDateSelector: React.FC<CalendarDateSelectorProps> = ({
  sleepData,
  userScores,
  onDateSelect,
  loading,
  error,
}) => {
  const initialMonth = useMemo(() => {
    const allDates = [
      ...sleepData.map((item) => item.Date),
      ...userScores.map((item) => item.Date),
    ];
    if (allDates.length === 0) return new Date();
    const latestDate = new Date(
      Math.max(...allDates.map((d) => new Date(d).getTime()))
    );
    return new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
  }, [sleepData, userScores]);

  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const { availableDates, dateScoreMap, dateRange } = useMemo(() => {
    const dates = new Set([
      ...sleepData.map((item) => item.Date),
      ...userScores.map((item) => item.Date),
    ]);

    const scoreMap = new Map<string, UserScore>();
    userScores.forEach((score) => scoreMap.set(score.Date, score));

    const range = getDateRange(Array.from(dates));

    return { availableDates: dates, dateScoreMap: scoreMap, dateRange: range };
  }, [sleepData, userScores]);

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + (direction === "next" ? 1 : -1));
      return newMonth;
    });
  }, []);

  const navigateToMonth = useCallback((date: Date) => {
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }, []);

  const handleQuickNavigation = useCallback(
    (type: "first" | "last" | "current") => {
      const today = new Date();
      if (!dateRange) return;
      switch (type) {
        case "first":
          navigateToMonth(dateRange.start);
          break;
        case "last":
          navigateToMonth(dateRange.end);
          break;
        case "current":
          navigateToMonth(today);
          break;
      }
    },
    [dateRange, navigateToMonth]
  );

  const calendarDays = useMemo((): DayInfo[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days: DayInfo[] = [];
    const currentDate = new Date(startDate);
    const today = new Date();

    for (let i = 0; i < TOTAL_CALENDAR_DAYS; i++) {
      const dateString = getDateString(currentDate);
      const isCurrentMonth = currentDate.getMonth() === month;
      days.push({
        date: new Date(currentDate),
        dateString,
        day: currentDate.getDate(),
        isCurrentMonth,
        hasData: availableDates.has(dateString),
        scoreData: dateScoreMap.get(dateString),
        isToday: isSameDay(currentDate, today),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [currentMonth, availableDates, dateScoreMap]);

  const handleDateClick = useCallback(
    (dayInfo: DayInfo) => {
      if (dayInfo.isCurrentMonth) onDateSelect(dayInfo.dateString);
    },
    [onDateSelect]
  );

  const getScoreIndicatorColor = useCallback((dayInfo: DayInfo) => {
    if (!dayInfo.hasData) return null;
    if (dayInfo.scoreData) {
      return getScoreConfig(dayInfo.scoreData.ScoreType)?.color || "primary.main";
    }
    return "primary.main";
  }, []);

  if (loading)
    return (
      <Card elevation={0} sx={cardStyles}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#667eea" }} />
          </Box>
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card elevation={0} sx={cardStyles}>
        <CardContent sx={{ p: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  return (
    <Card elevation={0} sx={cardStyles}>
      <CardContent
        sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 6, height: 28, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: 1 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
                Select Date
              </Typography>
              <Chip
                label={`${availableDates.size} days recorded`}
                size="small"
                sx={{ backgroundColor: "rgba(102, 126, 234, 0.1)", color: "#667eea", fontWeight: 600, fontSize: "0.75rem" }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 0.5, backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: 2, p: 0.5, border: "1px solid rgba(102, 126, 234, 0.1)" }}>
            <QuickNavButton tooltip="First data" onClick={() => handleQuickNavigation("first")} disabled={!dateRange} icon={<FirstPage fontSize="small" />} />
            <QuickNavButton tooltip="Today" onClick={() => handleQuickNavigation("current")} icon={<CalendarToday fontSize="small" />} />
            <QuickNavButton tooltip="Latest data" onClick={() => handleQuickNavigation("last")} disabled={!dateRange} icon={<LastPage fontSize="small" />} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3, gap: 2 }}>
          <IconButton onClick={() => navigateMonth("prev")} size="small" sx={navButtonStyles}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", minWidth: "200px", textAlign: "center", letterSpacing: "-0.01em" }}>
            {getMonthYear(currentMonth)}
          </Typography>
          <IconButton onClick={() => navigateMonth("next")} size="small" sx={navButtonStyles}>
            <ChevronRight />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, mb: 2 }}>
            {WEEK_DAYS.map((day) => (
              <Box key={day} sx={{ textAlign: "center", py: 1, fontSize: "0.875rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.02em" }}>
                {day}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1.5 }}>
            {calendarDays.map((dayInfo, index) => {
              const indicatorColor = getScoreIndicatorColor(dayInfo);

              return (
                <Tooltip
                  key={index}
                  title={
                    dayInfo.isCurrentMonth
                      ? `${dayInfo.date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}${
                          dayInfo.hasData
                            ? dayInfo.scoreData
                              ? ` - Score: ${dayInfo.scoreData.VitalzScore} ${
                                  dayInfo.scoreData.ScoreType
                                    ? `(${formatScoreType(
                                        dayInfo.scoreData.ScoreType
                                      )})`
                                    : ""
                                }`
                              : " - Data available"
                            : " - No data"
                        }`
                      : ""
                  }
                  placement="top"
                >
                  <Box
                    onClick={() => handleDateClick(dayInfo)}
                    sx={{
                      height: 48,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      cursor: dayInfo.hasData || dayInfo.isCurrentMonth ? "pointer" : "default",
                      border: dayInfo.isToday ? "2px solid #667eea" : "none",
                      borderRadius: 2,
                      opacity: dayInfo.isCurrentMonth ? 1 : 0.3,
                      transition: "all 0.2s ease-in-out",
                      "&:hover":
                        dayInfo.hasData || dayInfo.isCurrentMonth
                          ? {
                              backgroundColor: dayInfo.isToday
                                ? "rgba(102, 126, 234, 0.1)"
                                : dayInfo.hasData
                                ? "rgba(102, 126, 234, 0.05)"
                                : "rgba(102, 126, 234, 0.03)",
                              transform: dayInfo.hasData ? "scale(1.05)" : "none",
                            }
                          : {},
                    }}
                  >
                    {dayInfo.isToday && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -2,
                          left: -2,
                          right: -2,
                          bottom: -2,
                          borderRadius: 2,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          zIndex: 0,
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: dayInfo.isToday ? 700 : dayInfo.hasData ? 600 : 500,
                        color: dayInfo.isToday
                          ? "white"
                          : dayInfo.isCurrentMonth
                          ? dayInfo.hasData
                            ? "#1e293b"
                            : "#64748b"
                          : "#94a3b8",
                        zIndex: 2,
                        position: "relative",
                        fontSize: "0.95rem",
                      }}
                    >
                      {dayInfo.day}
                    </Typography>

                    {dayInfo.hasData && indicatorColor && (
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: indicatorColor,
                          mt: 0.5,
                          zIndex: 2,
                          opacity: 0.8,
                        }}
                      />
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ m: 3 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 2,
              fontWeight: 600,
              color: "#64748b",
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Legend for Vitalz Score
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <LegendItem color="success.main" label="Excellent (80+)" />
            <LegendItem color="warning.main" label="Moderate (40-79)" />
            <LegendItem color="error.main" label="Poor (<40)" />
            <LegendItem color="#667eea" label="Data Available" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};