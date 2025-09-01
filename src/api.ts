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