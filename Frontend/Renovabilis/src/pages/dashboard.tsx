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
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import BoltIcon from '@mui/icons-material/Bolt';

interface EnergyData {
  id: number;
  timestamp: string;
  consumptionKwh: number;
  productionKwh: number;
  pricePerKwh: number;
  gridAreaId: number;
  gridArea: {
    id: number;
    name: string;
    code: string;
  };
}

interface PriceData {
  gridArea: string;
  price: number;
  currency: string;
  timestamp: string;
  unit: string;
}

const Dashboard: React.FC = () => {
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [energyResponse, priceResponse] = await Promise.all([
          fetch('http://localhost:5054/api/energydata'),
          fetch('http://localhost:5054/api/price/all-areas')
        ]);

        if (!energyResponse.ok || !priceResponse.ok) {
          throw new Error('API responded with error');
        }

        const energyResult = await energyResponse.json();
        const priceResult = await priceResponse.json();
        
        setEnergyData(energyResult);
        setPriceData(priceResult);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Kunde inte hämta data från API:et');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalConsumption = energyData.reduce((sum, data) => sum + data.consumptionKwh, 0);
  const totalProduction = energyData.reduce((sum, data) => sum + data.productionKwh, 0);
  const averagePrice = priceData.length > 0 ? priceData.reduce((sum, data) => sum + data.price, 0) / priceData.length : 0;
  const efficiency = totalConsumption > 0 ? (totalProduction / totalConsumption * 100) : 0;

  if (error) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
            <Typography variant="h6">{error}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Kontrollera att API:et körs på localhost:5054
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <ElectricBoltIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Renovabilis Energy Dashboard
          </Typography>
          <Chip 
            label="Live Data" 
            sx={{ mr: 2, backgroundColor: '#4caf50', color: 'white' }} 
            size="small"
          />
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <Avatar sx={{ ml: 1, backgroundColor: '#ff4081' }}>L</Avatar>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {loading ? (
          <Typography variant="h6" textAlign="center">
            Laddar energidata...
          </Typography>
        ) : (
          <>
            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Total Förbrukning
                        </Typography>
                        <Typography variant="h4" component="div">
                          {(totalConsumption / 1000).toFixed(1)}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          MWh idag
                        </Typography>
                      </Box>
                      <BoltIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)', color: 'white' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Förnybar Produktion
                        </Typography>
                        <Typography variant="h4" component="div">
                          {(totalProduction / 1000).toFixed(1)}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          MWh idag
                        </Typography>
                      </Box>
                      <ElectricBoltIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Genomsnittspris
                        </Typography>
                        <Typography variant="h4" component="div">
                          {averagePrice.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          öre/kWh
                        </Typography>
                      </Box>
                      <BoltIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', color: 'white' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Effektivitet
                        </Typography>
                        <Typography variant="h4" component="div">
                          {efficiency.toFixed(0)}%
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Produktion/Förbrukning
                        </Typography>
                      </Box>
                      <ElectricBoltIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Price Data */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Svenska Elpriser (Realtid)
              </Typography>
              <Grid container spacing={2}>
                {priceData.map((data) => (
                  <Grid item xs={6} md={3} key={data.gridArea}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {data.gridArea}
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {data.price.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          öre/kWh
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Recent Energy Data */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Senaste Energidata
              </Typography>
              {energyData.slice(-5).reverse().map((data) => (
                <Box key={data.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
                  <Box>
                    <Typography variant="body1">
                      {data.gridArea.code} - {data.gridArea.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(data.timestamp).toLocaleString('sv-SE')}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1">
                      {data.consumptionKwh.toFixed(0)} kWh förbrukning
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {data.pricePerKwh.toFixed(1)} öre/kWh
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;