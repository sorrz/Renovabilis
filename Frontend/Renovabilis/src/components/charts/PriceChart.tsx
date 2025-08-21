import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Paper, Typography, Box, Grid } from '@mui/material';

interface PriceChartProps {
  data: any[];
  title: string;
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, title, height = 350 }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: 'öre/kWh', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)} öre/kWh`, '']}
              labelStyle={{ color: '#000' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="SE1" 
              stroke="#4caf50" 
              strokeWidth={3}
              name="SE1 (Norra Sverige)"
            />
            <Line 
              type="monotone" 
              dataKey="SE2" 
              stroke="#2196f3" 
              strokeWidth={3}
              name="SE2 (Norra Mellansverige)"
            />
            <Line 
              type="monotone" 
              dataKey="SE3" 
              stroke="#ff9800" 
              strokeWidth={3}
              name="SE3 (Södra Mellansverige)"
            />
            <Line 
              type="monotone" 
              dataKey="SE4" 
              stroke="#f44336" 
              strokeWidth={3}
              name="SE4 (Södra Sverige)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export const PriceBarChart: React.FC<PriceChartProps> = ({ data, title, height = 300 }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="gridArea" />
            <YAxis label={{ value: 'öre/kWh', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)} öre/kWh`, 'Aktuellt pris']}
            />
            <Bar dataKey="currentPriceNumeric" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PriceChart;
