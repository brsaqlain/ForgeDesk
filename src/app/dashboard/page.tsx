import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import CreateProjectForm from "@/components/CreateProjectForm";
import ProjectList from "@/components/ProjectList";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      tasks: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalProjects = projects.length;

  const totalTasks = projects.reduce(
    (total, project) => total + project.tasks.length,
    0
  );

  const completedTasks = projects.reduce(
    (total, project) =>
      total +
      project.tasks.filter(
        (task) => task.status === "DONE"
      ).length,
    0
  );

  const inProgressTasks = projects.reduce(
    (total, project) =>
      total +
      project.tasks.filter(
        (task) => task.status === "IN_PROGRESS"
      ).length,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-8 shadow">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              👋 Welcome back!
            </h1>

            <p className="mt-2 text-gray-600">
              {session.user.email}
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Projects
            </p>
            <p className="mt-2 text-3xl font-bold">
              {totalProjects}
            </p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Total Tasks
            </p>
            <p className="mt-2 text-3xl font-bold">
              {totalTasks}
            </p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              In Progress
            </p>
            <p className="mt-2 text-3xl font-bold">
              {inProgressTasks}
            </p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Completed
            </p>
            <p className="mt-2 text-3xl font-bold">
              {completedTasks}
            </p>
          </div>
        </div>

        <CreateProjectForm />

        <ProjectList projects={projects} />

      </div>
    </main>
  );
}