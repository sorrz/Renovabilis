import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const areas = ['SE1', 'SE2', 'SE3', 'SE4'];
const timeRanges = ['24h', '1W', '1M'];

//Data per område & tidsintervall
const allData = {
  SE1: {
    '24h': [
      { time: '00:00', forecast: 10, actual: 9 },
      { time: '06:00', forecast: 12, actual: 11 },
      { time: '12:00', forecast: 15, actual: 14 },
      { time: '18:00', forecast: 13, actual: 12 },
    ],
    '1W': [
      { time: 'Mån', forecast: 70, actual: 65 },
      { time: 'Tis', forecast: 75, actual: 72 },
      { time: 'Ons', forecast: 80, actual: 78 },
      { time: 'Tor', forecast: 74, actual: 70 },
      { time: 'Fre', forecast: 77, actual: 76 },
      { time: 'Lör', forecast: 73, actual: 70 },
      { time: 'Sön', forecast: 68, actual: 66 },
    ],
    '1M': [
      { time: 'Vecka 1', forecast: 300, actual: 290 },
      { time: 'Vecka 2', forecast: 320, actual: 315 },
      { time: 'Vecka 3', forecast: 310, actual: 305 },
      { time: 'Vecka 4', forecast: 305, actual: 300 },
    ],
  },
  SE2: {
    '24h': [
      { time: '00:00', forecast: 8, actual: 7 },
      { time: '06:00', forecast: 9, actual: 10 },
      { time: '12:00', forecast: 11, actual: 11 },
      { time: '18:00', forecast: 10, actual: 9 },
    ],
    '1W': [
      { time: 'Mån', forecast: 60, actual: 62 },
      { time: 'Tis', forecast: 64, actual: 65 },
      { time: 'Ons', forecast: 70, actual: 68 },
      { time: 'Tor', forecast: 66, actual: 65 },
      { time: 'Fre', forecast: 67, actual: 66 },
      { time: 'Lör', forecast: 63, actual: 64 },
      { time: 'Sön', forecast: 59, actual: 60 },
    ],
    '1M': [
      { time: 'Vecka 1', forecast: 280, actual: 275 },
      { time: 'Vecka 2', forecast: 295, actual: 290 },
      { time: 'Vecka 3', forecast: 285, actual: 280 },
      { time: 'Vecka 4', forecast: 290, actual: 288 },
    ],
  },
  SE3: {
    '24h': [
      { time: '00:00', forecast: 8, actual: 7 },
      { time: '06:00', forecast: 9, actual: 10 },
      { time: '12:00', forecast: 11, actual: 11 },
      { time: '18:00', forecast: 10, actual: 9 },
    ],
    '1W': [
      { time: 'Mån', forecast: 60, actual: 62 },
      { time: 'Tis', forecast: 64, actual: 65 },
      { time: 'Ons', forecast: 70, actual: 68 },
      { time: 'Tor', forecast: 66, actual: 65 },
      { time: 'Fre', forecast: 67, actual: 66 },
      { time: 'Lör', forecast: 63, actual: 64 },
      { time: 'Sön', forecast: 59, actual: 60 },
    ],
    '1M': [
      { time: 'Vecka 1', forecast: 280, actual: 275 },
      { time: 'Vecka 2', forecast: 295, actual: 290 },
      { time: 'Vecka 3', forecast: 285, actual: 280 },
      { time: 'Vecka 4', forecast: 290, actual: 288 },
    ],
  },
  SE4: {
    '24h': [
      { time: '00:00', forecast: 8, actual: 7 },
      { time: '06:00', forecast: 9, actual: 10 },
      { time: '12:00', forecast: 11, actual: 11 },
      { time: '18:00', forecast: 10, actual: 9 },
    ],
    '1W': [
      { time: 'Mån', forecast: 60, actual: 62 },
      { time: 'Tis', forecast: 64, actual: 65 },
      { time: 'Ons', forecast: 70, actual: 68 },
      { time: 'Tor', forecast: 66, actual: 65 },
      { time: 'Fre', forecast: 67, actual: 66 },
      { time: 'Lör', forecast: 63, actual: 64 },
      { time: 'Sön', forecast: 59, actual: 60 },
    ],
    '1M': [
      { time: 'Vecka 1', forecast: 280, actual: 275 },
      { time: 'Vecka 2', forecast: 295, actual: 290 },
      { time: 'Vecka 3', forecast: 285, actual: 280 },
      { time: 'Vecka 4', forecast: 290, actual: 288 },
    ],
  },
};

export default function Dashboard() {
  const [count, setCount] = useState(0);
  const [selectedArea, setSelectedArea] = useState('SE1');
  const [selectedTime, setSelectedTime] = useState('24h');

  const [tempArea, setTempArea] = useState(selectedArea);
  const [tempTime, setTempTime] = useState(selectedTime);

  const [chartData, setChartData] = useState(
    allData[selectedArea][selectedTime]);

  useEffect(() => {
    setChartData(allData[selectedArea] [selectedTime] || []);
  }, [selectedArea, selectedTime]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControl size="small">
          <InputLabel
            id="area-label"
            shrink
            sx={{
              color: 'white',
              top: '-6px',
              '&.Mui-focused': {
                color: 'white',
              },
            }}
          >
            Område
          </InputLabel>
          <Select
            labelId="area-label"
            id="area-select"
            value={tempArea}
            label="Område"
            size="small"
            onChange={(e) => setTempArea(e.target.value)}
            sx={{
              minWidth: 100,
              backgroundColor: '#1976d2',
              color: 'white',
              '& .MuiSvgIcon-root': { color: 'white' },
            }}
          >
            {areas.map((area) => (
              <MenuItem key={area} value={area}>
                {area}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel
            id="time-label"
            shrink
            sx={{
              color: 'white',
              top: '-6px',
              '&.Mui-focused': {
                color: 'white',
              },
            }}
          >
            Tidsintervall
          </InputLabel>
          <Select
            labelId="time-label"
            id="time-select"
            value={tempTime}
            label="Tidsintervall"
            size="small"
            onChange={(e) => setTempTime(e.target.value)}
            sx={{
              minWidth: 120,
              backgroundColor: '#1976d2',
              color: 'white',
              '& .MuiSvgIcon-root': { color: 'white' },
            }}
          >
            {timeRanges.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={() => {
            setSelectedArea(tempArea);
            setSelectedTime(tempTime);
          }}
          sx={{
            color: '#1976d2',
            borderColor: '#1976d2',
            '&:hover': {
              color: 'white',
            },
          }}
        >
          Apply
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Produktion i {selectedArea} senaste {selectedTime}
      </Typography>

      <Typography>Counter: {count}</Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 4, justifyContent: 'center' }} justifyContent="center">
        <Button variant="contained" onClick={() => setCount(count + 1)}>
          Increment
        </Button>
        <Button variant="contained" onClick={() => setCount(count - 1)}>
          Decrement
        </Button>
        <Button variant="outlined" onClick={() => setCount(0)}      sx={{
            color: '#1976d2',
            borderColor: '#1976d2',
            '&:hover': {
              color: 'white',
            },
          }}>
          Reset
        </Button>
      </Stack>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} style={{ backgroundColor: 'rgb(255, 255, 255)'}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Prognos"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#82ca9d"
            name="Verklighet"
          />
        </LineChart>
      </ResponsiveContainer>
    </Container>
  );
}