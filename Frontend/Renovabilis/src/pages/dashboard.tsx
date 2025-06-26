import React, { useState, useEffect } from 'react';
import { apiService, type EnergyData } from '../services/apiService';

const Dashboard: React.FC = () => {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getEnergyData();
        setEnergyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Renovabilis Energy Dashboard</h1>
      <h2>Nätområden ({energyData.length})</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Område</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Namn</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Temperatur</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Vindstyrka</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Produktion</th>
            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Pris</th>
          </tr>
        </thead>
        <tbody>
          {energyData.map((data) => (
            <tr key={data.id}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{data.gridArea}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{data.areaName}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{data.weatherData.temperature}°C</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{data.weatherData.windSpeed} m/s</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{data.energyProduction.total} MW</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{data.pricePerMWh} SEK/MWh</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;