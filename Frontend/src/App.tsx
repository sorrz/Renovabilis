import { Routes, Route, Link } from 'react-router-dom';
import { Button, Stack, Box } from '@mui/material';
import Dashboard from './pages/dashboard';
import MapView from './pages/mapview';
import './app.css';  

function App() {
  return (
    <>
      <div className="background" />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          position: 'relative', 
          color: 'white',
          zIndex: 0,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1280 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
            <Button variant="outlined" component={Link} to="/" sx={{ backgroundColor: '#1976d2', color: 'white', borderColor: '#1976d2' }}>
              Dashboard
            </Button>
            <Button variant="outlined" component={Link} to="/mapview" sx={{ backgroundColor: '#1976d2', color: 'white', borderColor: '#1976d2' }}>
              MapView
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: '70vh',
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mapview" element={<MapView />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;