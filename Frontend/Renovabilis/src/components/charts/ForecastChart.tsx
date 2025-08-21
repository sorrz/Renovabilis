import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, Box, Chip, Alert } from '@mui/material';

interface ForecastChartProps {
  data: any[];
  title: string;
  height?: number;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data, title, height = 400 }) => {
  const hasTomorrowData = data.some(d => d.tomorrowPrice !== null);
  
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Chip 
          label={hasTomorrowData ? "Morgondagens priser tillgängliga" : "Morgondagens priser ej klara"}
          color={hasTomorrowData ? "success" : "warning"}
          size="small"
        />
      </Box>
      
      {!hasTomorrowData && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Morgondagens elpriser publiceras kl 13:00 dagen innan på Nord Pool.
        </Alert>
      )}
      
      <Box sx={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: 'öre/kWh', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value?.toFixed(1) || 'Ej tillgänglig'} öre/kWh`, 
                name === 'todayPrice' ? 'Idag' : 'Imorgon'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="todayPrice" 
              stroke="#1976d2" 
              strokeWidth={3}
              name="Idag (verkliga priser)"
            />
            {hasTomorrowData && (
              <Line 
                type="monotone" 
                dataKey="tomorrowPrice" 
                stroke="#ff9800" 
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Imorgon (prognos)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>
      
      {hasTomorrowData && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            💡 Streckad linje = morgondagens prognostiserade priser från Nord Pool
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ForecastChart;
