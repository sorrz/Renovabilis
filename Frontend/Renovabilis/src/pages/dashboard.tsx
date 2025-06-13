import React, { useState } from 'react';
import { Container, Typography, Button, Stack } from '@mui/material';

export default function Dashboard() {
  const [count, setCount] = useState(0);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Typography>Counter: {count}</Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setCount(count + 1)}>Increment</Button>
        <Button variant="contained" onClick={() => setCount(count - 1)}>Decrement</Button>
        <Button variant="outlined" onClick={() => setCount(0)}>Reset</Button>
      </Stack>
    </Container>
  );
}