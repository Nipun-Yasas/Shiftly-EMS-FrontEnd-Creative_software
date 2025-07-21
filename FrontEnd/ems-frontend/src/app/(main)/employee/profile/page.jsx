"use client";

import Image from 'next/image';
import EmailIcon from '@mui/icons-material/Email';
import FolderIcon from '@mui/icons-material/Folder';
import { Box, Typography, IconButton, Paper, Avatar, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TabBar from '../_components/TabBar';
import { useTheme } from '@mui/material/styles';

const Employee = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 },
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: { xs: 'center', sm: 'space-between' },
          alignItems: { xs: 'center', sm: 'center' },
          p: { xs: 2, sm: 2, md: 3 },
          borderRadius: { xs: 2, sm: 3 },
          backgroundColor: theme.palette.background,
          gap: { xs: 2, sm: 0 },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        {/* Left Section - Avatar and Name */}
        <Box 
          display="flex" 
          alignItems="center" 
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 1, sm: 2 }}
          sx={{ position: 'relative' }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src="/profilePic.jpg"
              alt="Employee Profile Picture"
              sx={{ 
                width: { xs: 80, sm: 93, md: 100 },
                height: { xs: 80, sm: 93, md: 100 },
                
                boxShadow: 2
              }}
            />
            <IconButton 
              sx={{ 
                position: 'absolute',
                bottom: 0,
                right: -1,
                bgcolor: theme.palette.background.paper,
                
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
               
              }} 
              aria-label="edit"
            >
              <EditIcon
                sx={{
                  color: theme.palette.primary.main,
                  width: { xs: 16, sm: 18, md: 20 },
                  height: { xs: 16, sm: 18, md: 20 },
                }}
              />
            </IconButton>
          </Box>
          
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text,
              fontFamily: 'var(--font-poppins)',
              fontWeight: { xs: 600, sm: 500 },
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              textAlign: { xs: 'center', sm: 'left' },
              mt: { xs: 1, sm: 0 }
            }}
          >
            Brooklyn Simmons
          </Typography>
        </Box>

        {/* Right Section - Job Info */}
        <Box
          sx={{
            color: theme.palette.text, 
            fontFamily: 'var(--font-lexend)',
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, sm: 1.5 },
            alignItems: { xs: 'center', sm: 'flex-start' },
            minWidth: { xs: '100%', sm: 'auto' }
          }}
        >
          {/* Job Title */}
          <Box
            display="flex"
            alignItems="center"
            sx={{ 
              color: theme.palette.primary,
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}
          >
            <FolderIcon
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                color: theme.palette.primary.main,
              }}
            />
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: theme.palette.text
              }}
            >
              Software Engineer
            </Typography>
          </Box>

          {/* Email */}
          <Box
            display="flex"
            alignItems="center"
            sx={{ 
              color: theme.palette.text,
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}
          >
            <EmailIcon
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
                color: theme.palette.primary.main,
              }}
            />
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 400,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: theme.palette.text,
                wordBreak: 'break-word'
              }}
            >
              brooklyn.s@example.com
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tabs Container */}
      <Box 
        sx={{ 
          mt: { xs: 2, sm: 3 },
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden',
          boxShadow: 2
        }}
      >
        <TabBar theme={theme} />
      </Box>
    </Box>
  );
};

export default Employee;
