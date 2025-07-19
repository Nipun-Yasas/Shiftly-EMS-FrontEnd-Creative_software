'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Paper , Box} from '@mui/material';

export default function MyProject() {
  const pathname = usePathname();

  const project = {
    logo: "/images/dips_logo.png",
    projectDates: "Jan 2017 – Dec 2026",
    client: "ABC Corp",
    projectEntity: "Entity Y",
    status: "Active",
    description:
      "DIPS AS is Norway’s leading provider of E-healthcare solutions for hospitals. The success of an initial collaboration to develop the first mobile applications led to DIPS establishing additional teams to work on other areas of their product.",
    director: {
      name: "Kristier Jon Suglund",
      image: "/images/lead.png",
    },
    teamLeads: Array.from({ length: 8 }).map((_, i) => ({
      name: `Team Lead ${i + 1}`,
      image: "/images/lead.png",
    })),
  };

  return (
    <Paper elevation={10}
      sx={{
        height: '100%',
        width: '100%',
      }}>
      <Box className="rounded-2xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-y-4">
          <Image
            src={project.logo}
            alt="Project Logo"
            width={120}
            height={120}
            className="object-contain"
          />

          <div className="flex gap-6 overflow-x-auto">
            {[{ name: "BASIC INFO", href: "/project/my-projects/basic-info" },
              { name: "TEAM", href: "/project/my-projects/team" }].map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`pb-2 text-sm font-medium whitespace-nowrap ${
                    isActive ? "border-b-2 border-[#E90A4D] text-[#E90A4D]" : " hover:text-[#E90A4D]"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className=" rounded-xl p-6 shadow mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm  mb-6">
            <div>
              <p><span className="font-semibold">Project Dates:</span> {project.projectDates}</p>
              <p><span className="font-semibold">Client:</span> {project.client}</p>
              <p><span className="font-semibold">Project Entity:</span> {project.projectEntity}</p>
            </div>
            <div>
              <p><span className="font-semibold">Project Status:</span> {project.status}</p>
              <p><span className="font-semibold">Client:</span> {project.client}</p>
            </div>
          </div>
          <p className="text-sm">
            <span className="font-semibold">Project Description:</span> {project.description}
          </p>
        </div>

        <Box className=" rounded-xl p-6 shadow mb-6  ">
          <h3 className="font-semibold mb-4">Software Engineering Director:</h3>
          <Box className="flex items-center gap-4 mb-6 px-6 py-3 rounded-lg max-w-sm shadow ">
            <Image
              src={project.director.image}
              alt={project.director.name}
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
            <p className="">{project.director.name}</p>
          </Box>

          <h3 className="font-semibold mb-4 ">Team Leads:</h3>
          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
            {project.teamLeads.map((lead, idx) => (
              <Box
                key={idx}
                className="flex items-center gap-4  px-6 py-3 rounded-lg shadow"
              >
                <Image
                  src={lead.image}
                  alt={lead.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <p className="">{lead.name}</p>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
