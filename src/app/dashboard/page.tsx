import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import CreateProjectForm from "@/components/CreateProjectForm";
import ProjectList from "@/components/ProjectList";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
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

        <CreateProjectForm />

        <ProjectList projects={projects} />
      </div>
    </main>
  );
}