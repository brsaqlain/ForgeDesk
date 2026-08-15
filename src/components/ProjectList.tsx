import ProjectCard from "@/components/ProjectCard";

type Project = {
  id: string;
  title: string;
  createdAt: Date;
};

type ProjectListProps = {
  projects: Project[];
};

export default function ProjectList({
  projects,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed p-8 text-center">
        <p className="text-gray-500">
          You don't have any projects yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">
        Your Projects
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}