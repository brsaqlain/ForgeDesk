import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

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
    },
  });

  if (!project) {
    return Response.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const question = body.question?.trim();

  if (!question) {
    return Response.json(
      { error: "Question is required" },
      { status: 400 }
    );
  }

  const taskSummary = project.tasks
    .map(
      (task) =>
        `- ${task.title} [${task.status}]`
    )
    .join("\n");

  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: `
You are the AI assistant for a project management
application called ForgeDesk.

Project: ${project.title}

Tasks:
${taskSummary || "No tasks yet."}

User question:
${question}

Answer based primarily on the project and task
information provided above. Be concise and useful.
`,
  });

  return Response.json({
    answer: response.output_text,
  });
}