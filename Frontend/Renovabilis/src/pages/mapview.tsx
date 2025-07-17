import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, CircleMarker } from 'react-leaflet';
import { Box, Paper, Typography, Card, CardContent, Chip, Container } from '@mui/material';
import { Grid } from '@mui/material';
import 'leaflet/dist/leaflet.css';

interface PriceData {
  gridArea: string;
  price: number;
  currency: string;
  timestamp: string;
  unit: string;
}

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

// Svenska nätområden med ungefärliga koordinater
const swedenGridAreas = {
  SE1: {
    name: "Norra Sverige",
    description: "Luleå och norrut",
    center: [67.8558, 20.2253] as [number, number],
    bounds: [
      [69.0, 11.0], [69.0, 24.0], [64.0, 24.0], [64.0, 11.0], [69.0, 11.0]
    ] as [number, number][],
    color: '#4caf50'
  },
  SE2: {
    name: "Norra Mellansverige", 
    description: "Sundsvall - Gävle",
    center: [62.3908, 17.3069] as [number, number],
    bounds: [
      [64.0, 11.0], [64.0, 24.0], [60.5, 24.0], [60.5, 11.0], [64.0, 11.0]
    ] as [number, number][],
    color: '#2196f3'
  },
  SE3: {
    name: "Södra Mellansverige",
    description: "Stockholm - Göteborg", 
    center: [59.3293, 18.0686] as [number, number],
    bounds: [
      [60.5, 11.0], [60.5, 24.0], [55.5, 24.0], [55.5, 11.0], [60.5, 11.0]
    ] as [number, number][],
    color: '#ff9800'
  },
  SE4: {
    name: "Södra Sverige",
    description: "Malmö och söderut",
    center: [55.6050, 13.0038] as [number, number], 
    bounds: [
      [55.5, 11.0], [55.5, 24.0], [55.0, 24.0], [55.0, 11.0], [55.5, 11.0]
    ] as [number, number][],
    color: '#f44336'
  }
};

const MapView: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [priceResponse, energyResponse] = await Promise.all([
          fetch('http://localhost:5054/api/price/all-areas'),
          fetch('http://localhost:5054/api/energydata')
        ]);

        if (priceResponse.ok && energyResponse.ok) {
          const priceResult = await priceResponse.json();
          const energyResult = await energyResponse.json();
          
          setPriceData(priceResult);
          setEnergyData(energyResult);
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000); // Uppdatera varje 2 minuter
    return () => clearInterval(interval);
  }, []);

  // Hämta pris för specifikt område
  const getPriceForArea = (areaCode: string): number => {
    const priceInfo = priceData.find(p => p.gridArea === areaCode);
    return priceInfo?.price || 0;
  };

  // Hämta senaste energidata för område
  const getEnergyForArea = (areaCode: string): EnergyData | null => {
    return energyData
      .filter(e => e.gridArea.code === areaCode)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] || null;
  };

  // Beräkna färg baserat på pris (grön = billigt, röd = dyrt)
  const getColorForPrice = (price: number): string => {
    if (price < 70) return '#4caf50'; // Grön
    if (price < 80) return '#2196f3'; // Blå
    if (price < 90) return '#ff9800'; // Orange
    return '#f44336'; // Röd
  };

  // Beräkna transparens baserat på pris
  const getOpacityForPrice = (price: number): number => {
    return Math.min(0.3 + (price / 100) * 0.4, 0.7);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🗺️ Energikarta Sverige
        </Typography>
        <Typography variant="h6">
          Laddar kartdata...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        🗺️ Svenska Elnätet - Realtidspriser
      </Typography>

      {/* Prisöversikt */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(swedenGridAreas).map(([code, area]) => {
          const price = getPriceForArea(code);
          const energy = getEnergyForArea(code);
          
          return (
            <Grid item xs={6} md={3} key={code}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedArea === code ? '2px solid #1976d2' : 'none',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => setSelectedArea(selectedArea === code ? null : code)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        backgroundColor: getColorForPrice(price),
                        borderRadius: '50%',
                        mr: 1 
                      }} 
                    />
                    <Typography variant="h6">{code}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {area.name}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {price.toFixed(1)} öre/kWh
                  </Typography>
                  {energy && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Förbrukning: {energy.consumptionKwh.toFixed(0)} kWh
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Karta */}
      <Paper sx={{ height: 600, overflow: 'hidden', borderRadius: 2 }}>
        <MapContainer
          center={[62.0, 15.0]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Rita nätområden */}
          {Object.entries(swedenGridAreas).map(([code, area]) => {
            const price = getPriceForArea(code);
            const energy = getEnergyForArea(code);
            const isSelected = selectedArea === code;
            
            return (
              <React.Fragment key={code}>
                {/* Område polygon */}
                <Polygon
                  positions={area.bounds}
                  pathOptions={{
                    fillColor: getColorForPrice(price),
                    weight: isSelected ? 3 : 2,
                    opacity: 1,
                    color: isSelected ? '#1976d2' : '#333',
                    dashArray: isSelected ? '5, 5' : undefined,
                    fillOpacity: getOpacityForPrice(price)
                  }}
                  eventHandlers={{
                    click: () => setSelectedArea(selectedArea === code ? null : code)
                  }}
                >
                  <Popup>
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="h6" gutterBottom>
                        {code} - {area.name}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {area.description}
                      </Typography>
                      <Chip 
                        label={`${price.toFixed(1)} öre/kWh`}
                        color={price < 75 ? 'success' : price < 85 ? 'warning' : 'error'}
                        sx={{ mb: 1 }}
                      />
                      {energy && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            <strong>Förbrukning:</strong> {energy.consumptionKwh.toLocaleString()} kWh
                          </Typography>
                          <Typography variant="body2">
                            <strong>Produktion:</strong> {energy.productionKwh.toLocaleString()} kWh
                          </Typography>
                          <Typography variant="body2">
                            <strong>Effektivitet:</strong> {((energy.productionKwh / energy.consumptionKwh) * 100).toFixed(0)}%
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
                            Uppdaterad: {new Date(energy.timestamp).toLocaleString('sv-SE')}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Popup>
                </Polygon>

                {/* Område center marker */}
                <CircleMarker
                  center={area.center}
                  pathOptions={{
                    fillColor: getColorForPrice(price),
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                  }}
                  radius={15}
                >
                  <Popup>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{code}</Typography>
                      <Typography variant="h5" color="primary">
                        {price.toFixed(1)} öre/kWh
                      </Typography>
                    </Box>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </Paper>

      {/* Förklaring */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          🎨 Färgkodning
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: '#4caf50', borderRadius: '50%', mr: 1 }} />
              <Typography variant="body2">Låga priser (&lt;70 öre/kWh)</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: '#2196f3', borderRadius: '50%', mr: 1 }} />
              <Typography variant="body2">Måttliga priser (70-80 öre/kWh)</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: '#ff9800', borderRadius: '50%', mr: 1 }} />
              <Typography variant="body2">Höga priser (80-90 öre/kWh)</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, backgroundColor: '#f44336', borderRadius: '50%', mr: 1 }} />
              <Typography variant="body2">Mycket höga priser (&gt;90 öre/kWh)</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MapView;
