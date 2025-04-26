"use client";
import React, { useState } from "react";

/**
 * Component for displaying the projects the user is assigned to
 * @returns {JSX.Element} The projects list section
 */
const ProjectsList = () => {
  const [projects] = useState([
    { id: 1, name: "E_Bench_Engineering", active: true },
    { id: 2, name: "E_Company_Wide_Task", active: false },
    { id: 3, name: "E_CRM_Code_Events", active: false },
    { id: 4, name: "E_CRM_Delivery_Admin", active: false },
    { id: 5, name: "E_CRM_Delivery_Sales", active: false },
    { id: 6, name: "E_CRM_Code_Events", active: false },
    { id: 7, name: "E_Community_of_Practice", active: false },
    { id: 8, name: "E_Marketing_and_Training_Support", active: false },
    { id: 9, name: "E_VTL_Upskilling", active: false },
    { id: 10, name: "E_Interview", active: true },
    { id: 11, name: "E_Performance_Evaluations", active: false },
    { id: 12, name: "E_Project_1", active: false },
  ]);
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex flex-col p-5 bg-white rounded-2xl h-full">
      <div className="flex justify-between items-center mb-3" onClick={toggleExpand} style={{ cursor: 'pointer' }}>
        <h2 className="text-base text-black">Projects you are assigned to ({projects.length})</h2>
        <button className="flex justify-center items-center w-6 h-6 text-black">
          <i className={`ti ti-chevron-${isExpanded ? 'up' : 'down'}`} aria-hidden="true"></i>
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="relative mb-4">
            <i className="ti ti-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-9 pr-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className={`px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                  project.active 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={project.name}
              >
                {project.name}
              </div>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="text-gray-500 w-full text-center py-4">
                No projects found matching your search.
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ProjectsList;