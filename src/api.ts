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

const API_BASE = "https://exam-vitalz-backend-8267f8929b82.herokuapp.com/api";

export const apiService = {
  async getUserList(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/getUserList`);
    const data = await response.json();
    return data.data || [];
  },

  async getUserSleepData(
    loginEmail: string,
    deviceUserID: string
  ): Promise<SleepData[]> {
    const response = await fetch(
      `${API_BASE}/getUserSleepData?LoginEmail=${loginEmail}&DeviceUserID=${deviceUserID}`
    );
    const data = await response.json();
    return data.data || [];
  },

  async getUserScore(
    loginEmail: string,
    deviceUserID: string
  ): Promise<UserScore[]> {
    const response = await fetch(
      `${API_BASE}/getUserScore?LoginEmail=${loginEmail}&DeviceUserID=${deviceUserID}`
    );
    const data = await response.json();
    return data.data || [];
  },

  async getUserStatistics(
    loginEmail: string,
    deviceUserID: string,
    date: string
  ): Promise<UserStatistics[]> {
    const response = await fetch(
      `${API_BASE}/getUserStatics?LoginEmail=${loginEmail}&DeviceUserID=${deviceUserID}&Date=${date}`
    );
    const data = await response.json();
    return data.data || [];
  },
};
