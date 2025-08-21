import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, CircleMarker } from 'react-leaflet';
import { Box, Paper, Typography, Card, CardContent, Chip, Container } from '@mui/material';
import 'leaflet/dist/leaflet.css';

interface PriceData {
  gridArea: string;
  gridAreaName: string;
  currentPrice: string;
  currentPriceNumeric: number;
  averageToday: string;
  currency: string;
  unit: string;
  dataSource: string;
  dataQuality: string;
  totalHours: number;
  timestamp: string;
  isRealData: boolean;
}

// Svenska elområden
const swedenGridAreas = {
  SE1: {
    name: "Norra Sverige",
    description: "Luleå och norrut",
    center: [67.2, 19.8] as [number, number],
    bounds: [
      [69.06, 21.04], [69.0, 21.5], [68.8, 22.2], [68.4, 22.8], [67.9, 23.4], 
      [67.3, 23.8], [66.5, 23.9], [65.8, 23.7], [65.0, 23.2], [64.5, 22.5],
      [64.2, 21.8], [64.0, 21.0], [63.8, 20.2], [63.5, 19.5], [63.2, 18.8],
      [63.0, 18.0], [63.2, 17.2], [63.6, 16.5], [64.1, 15.8], [64.7, 15.2],
      [65.4, 14.7], [66.2, 14.3], [67.0, 14.0], [67.8, 13.8], [68.5, 13.7],
      [69.0, 13.9], [69.3, 14.5], [69.4, 15.3], [69.3, 16.2], [69.1, 17.1],
      [68.9, 18.0], [68.8, 18.9], [68.9, 19.8], [69.0, 20.5], [69.06, 21.04]
    ] as [number, number][]
  },
  SE2: {
    name: "Norra Mellansverige",
    description: "Sundsvall - Gävle", 
    center: [62.8, 16.8] as [number, number],
    bounds: [
      [64.2, 21.8], [63.8, 20.2], [63.5, 19.5], [63.2, 18.8], [63.0, 18.0],
      [62.7, 17.3], [62.3, 16.7], [61.9, 16.1], [61.4, 15.6], [60.9, 15.1],
      [60.4, 14.7], [59.9, 14.3], [59.5, 13.9], [59.2, 13.4], [59.0, 12.8],
      [59.2, 12.2], [59.6, 11.7], [60.2, 11.3], [60.9, 11.1], [61.7, 11.0],
      [62.5, 11.2], [63.3, 11.6], [64.0, 12.2], [64.5, 13.0], [64.8, 13.9],
      [65.0, 14.8], [65.0, 15.8], [64.8, 16.8], [64.5, 17.7], [64.2, 18.5],
      [64.0, 19.3], [63.9, 20.1], [64.0, 20.9], [64.2, 21.8]
    ] as [number, number][]
  },
  SE3: {
    name: "Södra Mellansverige",
    description: "Stockholm - Göteborg",
    center: [59.5, 15.2] as [number, number],
    bounds: [
      [61.4, 15.6], [60.9, 15.1], [60.4, 14.7], [59.9, 14.3], [59.5, 13.9],
      [59.2, 13.4], [59.0, 12.8], [58.7, 12.2], [58.3, 11.7], [57.8, 11.3],
      [57.2, 11.0], [56.5, 10.9], [55.9, 11.0], [55.4, 11.3], [55.0, 11.7],
      [54.8, 12.2], [54.7, 12.8], [54.8, 13.4], [55.0, 14.0], [55.4, 14.5],
      [55.9, 15.0], [56.5, 15.4], [57.2, 15.7], [57.9, 16.0], [58.6, 16.2],
      [59.3, 16.3], [60.0, 16.2], [60.6, 16.0], [61.1, 15.8], [61.4, 15.6]
    ] as [number, number][]
  },
  SE4: {
    name: "Södra Sverige",
    description: "Skåne, Blekinge, Halland",
    center: [56.2, 13.8] as [number, number],
    bounds: [
      [57.8, 11.3], [57.2, 11.0], [56.5, 10.9], [55.9, 11.0], [55.4, 11.3],
      [55.0, 11.7], [54.8, 12.2], [54.7, 12.8], [54.8, 13.4], [55.0, 14.0],
      [55.4, 14.5], [55.9, 15.0], [56.5, 15.4], [57.2, 15.7], [57.8, 15.5],
      [58.2, 15.0], [58.4, 14.3], [58.3, 13.5], [58.0, 12.8], [57.6, 12.2],
      [57.1, 11.7], [57.8, 11.3]
    ] as [number, number][]
  }
};

const MapView: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5054/api/prices/current');
        
        if (response.ok) {
          const apiResult = await response.json();
          setPriceData(apiResult.prices || []);
        }
      } catch (error) {
        console.error('API fel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  const getPriceForArea = (areaCode: string): number => {
    const priceInfo = priceData.find(p => p.gridArea === areaCode);
    return priceInfo?.currentPriceNumeric || 0;
  };

  const getPriceInfoForArea = (areaCode: string): PriceData | null => {
    return priceData.find(p => p.gridArea === areaCode) || null;
  };

  // Enkel färgskala med 5 nivåer
  const getColorForPrice = (price: number): string => {
    if (price <= 0) return '#9e9e9e';
    if (price < 30) return '#4caf50';   // Grön - billigt
    if (price < 60) return '#2196f3';   // Blå - måttligt
    if (price < 90) return '#ff9800';   // Orange - dyrt
    return '#f44336';                   // Röd - mycket dyrt
  };

  const getOpacityForPrice = (price: number): number => {
    if (price <= 0) return 0.3;
    return Math.min(0.5 + (price / 120) * 0.4, 0.8);
  };

  const sortedPrices = priceData
    .filter(p => p.currentPriceNumeric > 0)
    .sort((a, b) => a.currentPriceNumeric - b.currentPriceNumeric);
  const cheapestArea = sortedPrices[0]?.gridArea;
  const mostExpensiveArea = sortedPrices[sortedPrices.length - 1]?.gridArea;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Svenska Elnätet
        </Typography>
        <Typography variant="h6">
          Laddar elpriser...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Svenska Elnätet - Live Priser
      </Typography>

      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="body1">
          <strong>Live Data:</strong> {priceData.length}/4 områden med riktiga priser
        </Typography>
        {priceData.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Källa: {priceData[0].dataSource} • Kvalitet: {priceData[0].dataQuality}
          </Typography>
        )}
      </Paper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {priceData.map((price) => {
          const isCheapest = price.gridArea === cheapestArea;
          const isMostExpensive = price.gridArea === mostExpensiveArea;
          
          return (
            <Card 
              key={price.gridArea}
              sx={{ 
                flex: '1 1 220px',
                cursor: 'pointer',
                border: selectedArea === price.gridArea ? '2px solid #1976d2' : '1px solid #ddd',
                backgroundColor: isCheapest ? '#e8f5e8' : isMostExpensive ? '#ffebee' : 'inherit',
                '&:hover': { boxShadow: 4 }
              }}
              onClick={() => setSelectedArea(selectedArea === price.gridArea ? null : price.gridArea)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 20, 
                      height: 20, 
                      backgroundColor: getColorForPrice(price.currentPriceNumeric),
                      borderRadius: '50%',
                      mr: 1.5,
                      border: '2px solid white',
                      boxShadow: 1
                    }} 
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {price.gridArea}
                  </Typography>
                  {isCheapest && (
                    <Chip label="Billigast" color="success" size="small" sx={{ ml: 1 }} />
                  )}
                  {isMostExpensive && (
                    <Chip label="Dyrast" color="error" size="small" sx={{ ml: 1 }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {price.gridAreaName}
                </Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {price.currentPriceNumeric.toFixed(1)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  öre/kWh • Snitt: {price.averageToday}
                </Typography>
                <Chip 
                  label={price.isRealData ? 'Live data' : 'Uppskattning'}
                  size="small"
                  color={price.isRealData ? 'success' : 'default'}
                />
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Paper sx={{ height: 700, overflow: 'hidden', borderRadius: 2 }}>
        <MapContainer
          center={[62.2, 15.8]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {Object.entries(swedenGridAreas).map(([code, area]) => {
            const price = getPriceForArea(code);
            const priceInfo = getPriceInfoForArea(code);
            const isSelected = selectedArea === code;
            const isCheapest = code === cheapestArea;
            const isMostExpensive = code === mostExpensiveArea;
            
            return (
              <React.Fragment key={code}>
                <Polygon
                  positions={area.bounds}
                  pathOptions={{
                    fillColor: getColorForPrice(price),
                    weight: isSelected ? 4 : 2,
                    opacity: 1,
                    color: isSelected ? '#1976d2' : '#333',
                    fillOpacity: getOpacityForPrice(price)
                  }}
                  eventHandlers={{
                    click: () => setSelectedArea(selectedArea === code ? null : code),
                    mouseover: (e) => {
                      e.target.setStyle({ weight: 3, color: '#000' });
                    },
                    mouseout: (e) => {
                      e.target.setStyle({ 
                        weight: isSelected ? 4 : 2, 
                        color: isSelected ? '#1976d2' : '#333'
                      });
                    }
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
                      
                      {price > 0 && priceInfo ? (
                        <>
                          <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', my: 2 }}>
                            {price.toFixed(1)} öre/kWh
                          </Typography>
                          
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Aktuellt pris:</strong> {priceInfo.currentPrice}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Snitt idag:</strong> {priceInfo.averageToday}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Källa:</strong> {priceInfo.dataSource}
                          </Typography>
                          
                          <Box sx={{ mt: 2 }}>
                            <Chip 
                              label={priceInfo.isRealData ? 'Live data' : 'Uppskattning'}
                              size="small"
                              color={priceInfo.isRealData ? 'success' : 'default'}
                            />
                            {isCheapest && (
                              <Chip label="Billigast" color="success" size="small" sx={{ ml: 1 }} />
                            )}
                            {isMostExpensive && (
                              <Chip label="Dyrast" color="error" size="small" sx={{ ml: 1 }} />
                            )}
                          </Box>
                        </>
                      ) : (
                        <Typography>Ingen data tillgänglig</Typography>
                      )}
                    </Box>
                  </Popup>
                </Polygon>

                <CircleMarker
                  center={area.center}
                  pathOptions={{
                    fillColor: getColorForPrice(price),
                    color: '#fff',
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0.9
                  }}
                  radius={Math.max(12, Math.min(20, price / 5))}
                >
                  <Popup>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{code}</Typography>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        {price > 0 ? `${price.toFixed(1)}` : '?'}
                      </Typography>
                      <Typography variant="body2">öre/kWh</Typography>
                    </Box>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </Paper>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Prisstatistik & Färgkodning
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <Typography variant="subtitle1" gutterBottom>Marknadsöversikt:</Typography>
            {sortedPrices.length > 0 && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Billigast:</strong> {cheapestArea} ({sortedPrices[0]?.currentPriceNumeric.toFixed(1)} öre/kWh)
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Dyrast:</strong> {mostExpensiveArea} ({sortedPrices[sortedPrices.length - 1]?.currentPriceNumeric.toFixed(1)} öre/kWh)
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Genomsnitt:</strong> {(sortedPrices.reduce((sum, p) => sum + p.currentPriceNumeric, 0) / sortedPrices.length).toFixed(1)} öre/kWh
                </Typography>
                <Typography variant="body2">
                  <strong>Prisspridning:</strong> {(sortedPrices[sortedPrices.length - 1]?.currentPriceNumeric - sortedPrices[0]?.currentPriceNumeric).toFixed(1)} öre/kWh
                </Typography>
              </Box>
            )}
          </Box>
          
          <Box sx={{ flex: '1 1 200px' }}>
            <Typography variant="subtitle1" gutterBottom>Färgkodning:</Typography>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#4caf50', borderRadius: '4px', mr: 1 }} />
                <Typography variant="body2">Billigt (&lt;30 öre/kWh)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#2196f3', borderRadius: '4px', mr: 1 }} />
                <Typography variant="body2">Måttligt (30-60 öre/kWh)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#ff9800', borderRadius: '4px', mr: 1 }} />
                <Typography variant="body2">Dyrt (60-90 öre/kWh)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#f44336', borderRadius: '4px', mr: 1 }} />
                <Typography variant="body2">Mycket dyrt (&gt;90 öre/kWh)</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MapView;
