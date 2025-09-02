import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { SleepDataTab } from "./SleepDataTab";
import { UserScoreTab } from "./UserScoreTab";
import { UserStatisticsTab } from "./UserStatisticsTab";
import { formatDate } from "../utils/formatters";
import type { DataModalProps, TabPanelProps } from "../index";

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box
          sx={{
            pt: 3,
            pb: 2,
            px: 1,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};

export const DataModal: React.FC<DataModalProps> = ({
  open,
  onClose,
  date,
  loginEmail,
  deviceUserID,
  sleepData,
  userScores,
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const sleepDataForDate = sleepData.find((item) => item.Date === date);
  const scoreForDate = userScores.find((item) => item.Date === date);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 3,
          px: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                mb: 0.5,
              }}
            >
              {formatDate(date)}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: "0.875rem",
              }}
            >
              Daily Report
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: "#fafbfc" }}>
        <Box
          sx={{
            borderBottom: "2px solid #e1e5e9",
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              px: 4,
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "2px 2px 0 0",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              },
              "& .MuiTab-root": {
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "none",
                letterSpacing: "0.01em",
                minHeight: 56,
                flex: 1,
                maxWidth: "none",
                color: "#6b7280",
                "&.Mui-selected": {
                  color: "#667eea",
                  fontWeight: 700,
                },
                "&:hover": {
                  color: "#4f46e5",
                  backgroundColor: "rgba(102, 126, 234, 0.04)",
                },
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            <Tab label="Sleep Data" />
            <Tab label="User Score" />
            <Tab label="Statistics" />
          </Tabs>
        </Box>

        <Box sx={{ px: 4, py: 2, minHeight: 400 }}>
          <TabPanel value={tabValue} index={0}>
            <SleepDataTab sleepData={sleepDataForDate} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <UserScoreTab userScore={scoreForDate} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <UserStatisticsTab
              loginEmail={loginEmail}
              deviceUserID={deviceUserID}
              date={date}
            />
          </TabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
