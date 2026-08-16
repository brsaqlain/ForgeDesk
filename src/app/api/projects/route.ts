import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { title } = await request.json();

  if (!title?.trim()) {
    return Response.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const project = await prisma.project.create({
    data: {
      title: title.trim(),
      ownerId: session.user.id,
    },
  });

  return Response.json(project, {
    status: 201,
  });
}