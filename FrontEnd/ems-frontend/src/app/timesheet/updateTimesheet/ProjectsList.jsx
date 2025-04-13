"use client";
import React, { useState } from "react";

/**
 * Component for displaying assigned projects
 * @returns {JSX.Element} The projects list section
 */
const ProjectsList = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedProject, setSelectedProject] = useState("E_Bench_Engineering");

  const projects = [
    "E_Bench_Engineering",
    "E_Company_Web_Site",
    "E_CNSL_Corp_Events",
    "E_CNSL_Delivery_Admin",
    "E_CNSL_Delivery_Admin",
    "E_ENG_Delivery_Admin",
    "E_ENG_Corp_Events",
    "E_Performance_Evaluations",
    "E_Community_of_Practice",
    "E_Marketing and Training Support",
    "E_VFQ_Upskilling",
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  return (
    <section className="p-5 bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl text-black">
          Projects you are assigned to (12)
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="projects-list"
          className="cursor-pointer ml-auto"
        >
          <i
            className={`ti ti-chevron-${isExpanded ? "up" : "down"}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isExpanded && (
        <div
          id="projects-list"
          className="flex flex-wrap gap-3 max-sm:flex-col"
        >
          {projects.map((project, index) => (
            <button
              key={index}
              className={`px-4 py-2 text-xs rounded-2xl border-2 border-blue-500 border-solid ${
                project === selectedProject
                  ? "text-white bg-blue-500"
                  : "text-zinc-800 bg-transparent"
              }`}
              onClick={() => handleProjectClick(project)}
              aria-pressed={project === selectedProject}
            >
              {project}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsList;
