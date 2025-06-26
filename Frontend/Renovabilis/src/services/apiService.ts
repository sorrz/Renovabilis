// API Service för att hämta data från backend
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

export const apiService = {
  async getEnergyData(): Promise<EnergyData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/renovabills/energy-data`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching energy data:', error);
      throw error;
    }
  }
};