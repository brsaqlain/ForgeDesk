import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteProps
) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const body = await request.json();
  const title = body.title?.trim();

  if (!title) {
    return Response.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
      ownerId: session.user.id,
    },
  });

  if (!project) {
    return Response.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: project.id,
    },
    data: {
      title,
    },
  });

  return Response.json(updatedProject);
}

export async function DELETE(
  request: Request,
  { params }: RouteProps
) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id,
      ownerId: session.user.id,
    },
  });

  if (!project) {
    return Response.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  await prisma.project.delete({
    where: {
      id: project.id,
    },
  });

  return Response.json({
    message: "Project deleted successfully",
  });
}