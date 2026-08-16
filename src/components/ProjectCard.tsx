import Link from "next/link";

type ProjectCardProps = {
  project: {
    id: string;
    title: string;
    createdAt: Date;
  };
};

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <h3 className="text-lg font-semibold">
        📁 {project.title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Created on {project.createdAt.toLocaleDateString()}
      </p>

      <p className="mt-4 text-sm font-medium text-blue-600">
        Open project →
      </p>
    </Link>
  );
}