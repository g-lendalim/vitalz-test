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
import { formatDate } from "../utils/formatters";
import type { DataModalProps, TabPanelProps } from "../index";

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

export const DataModal: React.FC<DataModalProps> = ({
  open,
  onClose,
  date,
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
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Data for {formatDate(date)}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Sleep Data" />
            <Tab label="User Score" />
            <Tab label="Statistics" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <SleepDataTab sleepData={sleepDataForDate} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <UserScoreTab userScore={scoreForDate} />
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};