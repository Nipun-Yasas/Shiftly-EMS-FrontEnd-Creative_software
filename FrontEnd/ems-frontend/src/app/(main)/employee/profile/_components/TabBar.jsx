'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';

import BasicInfoTab from './BasicInfoTab';
import PersonalInfoTab from './PersonalInfoTab';
import ExperienceTab from './ExperienceTab';
import EducationTab from './EducationTab';
import SkillsTab from './SkillsTab';
import TabPanel from '../../../../_components/main/TabPanel';

const tabs = [
  { label: "Basic Info", value: 0, component: BasicInfoTab },
  { label: "Personal Info", value: 1, component: PersonalInfoTab },
  { label: "Experience", value: 2, component: ExperienceTab },
  { label: "Education", value: 3, component: EducationTab },
  { label: "Skills", value: 4, component: SkillsTab },
];

const TabBar = ({ theme, employeeData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tabValue, setTabValue] = useState(0);

  // Initialize tab value from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    
    if (tabParam) {
      const tabIndex = tabs.findIndex(tab => {
        const tabSlug = tab.label.toLowerCase().replace(/\s+/g, '-');
        return tabSlug === tabParam.toLowerCase();
      });
      
      if (tabIndex !== -1) {
        setTabValue(tabIndex);
      }
    } else {
      // Set default tab to "Basic Info" if no tab parameter
      setTabValue(0);
    }
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Update URL with tab parameter
    const selectedTab = tabs[newValue];
    const tabParam = selectedTab.label.toLowerCase().replace(/\s+/g, '-');
    
    // Get current URL and update only the tab parameter
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('tab', tabParam);
    
    const newUrl = `/employee/profile?${currentParams.toString()}`;
    
    // Push new URL without causing a full page reload
    router.push(newUrl, { scroll: false });
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
                <Component employeeData={employeeData} />
              </TabPanel>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default TabBar;
