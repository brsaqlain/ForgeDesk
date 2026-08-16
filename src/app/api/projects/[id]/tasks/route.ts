import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
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

  const tasks = await prisma.task.findMany({
    where: {
      projectId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(tasks);
}

export async function POST(
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

  const body = await request.json();
  const title = body.title?.trim();

  if (!title) {
    return Response.json(
      { error: "Task title is required" },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
    data: {
      title,
      projectId: id,
    },
  });

  return Response.json(task, {
    status: 201,
  });
}