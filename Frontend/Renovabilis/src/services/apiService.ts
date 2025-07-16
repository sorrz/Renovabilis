// API Service för att hämta data från backend
const API_BASE_URL = 'http://localhost:5054/api';

export interface RenovaBill {
  id: number;
  amount: number;
  dueDate: string;
}

export const apiService = {
  getAllBills: async (): Promise<RenovaBill[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/renovabills`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching bills:', error);
      return [];
    }
  }
};