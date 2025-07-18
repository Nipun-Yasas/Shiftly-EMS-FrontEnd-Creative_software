"use client";

import Image from 'next/image';
import EmailIcon from '@mui/icons-material/Email';
import FolderIcon from '@mui/icons-material/Folder';
import { Box, Typography, IconButton, Paper, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TabBar from './components/TabBar';
import { useTheme } from '@mui/material/styles';

const Employee = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderRadius: 3,
          backgroundColor: theme.palette.background, // Dynamically switch background color
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            src="/profilePic.jpg"
            alt="Employee Profile Picture"
            sx={{ width: 93, height: 93, ml: 2, mt: 1 }}
          />
          <IconButton sx={{ mt: 8, ml: 0 }} aria-label="edit">
            <EditIcon
              sx={{
                color: theme.palette.text, 
                width: 20,
                height: 20,
              }}
            />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text,
              fontFamily: 'var(--font-poppins)',
              fontWeight: 450,
              ml: 3,
             
            }}
          >
            Brooklyn Simmons
          </Typography>
        </Box>

        <Box
          className="right-container pr-5 pt-5 flex flex-col items-start"
          sx={{
            color: theme.palette.text, // Make sure text color adapts to the theme mode
            fontFamily: 'var(--font-lexend)',
          }}
        >
          <Box className="emp-id text-m font-semibold">
            <Box
              display="flex"
              alignItems="center"
              sx={{ color: theme.palette.text }}
            >
              <FolderIcon
                sx={{
                  width: 24,
                  height: 24,
                  mr: 1,
                  color: theme.palette.text, // Use theme-based color for icons
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: 'light' }}>
                Software Engineer
              </Typography>
            </Box>
          </Box>
          <Box className="emp-department text-m font-semibold mt-5">
            <Box
              display="flex"
              alignItems="center"
              sx={{ color: theme.palette.text }}
            >
              <EmailIcon
                sx={{
                  width: 24,
                  height: 24,
                  mr: 1,
                  color: theme.palette.text // Ensure icons are using correct colors
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: 'light',
            
               }}>
                brooklyn.s@example.com
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box className="tabs-container shadow bg-white rounded-xl" sx={{ mt: 3 }}>
        {/* Make sure TabBar responds to the theme */}
        <TabBar theme={theme} />
      </Box>
    </Box>
  );
};

export default Employee;
