import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

import EditProjectForm from "@/components/EditProjectForm";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import CreateTaskForm from "@/components/CreateTaskForm";
import TaskList from "@/components/TaskList";
import BackToDashboard from "@/components/BackToDashboard";
import ActivityList from "@/components/ActivityList";
import ProjectMembers from "@/components/ProjectMembers";

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id,
      OR: [
        {
          ownerId: session.user.id,
        },
        {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ],
    },
    include: {
      tasks: true,
      activities: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const isOwner = project.ownerId === session.user.id;

  const currentMember = project.members.find(
    (member) => member.userId === session.user.id
  );

  const isAdmin =
    currentMember?.role === "ADMIN";

  const canEditProject = isOwner || isAdmin;
  const canManageMembers = isOwner;

  const totalTasks = project.tasks.length;

  const todoTasks = project.tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const inProgressTasks = project.tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completedTasks = project.tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-8 shadow">

        <BackToDashboard />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Project
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              📁 {project.title}
            </h1>

            <p className="mt-2 text-gray-600">
              Created on{" "}
              {project.createdAt.toLocaleDateString()}
            </p>

            <div className="mt-3">
              {isOwner ? (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                  OWNER
                </span>
              ) : (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {currentMember?.role}
                </span>
              )}
            </div>
          </div>

          {isOwner && (
            <DeleteProjectButton
              projectId={project.id}
            />
          )}
        </div>

        {canEditProject && (
          <EditProjectForm
            projectId={project.id}
            currentTitle={project.title}
          />
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-4">

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
              To Do
            </p>

            <p className="mt-2 text-3xl font-bold">
              {todoTasks}
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

        <CreateTaskForm
          projectId={project.id}
        />

        <TaskList
          projectId={project.id}
          tasks={project.tasks}
        />

        {canManageMembers && (
          <ProjectMembers
            projectId={project.id}
            members={project.members}
          />
        )}

        <ActivityList
          activities={project.activities}
        />

      </div>
    </main>
  );
}