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

  const project = await prisma.project.create({
    data: {
      title,
      ownerId: session.user.id,
    },
  });

  return Response.json(project, {
    status: 201,
  });
}