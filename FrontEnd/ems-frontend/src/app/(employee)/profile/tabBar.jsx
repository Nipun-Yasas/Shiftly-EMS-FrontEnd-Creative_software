"use client";

import { useState } from "react";
import BasicInfoForm from './basicinfo/basicInfoForm'
import PersonalInfoForm from './personalinfo/personalInfoForm'
import ProjectContent from './projects/page'
import ExperienceContent from './experience/page'
import EducationContent from './education/page'
import SkillsContent from './skills/page'



export default function tabBar() {
  const [activeTab, setActiveTab] = useState("Basic Info"); // Default active tab

  return (
    <div className="container h-auto mx-auto pl-0 p-6 mt-10 ml-10">
     

      {/* Tab Navigation */}
      <ul className="flex space-x-4 mb-5 ">
      <li className="text-center">
            <button
                onClick={() => setActiveTab("Basic Info")}
                className={`py-2 px-4 text-sm font-medium uppercase ${
                  activeTab === "Basic Info"
                  ? " border-b-2 border-[color:#E90A4D] text-[color:#E90A4D]"
                  :  "border-transparent text-[color:#6B7280] hover:text-[color:#E90A4D] transition duration-500 ease-in-out"
              }`}
            >
                Basic Info
            </button>
            </li>
            <li className="text-center">
            <button
                onClick={() => setActiveTab("Personal Info")}
                className={`py-2 px-4 text-sm font-medium uppercase ${
                  activeTab === "Personal Info"
                  ? " border-b-2 border-[color:#E90A4D] text-[color:#E90A4D]"
                  :  "border-transparent text-[color:#6B7280] hover:text-[color:#E90A4D] transition duration-500 ease-in-out"
              }`}
            >
                Personal Info
            </button>
            </li>
            <li className="text-center">
            <button
                onClick={() => setActiveTab("Projects")}
                className={`py-2 px-4 text-sm font-medium uppercase ${
                  activeTab === "Projects"
                  ? " border-b-2 border-[color:#E90A4D] text-[color:#E90A4D]"
                  :  "border-transparent text-[color:#6B7280] hover:text-[color:#E90A4D] transition duration-500 ease-in-out"
              }`}
            >
                Projects
            </button>
            </li>
            <li className="text-center">
            <button
                onClick={() => setActiveTab("Experience")}
                className={`py-2 px-4 text-sm font-medium uppercase ${
                  activeTab === "Experience"
                  ? " border-b-2 border-[color:#E90A4D] text-[color:#E90A4D]"
                  :  "border-transparent text-[color:#6B7280] hover:text-[color:#E90A4D] transition duration-500 ease-in-out"
              }`}
            >
               Experience
            </button>
            </li>
            <li className="text-center">
            <button
                onClick={() => setActiveTab("Education")}
                className={`py-2 px-4 text-sm font-medium uppercase ${
                  activeTab === "Education"
                  ? " border-b-2 border-[color:#E90A4D] text-[color:#E90A4D]"
                  :  "border-transparent text-[color:#6B7280] hover:text-[color:#E90A4D] transition duration-500 ease-in-out"
              }`}
            >
                Education
            </button>
            </li>
            <li className="text-center">
            <button
                onClick={() => setActiveTab("Skills")}
                className={`py-2 px-4 text-sm font-medium uppercase ${
                  activeTab === "Skills"
                  ? " border-b-2 border-[color:#E90A4D] text-[color:#E90A4D]"
                  :  "border-transparent text-[color:#6B7280] hover:text-[color:#E90A4D] transition duration-500 ease-in-out"
              }`}
            >
               Skills
            </button>
            </li>
      </ul>

      {/* Tab Contents */}
      <div className="tab-content">
        {activeTab === "Basic Info" && (
          <div className="p-4">
            <BasicInfoForm/>
            
          </div>
        )}
        {activeTab === "Personal Info" && (
          <div className="p-4">
            <PersonalInfoForm/>
          </div>
        )}
        {activeTab === "Projects" && (
          <div className="p-4">
            
            <ProjectContent/>
          </div>
        )}
        {activeTab === "Experience" && (
          <div className="p-4">
            <ExperienceContent/>
          </div>
        )}
        {activeTab === "Education" && (
          <div className="p-4">
            <EducationContent/>
          </div>
        )}
        {activeTab === "Skills" && (
          <div className="p-4">
            <SkillsContent/>
          </div>
        )}
      </div>
    </div>
  );
}
