'use client';

import React, { useState } from 'react';
import {
  Box,
  Tab,
  Paper,
  Tabs
} from '@mui/material';

import BasicInfo from '../profile/BasicInfo';
import PersonalInfo from '../profile/PersonalInfo';
import Projects from '../profile/Projects';
import Experience from '../profile/Experience';
import Education from '../profile/Education';
import Skills from '../profile/Skills';
import TabPanel from '../../../_components/main/TabPanel';

const tabs = [
  { label: "Basic Info", value: 0, component: BasicInfo },
  { label: "Personal Info", value: 1, component: PersonalInfo },
  { label: "Projects", value: 2, component: Projects },
  { label: "Experience", value: 3, component: Experience },
  { label: "Education", value: 4, component: Education },
  { label: "Skills", value: 5, component: Skills },
];

const TabBar = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ 
        p: { xs: 1, sm: 2 },
        overflow: 'hidden'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="employee profile tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              minWidth: { xs: 'auto', sm: 120 },
              padding: { xs: '6px 8px', sm: '12px 16px' },
              '&.Mui-selected': {
                color: 'primary.main'
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          {tabs.map((tab) => (
            <Tab 
              key={tab.value} 
              label={tab.label}
              sx={{
                whiteSpace: 'nowrap',
                minHeight: { xs: 40, sm: 48 }
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ 
          mt: { xs: 1, sm: 2 },
          minHeight: { xs: '60vh', sm: '70vh' }
        }}>
          {tabs.map((tab) => {
            const Component = tab.component;
            return (
              <TabPanel key={tab.value} value={tabValue} index={tab.value}>
                <Component />
              </TabPanel>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default TabBar;
