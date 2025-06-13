import { Routes, Route, Link } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import Dashboard from './pages/dashboard';
import MapView from './pages/mapview';

function App() {
  return (
    <>
      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        <Button variant="outlined" component={Link} to="/">Dashboard</Button>
        <Button variant="outlined" component={Link} to="/mapview">MapView</Button>
      </Stack>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mapview" element={<MapView />} />
      </Routes>
    </>
  );
}

export default App;
