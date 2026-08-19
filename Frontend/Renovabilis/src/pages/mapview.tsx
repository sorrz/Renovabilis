import React, { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Polygon, Popup, TileLayer } from 'react-leaflet';
import { Container, Grid, Paper, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';

interface PriceData { gridArea: string; price: number; }
interface EnergyData {
  timestamp: string;
  consumptionKwh: number;
  productionKwh: number;
  gridArea: { code: string };
}

const gridAreas = {
  SE1: { name: 'Norra Sverige', center: [67.8558, 20.2253] as [number, number], bounds: [[69, 11], [69, 24], [64, 24], [64, 11], [69, 11]] as [number, number][] },
  SE2: { name: 'Norra Mellansverige', center: [62.3908, 17.3069] as [number, number], bounds: [[64, 11], [64, 24], [60.5, 24], [60.5, 11], [64, 11]] as [number, number][] },
  SE3: { name: 'Sodra Mellansverige', center: [59.3293, 18.0686] as [number, number], bounds: [[60.5, 11], [60.5, 24], [55.5, 24], [55.5, 11], [60.5, 11]] as [number, number][] },
  SE4: { name: 'Sodra Sverige', center: [55.605, 13.0038] as [number, number], bounds: [[55.5, 11], [55.5, 24], [55, 24], [55, 11], [55.5, 11]] as [number, number][] },
};

const getPriceColor = (price: number) => price < 70 ? '#4caf50' : price < 80 ? '#2196f3' : price < 90 ? '#ff9800' : '#f44336';

export default function MapView() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [energy, setEnergy] = useState<EnergyData[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [priceResponse, energyResponse] = await Promise.all([
          fetch('http://localhost:5054/api/price/all-areas'),
          fetch('http://localhost:5054/api/energydata'),
        ]);
        setApiUnavailable(!priceResponse.ok || !energyResponse.ok);
        if (priceResponse.ok) setPrices(await priceResponse.json());
        if (energyResponse.ok) setEnergy(await energyResponse.json());
      } catch {
        setApiUnavailable(true);
      }
    };
    loadData();
    const interval = setInterval(loadData, 120000);
    return () => clearInterval(interval);
  }, []);

  const priceFor = (code: string) => prices.find((item) => item.gridArea === code)?.price ?? 0;
  const energyFor = (code: string) => energy.filter((item) => item.gridArea.code === code).sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Svenska elnatet</Typography>
      <Typography sx={{ mb: 3 }}>Elomraden och realtidspriser</Typography>
      {apiUnavailable && <Typography color="warning.main" sx={{ mb: 2 }}>Prisdata saknas. Starta backend pa http://localhost:5054.</Typography>}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(gridAreas).map(([code, area]) => (
          <Grid size={{ xs: 6, md: 3 }} key={code}>
            <Paper onClick={() => setSelectedArea(selectedArea === code ? null : code)} sx={{ p: 2, cursor: 'pointer', border: selectedArea === code ? '2px solid #1976d2' : 'none' }}>
              <Typography variant="h6">{code}</Typography>
              <Typography variant="body2" color="text.secondary">{area.name}</Typography>
              <Typography variant="h5" color="primary">{apiUnavailable ? '--' : `${priceFor(code).toFixed(1)} ore/kWh`}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ height: 600, overflow: 'hidden', borderRadius: 2 }}>
        <MapContainer center={[62, 15]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {Object.entries(gridAreas).map(([code, area]) => {
            const price = priceFor(code);
            const latestEnergy = energyFor(code);
            const color = getPriceColor(price);
            return (
              <React.Fragment key={code}>
                <Polygon positions={area.bounds} pathOptions={{ color: selectedArea === code ? '#1976d2' : '#333', weight: selectedArea === code ? 3 : 2, fillColor: color, fillOpacity: 0.45 }} eventHandlers={{ click: () => setSelectedArea(selectedArea === code ? null : code) }}>
                  <Popup>
                    <Typography variant="h6">{code} - {area.name}</Typography>
                    <Typography>{apiUnavailable ? 'Prisdata saknas' : `${price.toFixed(1)} ore/kWh`}</Typography>
                    {latestEnergy && <Typography sx={{ mt: 1 }}>Forbrukning: {latestEnergy.consumptionKwh.toFixed(0)} kWh<br />Produktion: {latestEnergy.productionKwh.toFixed(0)} kWh</Typography>}
                  </Popup>
                </Polygon>
                <CircleMarker center={area.center} radius={15} pathOptions={{ fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.85 }}>
                  <Popup><Typography variant="h6">{code}</Typography><Typography>{apiUnavailable ? 'Prisdata saknas' : `${price.toFixed(1)} ore/kWh`}</Typography></Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </Paper>
    </Container>
  );
}
