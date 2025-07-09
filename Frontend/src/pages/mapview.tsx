import React from 'react';
import { Container, Typography, Box } from '@mui/material';

export default function MapView() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Karta över elområden (SE1–SE4)
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Detta är en visualisering av Sveriges elområden.
      </Typography>

      {/* Enkel placeholder-karta */}
      <Box
        sx={{
          border: '2px dashed gray',
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'gray',
          fontSize: '1.2rem',
        }}
      >
        Här kommer kartan att visas (SE1, SE2, SE3, SE4)
      </Box>
    </Container>
  );
}
