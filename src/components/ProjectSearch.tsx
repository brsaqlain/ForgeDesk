"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";

type Project = {
  id: string;
  title: string;
  createdAt: Date;
};

type ProjectSearchProps = {
  projects: Project[];
};

export default function ProjectSearch({
  projects,
}: ProjectSearchProps) {
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="mt-8">
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <p className="mt-6 text-center text-gray-500">
          No projects found.
        </p>
      )}
    </div>
  );
}