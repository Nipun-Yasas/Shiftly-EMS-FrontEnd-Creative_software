import React from 'react';
import Image from 'next/image';
import url from '../../../../../../public/creative_software_logo.png';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';

const Projects = ({ employeeData }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        maxWidth: '100%',
        mx: 'auto',
        backgroundColor: theme.palette.background,
        boxShadow: 2,
        borderRadius: { xs: 2, sm: 3 },
        p: { xs: 2, sm: 3, md: 4 },
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: { xs: 2, sm: 3, md: 4 },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: '150px', sm: '200px', md: '250px' },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Image
            src={url}
            alt="Creative Software Logo"
            width={250}
            height={68.99}
            className="rounded"
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '250px',
            }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              fontWeight: 500,
              color: theme.palette.text,
              wordBreak: 'break-word',
              lineHeight: { xs: 1.3, sm: 1.4 },
            }}
          >
            Software Engineer
          </Typography>
          <Box sx={{ mt: { xs: 0.5, sm: 0 } }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.9rem' },
                color: theme.palette.text,
                wordBreak: 'break-word',
                lineHeight: { xs: 1.3, sm: 1.4 },
              }}
            >
              Creative Technology Solutions (Pvt) Ltd
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
              color: theme.palette.text,
              mt: { xs: 0.5, sm: 0.25 },
              lineHeight: { xs: 1.3, sm: 1.4 },
            }}
          >
            November 2021 - Present
          </Typography>
        </Box>
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 8, sm: 12, md: 16 },
          right: { xs: 8, sm: 12, md: 16 },
          zIndex: 1,
        }}
      >
        <IconButton
          sx={{
            color: theme.palette.primary.main,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            padding: { xs: '6px', sm: '8px' },
            '&:hover': {
              bgcolor: theme.palette.primary.light,
              color: 'white'
            }
          }}
          size="small"
        >
          <EditIcon 
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } 
            }} 
          />
        </IconButton>
      </Box>

      <Box 
        sx={{ 
          ml: { xs: 0, sm: 4, md: 8 }, 
          mt: { xs: 2.5, sm: 2.5, md: 3 },
          px: { xs: 0, sm: 0 },
          width: '100%',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            fontWeight: 700,
            fontFamily: 'Roboto, sans-serif',
            color: theme.palette.text,
            textAlign: { xs: 'center', sm: 'left' },
            lineHeight: { xs: 1.3, sm: 1.4 },
          }}
        >
          DIPS
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.8rem', sm: '0.825rem', md: '0.875rem' },
            lineHeight: { xs: '1.4', sm: '1.45', md: '1.5' },
            color: theme.palette.text,
            mt: { xs: 1, sm: 1 },
            textAlign: { xs: 'center', sm: 'left' },
            wordBreak: 'break-word',
            hyphens: 'auto',
            maxWidth: '100%',
          }}
        >
          DIPS AS is Norway&apos;s leading provider of E-healthcare solutions for hospitals.
          <br/> The success of an initial
          collaboration to develop the first mobile applications led to<br/> DIPS establishing additional teams to work on
          other areas of their product.
        </Typography>
      </Box>
    </Box>
  );
};

export default Projects; 