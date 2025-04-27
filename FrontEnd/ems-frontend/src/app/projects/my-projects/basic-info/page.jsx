'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MyProject = () => {
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
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-[#E90A4D] mb-2">My Project</h1>
      <p className="text-sm text-gray-500 mb-4">project / my project</p>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-150 mb-6">
          <div className="flex items-center gap-2">
            <Image
              src={project.logo}
              alt="Project Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <div className="flex gap-6 border-b border-gray-200">
            {[{ name: "BASIC INFO", href: "/projects/my-projects/basic-info" },
              { name: "TEAM", href: "/projects/my-projects/team" }].map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`pb-2 text-sm font-medium ${isActive ? "border-b-2 border-[#E90A4D] text-[#E90A4D]" : "text-gray-600 hover:text-[#E90A4D]"}`}
                  >
                    {tab.name}
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
            <div>
              <p>
                <span className="font-semibold">Project Dates:</span> {project.projectDates}
              </p>
              <p>
                <span className="font-semibold">Client:</span> {project.client}
              </p>
              <p>
                <span className="font-semibold">Project Entity:</span> {project.projectEntity}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Project Status:</span> {project.status}
              </p>
              <p>
                <span className="font-semibold">Client:</span> {project.client}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Project Description:</span> {project.description}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <h3 className="font-semibold mb-4 text-gray-800">Software Engineering Director:</h3>
          <div className="flex items-center gap-4 mb-6 bg-gray-100 px-6 py-3 rounded-lg max-w-sm">
            <Image
              src={project.director.image}
              alt={project.director.name}
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
            <p className="text-gray-800">{project.director.name}</p>
          </div>

          <h3 className="font-semibold mb-4 text-gray-800">Team Leads:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {project.teamLeads.map((lead, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-gray-100 px-6 py-3 rounded-lg"
              >
                <Image
                  src={lead.image}
                  alt={lead.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <p className="text-gray-800">{lead.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProject;