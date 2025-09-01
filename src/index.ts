export interface User {
  ID: string;
  LoginEmail: string;
  UserName: string;
  DeviceCompany: string;
  DeviceUserID: string;
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