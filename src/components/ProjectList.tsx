import ProjectSearch from "@/components/ProjectSearch";

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

      <ProjectSearch projects={projects} />
    </div>
  );
}