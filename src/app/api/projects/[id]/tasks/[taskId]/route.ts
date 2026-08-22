import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    id: string;
    taskId: string;
  }>;
};

const statusNames: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

async function getProjectAccess(
  projectId: string,
  userId: string
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        {
          ownerId: userId,
        },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    include: {
      members: {
        where: {
          userId,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const isOwner = project.ownerId === userId;

  const role = isOwner
    ? "OWNER"
    : project.members[0]?.role;

  return {
    project,
    role,
  };
}

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

  const { id, taskId } = await params;

  const access = await getProjectAccess(
    id,
    session.user.id
  );

  if (!access) {
    return Response.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const body = await request.json();

  if (!statusNames[body.status]) {
    return Response.json(
      { error: "Invalid task status" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId: id,
    },
  });

  if (!task) {
    return Response.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status: body.status,
    },
  });

  await prisma.activity.create({
    data: {
      message: `Moved "${task.title}" to ${statusNames[body.status]}`,
      projectId: id,
    },
  });

  return Response.json(updatedTask);
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

  const { id, taskId } = await params;

  const access = await getProjectAccess(
    id,
    session.user.id
  );

  if (!access) {
    return Response.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId: id,
    },
  });

  if (!task) {
    return Response.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  await prisma.activity.create({
    data: {
      message: `Deleted task "${task.title}"`,
      projectId: id,
    },
  });

  return Response.json({
    message: "Task deleted successfully",
  });
}