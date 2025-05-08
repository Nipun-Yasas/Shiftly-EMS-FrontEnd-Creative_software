'use client';

import React, { useState } from 'react';
import {
  Box,
  Tab,
  Paper
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import BasicInfoForm from '../basic-info/BasicInfoForm';
import PersonalInfoForm from '../personal-info/PersonalInfoForm';
import ProjectContent from '../project/page';
import Experience from '../experience/page';
import Education from '../education/page';
import Skills from '../skills/page';

const tabs = [
  { label: "Basic Info", value: "1", component: BasicInfoForm },
  { label: "Personal Info", value: "2", component: PersonalInfoForm },
  { label: "Projects", value: "3", component: ProjectContent },
  { label: "Experience", value: "4", component: Experience },
  { label: "Education", value: "5", component: Education },
  { label: "Skills", value: "6", component: Skills },
];

const TabBar = () => {
  const [value, setValue] = useState("1");

  // Form states
  const [experienceFormData, setExperienceFormData] = useState({
    jobTitle: '',
    company: '',
    duration: '',
  });
  const [experiences, setExperiences] = useState([]);

  const [educationFormData, setEducationFormData] = useState({
    degree: '',
    institution: '',
    duration: '',
  });
  const [educations, setEducations] = useState([]);

  const [skillsFormData, setSkillsFormData] = useState({
    skillName: '',
    proficiency: '',
  });
  const [skills, setSkills] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleExperienceInputChange = (e) => {
    const { name, value } = e.target;
    setExperienceFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceSubmit = (e) => {
    e.preventDefault();
    setExperiences((prev) => [...prev, experienceFormData]);
    setExperienceFormData({ jobTitle: '', company: '', duration: '' });
    return true;
  };

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setEducationFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationSubmit = (e) => {
    e.preventDefault();
    setEducations((prev) => [...prev, educationFormData]);
    setEducationFormData({ degree: '', institution: '', duration: '' });
    return true;
  };

  const handleSkillsInputChange = (e) => {
    const { name, value } = e.target;
    setSkillsFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsSubmit = (e) => {
    e.preventDefault();
    setSkills((prev) => [...prev, skillsFormData]);
    setSkillsFormData({ skillName: '', proficiency: '' });
    return true;
  };

  const renderTabPanel = (tab) => {
    const Component = tab.component;

    if (tab.label === "Experience") {
      return (
        <Component
          formData={experienceFormData}
          handleInputChange={handleExperienceInputChange}
          handleSubmit={handleExperienceSubmit}
          experiences={experiences}
        />
      );
    } else if (tab.label === "Education") {
      return (
        <Component
          formData={educationFormData}
          handleInputChange={handleEducationInputChange}
          handleSubmit={handleEducationSubmit}
          educations={educations}
        />
      );
    } else if (tab.label === "Skills") {
      return (
        <Component
          formData={skillsFormData}
          handleInputChange={handleSkillsInputChange}
          handleSubmit={handleSkillsSubmit}
          skills={skills}
        />
      );
    } else {
      return <Component />;
    }
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', mt: 4 }}>
      <TabContext value={value}>
        <Paper elevation={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="Profile Tabs" variant="scrollable" scrollButtons="auto">
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </TabList>
        </Paper>

        <Paper elevation={10} sx={{  p: 5 }}>
          {tabs.map((tab) => (
            <TabPanel key={tab.value} value={tab.value}>
              {renderTabPanel(tab)}
            </TabPanel>
          ))}
        </Paper>
      </TabContext>
    </Box>
  );
};

export default TabBar;
