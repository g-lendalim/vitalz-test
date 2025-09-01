export interface User {
  ID: string;
  LoginEmail: string;
  UserName: string;
  DeviceCompany: string;
  DeviceUserID: string;
}

export interface UserInfoCardProps {
  user: User;
}

export interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconColor: string;
  copyable?: boolean;
  monospace?: boolean;
}

export interface StatusItemProps {
  label: string;
  value: string;
  color: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export interface SleepData {
  LoginEmail: string;
  DeviceUserID: string;
  Date: string;
  SleepOnset: string;
  WakeUpTime: string;
  Awake: string;
  Deep: string;
  Light: string;
  TotalTimeAsleep: string;
}

export interface UserScore {
  LoginEmail: string;
  DeviceUserID: string;
  Date: string;
  VitalzScore: number;
  ScoreType: string;
}

export interface UserStatistics {
  LoginEmail: string;
  DeviceUserID: string;
  Date: string;
  Time: string;
  HR: number;
  HRV: number;
  OxygenSaturation: number;
}

export interface ApiResponse<T> {
  status: number;
  data: T[];
}