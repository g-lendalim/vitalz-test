import React, { useState } from "react";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";
import { UserSelector } from "../components/UserSelector";
import { UserInfoCard } from "../components/UserInfoCard";
import { CalendarDateSelector } from "../components/CalendarDateSelector";
import { DataModal } from "../components/DataModal";
import { useUsers } from "../hooks/useApi";
import { useUserData } from "../hooks/useUserData";
import type { User } from "../index";

export const Dashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  const { users, loading: usersLoading, error: usersError } = useUsers();

  const {
    sleepData,
    userScores,
    loading: userDataLoading,
    error: userDataError,
  } = useUserData(
    selectedUser?.LoginEmail || "",
    selectedUser?.DeviceUserID || ""
  );

  const handleUserSelect = (user: User | null) => {
    setSelectedUser(user);
    setSelectedDate("");
    setModalOpen(false);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Vitalz Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Monitor user health metrics and sleep patterns
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{xs:12}}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select User
            </Typography>
            <UserSelector
              users={users}
              selectedUser={selectedUser}
              onUserSelect={handleUserSelect}
              loading={usersLoading}
              error={usersError}
            />
          </Paper>
        </Grid>

        {selectedUser && (
          <>
            <Grid size={{xs:12, md:5}} >
              <UserInfoCard user={selectedUser} />
            </Grid>

            <Grid size={{xs:12, md:7}} >
              <CalendarDateSelector
                sleepData={sleepData}
                userScores={userScores}
                onDateSelect={handleDateSelect}
                loading={userDataLoading}
                error={userDataError}
              />
            </Grid>
          </>
        )}
      </Grid>

      <DataModal
        open={modalOpen}
        onClose={handleModalClose}
        date={selectedDate}
        sleepData={sleepData}
      />
    </Container>
  );
};
