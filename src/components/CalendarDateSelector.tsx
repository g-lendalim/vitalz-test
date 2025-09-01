import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Tooltip
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  FiberManualRecord,
  FirstPage,
  LastPage,
} from "@mui/icons-material";
import { getScoreColor } from "../utils/metrics";
import type { UserScore, CalendarDateSelectorProps, DayInfo } from "../index";
import { formatScoreType, getDateString, getMonthYear, isSameDay, getDateRange } from "../utils/formatters";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const CALENDAR_WEEKS = 6;
const DAYS_PER_WEEK = 7;
const TOTAL_CALENDAR_DAYS = CALENDAR_WEEKS * DAYS_PER_WEEK;

export const CalendarDateSelector: React.FC<CalendarDateSelectorProps> = ({
  sleepData,
  userScores,
  onDateSelect,
  loading,
  error,
}) => {
  const initialMonth = useMemo(() => {
    const allDates = [
      ...sleepData.map(item => item.Date),
      ...userScores.map(item => item.Date),
    ];
    
    if (allDates.length > 0) {
      const latestDate = new Date(
        Math.max(...allDates.map(d => new Date(d).getTime()))
      );
      return new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
    }
    return new Date();
  }, [sleepData, userScores]);

  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const { availableDates, dateScoreMap, dateRange } = useMemo(() => {
    const dates = new Set([
      ...sleepData.map(item => item.Date),
      ...userScores.map(item => item.Date),
    ]);

    const scoreMap = new Map<string, UserScore>();
    userScores.forEach(score => {
      scoreMap.set(score.Date, score);
    });

    const range = getDateRange(Array.from(dates));

    return {
      availableDates: dates,
      dateScoreMap: scoreMap,
      dateRange: range,
    };
  }, [sleepData, userScores]);

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + (direction === "next" ? 1 : -1));
      return newMonth;
    });
  }, []);

  const navigateToMonth = useCallback((date: Date) => {
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }, []);

  const handleQuickNavigation = useCallback((type: 'first' | 'last' | 'current') => {
    const today = new Date();
    
    switch (type) {
      case 'first':
        if (dateRange) {
          navigateToMonth(dateRange.start);
        }
        break;
      case 'last':
        if (dateRange) {
          navigateToMonth(dateRange.end);
        }
        break;
      case 'current':
        navigateToMonth(today);
        break;
    }
  }, [dateRange, navigateToMonth]);

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
      const hasData = availableDates.has(dateString);
      const scoreData = dateScoreMap.get(dateString);
      const isToday = isSameDay(currentDate, today);

      days.push({
        date: new Date(currentDate),
        dateString,
        day: currentDate.getDate(),
        isCurrentMonth,
        hasData,
        scoreData,
        isToday,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [currentMonth, availableDates, dateScoreMap]);

  const handleDateClick = useCallback((dayInfo: DayInfo) => {
    if (dayInfo.isCurrentMonth) {
      onDateSelect(dayInfo.dateString);
    }
  }, [onDateSelect]);

  const getScoreIndicatorColor = useCallback((dayInfo: DayInfo) => {
    if (!dayInfo.hasData) return null;
    
    if (dayInfo.scoreData) {
      const scoreType = dayInfo.scoreData.ScoreType;
      return `${getScoreColor(scoreType)}.main`;
    }
    
    return "primary.main"; 
  }, []);

  if (loading) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday color="primary" />
            <Typography variant="h6">Select Date</Typography>
              <Chip
                label={`${availableDates.size} days recorded`}
                size="small"
              />
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="First data">
              <IconButton 
                size="small" 
                onClick={() => handleQuickNavigation('first')}
                disabled={!dateRange}
              >
                <FirstPage fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Today">
              <IconButton 
                size="small" 
                onClick={() => handleQuickNavigation('current')}
              >
                <CalendarToday fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Latest data">
              <IconButton 
                size="small" 
                onClick={() => handleQuickNavigation('last')}
                disabled={!dateRange}
              >
                <LastPage fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <IconButton onClick={() => navigateMonth("prev")} size="small">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" fontWeight="600">
            {getMonthYear(currentMonth)}
          </Typography>
          <IconButton onClick={() => navigateMonth("next")} size="small">
            <ChevronRight />
          </IconButton>
        </Box>

        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
              mb: 1,
            }}
          >
            {WEEK_DAYS.map((day) => (
              <Box
                key={day}
                sx={{
                  textAlign: "center",
                  py: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                {day}
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
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
                          year: "numeric" 
                        })}${
                          dayInfo.hasData
                            ? dayInfo.scoreData
                              ? ` - Score: ${dayInfo.scoreData.VitalzScore} (${formatScoreType(dayInfo.scoreData.ScoreType)})`
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
                      height: 56,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: (dayInfo.hasData || dayInfo.isCurrentMonth) ? "pointer" : "default",
                      backgroundColor: dayInfo.isToday ? "primary.light" : "transparent",
                      border: dayInfo.isToday ? "2px solid" : "1px solid",
                      borderColor: dayInfo.isToday ? "primary.main" : "divider",
                      borderRadius: 2,
                      opacity: dayInfo.isCurrentMonth ? 1 : 0.3,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": (dayInfo.hasData || dayInfo.isCurrentMonth) ? {
                        backgroundColor: dayInfo.isToday ? "primary.light" : "action.hover",
                        transform: dayInfo.hasData ? "scale(1.05)" : "none",
                        boxShadow: dayInfo.hasData ? 2 : 0,
                      } : {},
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: dayInfo.isToday 
                          ? 600 
                          : dayInfo.hasData 
                            ? 500 
                            : 400,
                        color: dayInfo.isToday
                          ? "primary.contrastText"
                          : dayInfo.isCurrentMonth
                          ? "text.primary"
                          : "text.disabled",
                      }}
                    >
                      {dayInfo.day}
                    </Typography>

                    {dayInfo.hasData && indicatorColor && (
                      <FiberManualRecord
                        sx={{
                          fontSize: 10,
                          color: indicatorColor,
                          mt: 0.5,
                        }}
                      />
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Legend:
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FiberManualRecord sx={{ fontSize: 8, color: "success.main" }} />
              <Typography variant="caption">Excellent (80+)</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FiberManualRecord sx={{ fontSize: 8, color: "warning.main" }} />
              <Typography variant="caption">Moderate (40-79)</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FiberManualRecord sx={{ fontSize: 8, color: "error.main" }} />
              <Typography variant="caption">Poor (&lt;40)</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FiberManualRecord sx={{ fontSize: 8, color: "primary.main" }} />
              <Typography variant="caption">Data Available</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};