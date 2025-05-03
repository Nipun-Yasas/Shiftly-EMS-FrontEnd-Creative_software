"use client";

import React, { useState, useCallback } from "react";
import BasicInfoForm from '../basic-info/BasicInfoForm';
import PersonalInfoForm from '../personal-info/PersonalInfoForm';
import ProjectContent from '../project/page';
import Experience from '../experience/page';
import Education from '../education/page';
import Skills from '../skills/page';

// Tab configuration for easier maintenance
const tabs = [
  { name: "Basic Info", component: BasicInfoForm },
  { name: "Personal Info", component: PersonalInfoForm },
  { name: "Projects", component: ProjectContent },
  { name: "Experience", component: Experience },
  { name: "Education", component: Education },
  { name: "Skills", component: Skills },
];

const TabBar = () => {
  const [activeTab, setActiveTab] = useState("Basic Info");

  // State for Experience
  const [experienceFormData, setExperienceFormData] = useState({
    jobTitle: '',
    company: '',
    duration: '',
  });
  const [experiences, setExperiences] = useState([]);

  // State for Education
  const [educationFormData, setEducationFormData] = useState({
    degree: '',
    institution: '',
    duration: '',
  });
  const [educations, setEducations] = useState([]);

  // State for Skills
  const [skillsFormData, setSkillsFormData] = useState({
    skillName: '',
    proficiency: '',
  });
  const [skills, setSkills] = useState([]);

  // Memoize the tab change handler
  const handleTabChange = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);

  // Handlers for Experience
  const handleExperienceInputChange = (e) => {
    const { name, value } = e.target;
    setExperienceFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceSubmit = (e) => {
    e.preventDefault();
    setExperiences((prev) => [...prev, experienceFormData]);
    console.log('Experience submitted:', experienceFormData);
    setExperienceFormData({ jobTitle: '', company: '', duration: '' });
    return true; // Signal success for snackbar
  };

  // Handlers for Education
  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setEducationFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationSubmit = (e) => {
    e.preventDefault();
    setEducations((prev) => [...prev, educationFormData]);
    console.log('Education submitted:', educationFormData);
    setEducationFormData({ degree: '', institution: '', duration: '' });
    return true; // Signal success for snackbar
  };

  // Handlers for Skills
  const handleSkillsInputChange = (e) => {
    const { name, value } = e.target;
    setSkillsFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsSubmit = (e) => {
    e.preventDefault();
    setSkills((prev) => [...prev, skillsFormData]);
    console.log('Skill submitted:', skillsFormData);
    setSkillsFormData({ skillName: '', proficiency: '' });
    return true; // Signal success for snackbar
  };

  return (
    <div className="container mx-auto p-6 mt-10 ml-10 h-auto">
      {/* Tab Navigation */}
      <nav className="flex space-x-4 mb-5" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabChange(tab.name)}
            className={`py-2 px-4 text-sm font-medium uppercase transition duration-300 ease-in-out  ${
              activeTab === tab.name
                ? "border-b-2 border-[#E90A4D] text-[#E90A4D]"
                : "border-transparent text-gray-500 hover:text-[#E90A4D]"
            }`}
            role="tab"
            aria-selected={activeTab === tab.name}
            aria-controls={`panel-${tab.name}`}
            id={`tab-${tab.name}`}
          >
            {tab.name}
          </button>
        ))}
      </nav>

      {/* Tab Contents */}
      <div className="tab-content transition-opacity duration-300 ease-in-out">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            id={`panel-${tab.name}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.name}`}
            className={`p-4 ${activeTab === tab.name ? "block" : "hidden"}`}
          >
            {tab.name === "Experience" ? (
              <tab.component
                formData={experienceFormData}
                handleInputChange={handleExperienceInputChange}
                handleSubmit={handleExperienceSubmit}
                experiences={experiences}
              />
            ) : tab.name === "Education" ? (
              <tab.component
                formData={educationFormData}
                handleInputChange={handleEducationInputChange}
                handleSubmit={handleEducationSubmit}
                educations={educations}
              />
            ) : tab.name === "Skills" ? (
              <tab.component
                formData={skillsFormData}
                handleInputChange={handleSkillsInputChange}
                handleSubmit={handleSkillsSubmit}
                skills={skills}
              />
            ) : (
              <tab.component />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(TabBar);