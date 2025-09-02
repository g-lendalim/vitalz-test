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
  ContentCopy
} from "@mui/icons-material";
import type {
  InfoRowProps,
  UserInfoCardProps,
} from "../index";

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    p: 3,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 3,
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
    },
  },
  iconWrapper: {
    p: 1.5,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 3,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  icon: {
    color: "white",
    fontSize: "1.4rem",
  },
  label: {
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontSize: "0.75rem",
    color: "rgba(0, 0, 0, 0.6)",
  },
  value: {
    fontWeight: 500,
    mt: 1,
    wordBreak: "break-all",
    fontSize: "1.1rem",
    lineHeight: 1.4,
  },
  copyBtn: {
    opacity: 0.7,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "10px",
    "&:hover": {
      opacity: 1,
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      transform: "scale(1.15)",
    },
  },
};

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  iconColor = "#1976d2",
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
        <Typography variant="caption" sx={styles.label}>
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            ...styles.value,
            fontFamily: monospace
              ? "'JetBrains Mono', 'Monaco', 'Consolas', monospace"
              : "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: monospace ? "0.95rem" : "1.1rem",
            fontWeight: monospace ? 600 : 500,
          }}
        >
          {value}
        </Typography>
      </Box>

      {copyable && (
        <IconButton size="medium" onClick={copyToClipboard} sx={styles.copyBtn}>
          <ContentCopy fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

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
      iconColor: "#ff9800",
      monospace: false,
    },
    {
      icon: <Badge />,
      label: "User ID",
      value: user.ID,
      iconColor: "#9c27b0",
      monospace: true,
    },
    {
      icon: <DeviceHub />,
      label: "Device ID",
      value: user.DeviceUserID,
      iconColor: "#4caf50",
      monospace: true,
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        background:
          "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        position: "relative",
        overflow: "visible",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow:
          "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            "0 12px 35px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 3,
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Person sx={{ color: "white", fontSize: "2.2rem" }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="700" color="text.primary">
              {user.UserName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Health Dashboard Profile
            </Typography>
          </Box>

          <Chip
            icon={<Watch sx={{ fontSize: "1.1rem !important" }} />}
            label={user.DeviceCompany}
            color={getDeviceColor(user.DeviceCompany)}
            variant="filled"
            sx={{
              p: 1.5,
              fontWeight: 700,
              height: "auto",
              borderRadius: "12px",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              "& .MuiChip-icon": {
                fontSize: "2rem",
              },
            }}
          />
        </Box>

        <Divider
          sx={{ mb: 4, opacity: 0.6, borderColor: "rgba(0, 0, 0, 0.12)" }}
        />

        <Box sx={{ display: "grid", gap: 3 }}>
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
      </CardContent>
    </Card>
  );
};