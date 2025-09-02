<<<<<<< HEAD
import type { User, SleepData, UserScore, UserStatistics, ApiResponse } from './index';

const BASE_URL = '';

class ApiService {
  private async fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getUserList(): Promise<ApiResponse<User>> {
    return this.fetchData<User>('/api/getUserList');
  }

  async getUserSleepData(loginEmail: string, deviceUserID: string): Promise<ApiResponse<SleepData>> {
    const params = new URLSearchParams({
      LoginEmail: loginEmail,
      DeviceUserID: deviceUserID
    });
    return this.fetchData<SleepData>(`/api/getUserSleepData?${params}`);
  }

  async getUserScore(loginEmail: string, deviceUserID: string): Promise<ApiResponse<UserScore>> {
    const params = new URLSearchParams({
      LoginEmail: loginEmail,
      DeviceUserID: deviceUserID
    });
    return this.fetchData<UserScore>(`/api/getUserScore?${params}`);
  }

  async getUserStatistics(loginEmail: string, deviceUserID: string, date: string): Promise<ApiResponse<UserStatistics>> {
    const params = new URLSearchParams({
      LoginEmail: loginEmail,
      DeviceUserID: deviceUserID,
      Date: date
    });
    return this.fetchData<UserStatistics>(`/api/getUserStatics?${params}`);
  }
}

export const apiService = new ApiService();
=======
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
>>>>>>> origin/main
