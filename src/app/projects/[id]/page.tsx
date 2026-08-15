import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id,
      ownerId: session.user.id,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <p className="text-sm text-gray-500">
          Project
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          📁 {project.title}
        </h1>

        <p className="mt-4 text-gray-600">
          Created on{" "}
          {project.createdAt.toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}