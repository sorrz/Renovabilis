// src/services/apiService.ts
const API_BASE_URL = 'http://localhost:5054/api';

export interface EnergyData {
  id: number;
  gridArea: string;
  areaName: string;
  timestamp: string;
  weatherData: {
    temperature: number;
    windSpeed: number;
    cloudCover: number;
    humidity: number;
  };
  energyProduction: {
    wind: number;
    solar: number;
    hydro: number;
    total: number;
  };
  energyConsumption: {
    residential: number;
    industrial: number;
    commercial: number;
    total: number;
  };
  pricePerMWh: number;
}

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET energy data
  async getEnergyData(): Promise<EnergyData[]> {
    return this.fetchApi<EnergyData[]>('/renovabills/energy-data');
  }

  // GET forecast data
  async getForecastData(): Promise<any[]> {
    return this.fetchApi<any[]>('/renovabills/forecast');
  }

  // GET grid areas
  async getGridAreas(): Promise<any[]> {
    return this.fetchApi<any[]>('/renovabills/grid-areas');
  }
}

export const apiService = new ApiService();