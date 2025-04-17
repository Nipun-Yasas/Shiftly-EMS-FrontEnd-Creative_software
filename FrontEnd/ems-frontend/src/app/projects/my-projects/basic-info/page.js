"use client";

import '../../../globals.css';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MyProjectPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white px-8 pb-8 pt-6">
      <h1 className="text-4xl font-bold text-[#E90A4D] mb-2">My Project</h1>
      <p className="text-sm text-gray-500 mb-6">project / my project</p>

      <div className="bg-white rounded-2xl shadow-lg px-12 py-10 space-y-8">
        {/* Header with Logo and Tabs */}
        <div className="flex items-center justify-between">
          <Image
            src="/images/dips_logo.png"
            alt="DIPS Logo"
            width={120}
            height={120}
            className="object-contain"
          />

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200">
            {[
              { name: "BASIC INFO", href: "/projects/my-projects/basic-info" },
              { name: "TEAM", href: "/projects/my-projects/team" },
            ].map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`pb-2 text-sm font-medium ${
                    isActive
                      ? "border-b-2 border-[#E90A4D] text-[#E90A4D]"
                      : "text-gray-600 hover:text-[#E90A4D]"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Project Info Section */}
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
            <div>
              <p><span className="font-semibold">Project Dates:</span> Jan 2017 – Dec 2026</p>
              <p><span className="font-semibold">Client:</span> ABC Corp</p>
              <p><span className="font-semibold">Project Entity:</span> Entity Y</p>
            </div>
            <div>
              <p><span className="font-semibold">Project Status:</span> Active</p>
              <p><span className="font-semibold">Client:</span> ABC Group</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Project Description:</span> DIPS AS is Norway’s leading provider of E-healthcare solutions for hospitals. The success of an initial collaboration to develop the first mobile applications led to DIPS establishing additional teams to work on other areas of their product.
          </p>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <h3 className="font-semibold mb-4 text-gray-800">Software Engineering Director:</h3>
          <div className="flex items-center gap-4 mb-8 bg-gray-100 px-6 py-2 rounded-lg">
            <Image
              src="/images/employee1.jpg"
              alt="Director"
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
            <p className="text-gray-800">Kristier Jon Suglund</p>
          </div>

          <h3 className="font-semibold mb-4 text-gray-800">Team Leads:</h3>
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-gray-100 px-6 py-2 rounded-lg"
              >
                <Image
                  src="/images/employee1.jpg"
                  alt="Team Lead"
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <p className="text-gray-800">Kristier Jon Suglund</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
