import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Divider,
  IconButton,
  SvgIcon,
} from "@mui/material";
import {
  Person,
  Watch,
  DeviceHub,
  Email,
  Badge,
  ContentCopy,
} from "@mui/icons-material";
import type {
  InfoRowProps,
  StatusItemProps,
  UserInfoCardProps,
} from "../index";

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    p: 2,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 2,
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  },
  iconWrapper: {
    p: 1,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 2,
  },
  icon: {
    color: "white",
    fontSize: "1.2rem",
  },
  label: {
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  value: {
    fontWeight: 500,
    mt: 0.5,
    wordBreak: "break-all",
  },
  copyBtn: {
    opacity: 0.6,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      opacity: 1,
      backgroundColor: "rgba(0, 0, 0, 0.08)",
      transform: "scale(1.1)",
    },
  },
};

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  iconColor = "#1976d2", // default color
  copyable = true,
  monospace = false,
}) => {
  const copyToClipboard = () => navigator.clipboard.writeText(value);

  return (
    <Box sx={styles.container}>
      {icon && (
        <Box sx={{ ...styles.iconWrapper, backgroundColor: iconColor }}>
          <SvgIcon sx={styles.icon}>{icon}</SvgIcon>
        </Box>
      )}

      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={styles.label}>
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            ...styles.value,
            fontFamily: monospace ? "monospace" : "inherit",
            fontSize: monospace ? "0.9rem" : "1rem",
          }}
        >
          {value}
        </Typography>
      </Box>

      {copyable && (
        <IconButton size="small" onClick={copyToClipboard} sx={styles.copyBtn}>
          <ContentCopy fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

const StatusItem: React.FC<StatusItemProps> = ({ label, value, color }) => (
  <Box sx={{ textAlign: "center" }}>
    <Typography
      variant="h3"
      fontWeight="900"
      color={`${color}.main`}
      sx={{
        fontSize: "1.3rem",
        mb: 0.5,
        letterSpacing: "0.5px",
      }}
    >
      {value}
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        fontWeight: 500,
        fontSize: "0.875rem",
        opacity: 0.8,
      }}
    >
      {label}
    </Typography>
  </Box>
);

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  const getDeviceColor = (
    company: string
  ): "primary" | "secondary" | "success" | "warning" | "error" => {
    const lowerCompany = company.toLowerCase();
    if (lowerCompany.includes("biostrap")) return "primary";
    if (lowerCompany.includes("ido")) return "secondary";
    if (lowerCompany.includes("oura")) return "success";
    if (lowerCompany.includes("sbring")) return "warning";
    return "primary";
  };

  const infoRows = [
    {
      icon: <Email />,
      label: "Email Address",
      value: user.LoginEmail,
      iconColor: "warning.main",
      monospace: false,
    },
    {
      icon: <Badge />,
      label: "User ID",
      value: user.ID,
      iconColor: "secondary.main",
      monospace: true,
    },
    {
      icon: <DeviceHub />,
      label: "Device ID",
      value: user.DeviceUserID,
      iconColor: "success.main",
      monospace: true,
    },
  ];

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
        overflow: "visible",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Person sx={{ color: "white", fontSize: "2rem" }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              fontWeight="700"
              color="text.primary"
              sx={{
                letterSpacing: "-0.5px",
                mb: 0.5,
              }}
            >
              {user.UserName}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                opacity: 0.8,
              }}
            >
              Health Dashboard Profile
            </Typography>
          </Box>

          <Chip
            icon={<Watch />}
            label={user.DeviceCompany}
            color={getDeviceColor(user.DeviceCompany)}
            variant="filled"
            sx={{
              p: 1,
              fontWeight: 600,
              boxShadow: 2,
              fontSize: "0.875rem",
              "& .MuiChip-icon": {
                fontSize: "1rem",
              },
            }}
          />
        </Box>

        <Divider sx={{ mb: 3, opacity: 0.7 }} />
        <Box sx={{ display: "grid", gap: 2 }}>
          {infoRows.map((row, index) => (
            <InfoRow
              key={index}
              icon={row.icon}
              label={row.label}
              value={row.value}
              iconColor={row.iconColor}
              monospace={row.monospace}
            />
          ))}
        </Box>
        <Box
          sx={{
            mt: 3,
            pt: 3,
            pb: 2,
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: 2,
            mx: -1,
            px: 3,
          }}
        >
          <StatusItem
            label="Status"
            value={user.ID !== null ? "ACTIVE" : "INACTIVE"}
            color="primary"
          />

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              opacity: 0.3,
              height: 40,
              mx: 3,
            }}
          />

          <StatusItem
            label="Device"
            value={user.DeviceUserID !== null ? "CONNECTED" : "DISCONNECTED"}
            color="success"
          />
        </Box>
      </CardContent>
    </Card>
  );
};
