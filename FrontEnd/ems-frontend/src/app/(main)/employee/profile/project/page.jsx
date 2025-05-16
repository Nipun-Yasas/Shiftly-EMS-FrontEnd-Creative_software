import React from 'react';
import Image from 'next/image';
import url from '../../../../../../public/creative_software_logo.png';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Projects = () => {
  const theme = useTheme();

  return (
    <Box
    sx={{
      mt: 5,
      maxWidth: '100%',
      mx: 'auto',
      backgroundColor: theme.palette.background, // Use background.default for better theme control
      boxShadow: 3,
      borderRadius: 5,
      p: 3,
      border: `1px solid ${theme.palette.divider}`,
    }}
    
    >
      <Box display="flex" alignItems="center" gap={4}>
        <Image
          src={url}
          alt="Creative Software Logo"
          width={250}
          height={68.99}
          className="rounded"
        />
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text, // Ensure the text color works with dark and light modes
              fontWeight: 700,
            }}
          >
            Software Engineer
          </Typography>
          <Box  >
           
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text, 
              }}
            >
              Creative Technology Solutions (Pvt) Ltd
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text,
              fontSize: '0.875rem',
            }}
          >
            November 2021 - Present
          </Typography>
        </Box>
      </Box>
      <Box>
          <IconButton  
              sx={{
                
                ml:100,
                color: theme.palette.text
              }}>
              <EditIcon />
            </IconButton>

      </Box>

      <Box sx={{ ml: 8}}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text,
            fontWeight: 700,
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          DIPS
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text,
            fontSize: '0.875rem',
            lineHeight: '1.5',
            mt: 1,
          }}
        >
          DIPS AS is Norway&apos;s leading provider of E-healthcare solutions for hospitals. The success of an initial
          collaboration to develop the first mobile applications led to DIPS establishing additional teams to work on
          other areas of their product.
        </Typography>
      </Box>
    </Box>
  );
};

export default Projects;
