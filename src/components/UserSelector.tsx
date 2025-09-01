import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { User } from "../index";

interface UserSelectorProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User | null) => void;
  loading: boolean;
  error: string | null;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUser,
  onUserSelect,
  loading,
  error,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const userId = event.target.value;
    const user = users.find((u) => u.ID === userId) || null;
    onUserSelect(user);
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="user-select-label">Select User</InputLabel>
      <Select
        labelId="user-select-label"
        value={selectedUser?.ID || ""}
        label="Select User"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {users.map((user) => (
          <MenuItem key={user.ID} value={user.ID}>
            {user.UserName} ({user.LoginEmail})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
