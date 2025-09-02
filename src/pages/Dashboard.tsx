import { useState } from "react";
import { Container, Typography, Box, Grid, Paper } from "@mui/material";
import { PersonPin } from "@mui/icons-material";
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
    <Box
      sx={{
        width: "100vw",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 5,
      }}
    >
      <Container>
        <Box
          sx={{
            mb: 5,
            textAlign: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "relative",
              mb: 2,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 1000,
                fontSize: "3rem",
                lineHeight: 1.1,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                position: "relative",
                textShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
              }}
            >
              Vitalz Dashboard
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#64748b",
              fontWeight: 400,
              letterSpacing: "0.01em",
              mx: "auto",
            }}
          >
            Monitor user health metrics and sleep patterns with advanced
            analytics
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#1e293b",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 28,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 1,
                    }}
                  />
                  Select User
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    ml: 3,
                  }}
                >
                  Choose a user to view their health analytics and sleep data
                </Typography>
              </Box>
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
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    "& > *": {
                      height: "100%",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                      },
                    },
                  }}
                >
                  <UserInfoCard user={selectedUser} />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                    },
                  }}
                >
                  <CalendarDateSelector
                    sleepData={sleepData}
                    userScores={userScores}
                    onDateSelect={handleDateSelect}
                    loading={userDataLoading}
                    error={userDataError}
                  />
                </Paper>
              </Grid>
            </>
          )}

          {!selectedUser && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  px: 4,
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.6)",
                  backdropFilter: "blur(20px)",
                  border: "2px dashed rgba(102, 126, 234, 0.3)",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                    opacity: 0.8,
                  }}
                >
                  <Typography variant="h3" sx={{ color: "white" }}>
                    <PersonPin sx={{ fontSize: "3rem", marginTop: "12px" }} />
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    mb: 3,
                    fontSize: { xs: "1.75rem", md: "2.125rem" },
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  Welcome to Vitalz Dashboard
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#64748b",
                    maxWidth: "500px",
                    mx: "auto",
                    lineHeight: 1.6,
                  }}
                >
                  Select a user from the dropdown above to start exploring their
                  health metrics, sleep patterns, and detailed analytics.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <DataModal
          open={modalOpen}
          onClose={handleModalClose}
          date={selectedDate}
          loginEmail={selectedUser?.LoginEmail || ""}
          deviceUserID={selectedUser?.DeviceUserID || ""}
          sleepData={sleepData}
          userScores={userScores}
        />
      </Container>
    </Box>
  );
};
