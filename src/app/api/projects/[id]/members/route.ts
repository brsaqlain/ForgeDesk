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
  });

  if (!project) {
    return Response.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const members = await prisma.projectMember.findMany({
    where: {
      projectId: id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return Response.json(members);
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
      { error: "Only the project owner can add members" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return Response.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return Response.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  if (user.id === project.ownerId) {
    return Response.json(
      { error: "Owner is already part of the project" },
      { status: 400 }
    );
  }

  const existingMember =
    await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: user.id,
        },
      },
    });

  if (existingMember) {
    return Response.json(
      { error: "User is already a member" },
      { status: 409 }
    );
  }

  const member = await prisma.projectMember.create({
    data: {
      projectId: id,
      userId: user.id,
      role: "MEMBER",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  await prisma.activity.create({
    data: {
      projectId: id,
      message: `Added ${user.email} to the project`,
    },
  });

  return Response.json(member, {
    status: 201,
  });
}