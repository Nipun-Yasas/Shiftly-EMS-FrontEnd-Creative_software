'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CssBaseline,
  Paper,
  Link,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme'; // ← this is correct if your theme is in `src/theme.js`

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate sign-in logic
    if (email === 'admin@example.com' && password === 'admin') {
      alert(`Signed in as: ${email}`);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid credentials.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {/* Background Image with Dark Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/images/image1.jpg)', // Replace with your image URL
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5, // Reduce image opacity if necessary
            zIndex: -1, // Ensures the background stays behind content
          }}
        />
        {/* Dark Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with opacity
            zIndex: -1, // Ensures the overlay stays behind content
          }}
        />

        <Paper elevation={6} sx={{ mt: 8, p: 4,pt: 6, borderRadius: 3, position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Sign in Title with Bold Font */}
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {errorMsg && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {errorMsg}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>

              {/* Forgot Password */}
              <Link
                href="#"
                variant="body2"
                sx={{
                  display: 'block',
                  textDecoration: 'underline',
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                Forgot password?
              </Link>

              {/* New to Shiftly? Sign up now */}
              <Box sx={{ display: 'block', width: '100%' }}>
                <Typography variant="body2">
                  New to Shiftly?{' '}
                  <Link
                    href="#"
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      textDecoration: 'none',
                    }}
                  >
                    Sign up now.
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
