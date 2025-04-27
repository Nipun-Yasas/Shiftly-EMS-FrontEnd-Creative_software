const demoProjects = [
  {
    id: 1,
    title: "Empowering Norway’s largest e-health solutions provider",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project1.jpg",
    logo: "/images/dips_logo.png",
  },
  {
    id: 2,
    title: "Streamlining Healthcare Operations Across Multiple Countries with IFS APP10",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project2.jpg",
    logo: "/images/mediq_logo.png",
  },
  {
    id: 3,
    title: "A seamless IFS cloud upgrade for TV Industries",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project3.jpg",
    logo: "/images/m_logo.png",
  },
  {
    id: 4,
    title: "Building a Scalable Multi-System Travel Booking Platform for the Nordics",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project4.jpg",
    logo: "/images/booknordics_logo.png",
  },
  {
    id: 5,
    title: "Empowering Norway’s largest e-health solutions provider",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project1.jpg",
    logo: "/images/dips_logo.png",
  },
  {
    id: 6,
    title: "Streamlining Healthcare Operations Across Multiple Countries with IFS APP10",
    createdDate: "Apr 23, 2020",
    status: "Active",
    director: "Kristen Jom Stocklund",
    imageUrl: "/images/project2.jpg",
    logo: "/images/mediq_logo.png",
  },
];

export default function AllProjects(){
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#e80a4d]">All Projects</h1>
          <p className="text-sm text-gray-500 mt-1">All Projects &gt;</p>
        </div>

        <div className="bg-white shadow-xl rounded-xl px-16 py-6">
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-16">
            {demoProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-xl hover:shadow-md transition duration-200"
              >
                <img
                  src={project.imageUrl}
                  alt="Project"
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <img src={project.logo} alt="Logo" className="h-5" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{project.title}</h3>
                  <p className="text-xs text-gray-600 pt-2">
                    <strong>Created:</strong> {project.createdDate}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Project Status:</strong>
                    <span className="text-green-600 font-medium">{project.status}</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Software Engineering Director:</strong> {project.director}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

