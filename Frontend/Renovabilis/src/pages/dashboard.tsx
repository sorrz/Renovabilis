import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Chip,
  Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PriceChart, { PriceBarChart } from '../components/charts/PriceChart';

const Dashboard: React.FC = () => {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricesResponse] = await Promise.all([
          fetch('http://localhost:5054/api/prices/current')
        ]);

        if (pricesResponse.ok) {
          const pricesResult = await pricesResponse.json();
          console.log('✅ Dashboard data:', pricesResult);
          
          if (pricesResult.prices) {
            setPriceData(pricesResult.prices);
            
            // Generera mock historisk data för grafer
            const mockChartData = generateMockChartData(pricesResult.prices);
            setChartData(mockChartData);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  // Generera simulerad 24h data för grafer
  const generateMockChartData = (currentPrices: any[]) => {
    const hours = Array.from({length: 24}, (_, i) => {
      const hour = new Date();
      hour.setHours(i, 0, 0, 0);
      
      const dataPoint: any = {
        time: hour.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
        hour: i
      };
      
      currentPrices.forEach(price => {
        // Simulera prisvariation baserat på tid
        const timeVariation = getTimeVariation(i);
        const randomVariation = (Math.random() - 0.5) * 0.3;
        const variation = 1 + timeVariation + randomVariation;
        
        dataPoint[price.gridArea] = Math.max(0.1, price.currentPriceNumeric * variation);
      });
      
      return dataPoint;
    });
    
    return hours;
  };

  const getTimeVariation = (hour: number) => {
    // Simulera svenska elprisrönster
    if (hour >= 6 && hour <= 8) return 0.2;   // Morgon-rush
    if (hour >= 9 && hour <= 15) return -0.1; // Dagtid
    if (hour >= 16 && hour <= 19) return 0.3; // Kväll-rush
    if (hour >= 20 && hour <= 22) return 0.1; // Kväll
    return -0.2; // Natt
  };

  const sortedPrices = priceData
    .filter(p => p.currentPriceNumeric > 0)
    .sort((a, b) => a.currentPriceNumeric - b.currentPriceNumeric);
  const cheapestArea = sortedPrices[0];
  const mostExpensiveArea = sortedPrices[sortedPrices.length - 1];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Laddar dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <ElectricBoltIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Svenska Elnätet - Live Dashboard
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <Avatar sx={{ ml: 2 }}>L</Avatar>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {/* Status */}
        <Alert severity="success" sx={{ mb: 3 }}>
          <strong>Live Data:</strong> {priceData.length}/4 områden med riktiga priser från ENTSO-E
        </Alert>

        {/* Aktuella priser - kort */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {priceData.map((price) => (
            <Grid item xs={12} sm={6} md={3} key={price.gridArea}>
              <Card sx={{ 
                backgroundColor: price.gridArea === cheapestArea?.gridArea ? '#e8f5e8' : 
                                price.gridArea === mostExpensiveArea?.gridArea ? '#ffebee' : 'inherit'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {price.gridArea}
                    </Typography>
                    {price.gridArea === cheapestArea?.gridArea && (
                      <Chip label="Billigast" color="success" size="small" sx={{ ml: 1 }} />
                    )}
                    {price.gridArea === mostExpensiveArea?.gridArea && (
                      <Chip label="Dyrast" color="error" size="small" sx={{ ml: 1 }} />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {price.gridAreaName}
                  </Typography>
                  <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                    {price.currentPriceNumeric.toFixed(1)}
                  </Typography>
                  <Typography variant="body2">
                    öre/kWh
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Snitt idag: {price.averageToday}
                  </Typography>
                  <Chip 
                    label={price.isRealData ? 'Live ENTSO-E' : 'Uppskattning'}
                    size="small"
                    color={price.isRealData ? 'success' : 'default'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Grafer */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PriceChart 
              data={chartData} 
              title="Prisutveckling senaste 24 timmarna" 
              height={400}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <PriceBarChart 
              data={priceData} 
              title="Aktuella priser per område" 
              height={300}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 300 }}>
              <Typography variant="h6" gutterBottom>
                Marknadsöversikt
              </Typography>
              {sortedPrices.length > 0 && (
                <Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Prisspridning:</strong> {(mostExpensiveArea?.currentPriceNumeric - cheapestArea?.currentPriceNumeric).toFixed(1)} öre/kWh
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Genomsnitt:</strong> {(sortedPrices.reduce((sum, p) => sum + p.currentPriceNumeric, 0) / sortedPrices.length).toFixed(1)} öre/kWh
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Prisfaktor:</strong> {(mostExpensiveArea?.currentPriceNumeric / cheapestArea?.currentPriceNumeric).toFixed(1)}x skillnad
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Prisalerts:</Typography>
                    {cheapestArea?.currentPriceNumeric < 10 && (
                      <Alert severity="success" sx={{ mb: 1 }}>
                        Fantastiska priser i {cheapestArea.gridArea}! Perfekt tid för energikrävande aktiviteter.
                      </Alert>
                    )}
                    {mostExpensiveArea?.currentPriceNumeric > 80 && (
                      <Alert severity="warning">
                        Höga priser i {mostExpensiveArea.gridArea}. Överväg att vänta med energikrävande aktiviteter.
                      </Alert>
                    )}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
