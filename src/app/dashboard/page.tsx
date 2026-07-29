import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import CreateProjectForm from "@/components/CreateProjectForm";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  const projects = await prisma.project.findMany({
  where: {
    ownerId: session.user.id,
  },
});
console.log(projects);
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              👋 Welcome back!
            </h1>

            <p className="mt-2 text-gray-600">
              {session.user?.email}
            </p>
          </div>

          <LogoutButton />
        </div>

        <CreateProjectForm />
        <div className="mt-8">
  <h2 className="mb-4 text-2xl font-bold">
    Your Projects
  </h2>

  {projects.map((project) => (
    <div
      key={project.id}
      className="mb-2 rounded-lg border p-4"
    >
      {project.title}
    </div>
  ))}
</div>
      </div>
    </main>
  );
}