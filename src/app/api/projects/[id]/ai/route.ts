import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(
  request: Request,
  { params }: RouteProps
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        {
          error:
            "GEMINI_API_KEY is missing. Check your .env file.",
        },
        { status: 500 }
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

    const taskSummary =
      project.tasks.length > 0
        ? project.tasks
            .map(
              (task) =>
                `- ${task.title} [${task.status}]`
            )
            .join("\n")
        : "No tasks yet.";

    const prompt = `
You are the AI assistant for ForgeDesk, a project management application.

Project:
${project.title}

Tasks:
${taskSummary}

User question:
${question}

Give a concise, practical answer based on the project information above.
Do not invent tasks or information that isn't provided.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const answer =
      response.text ||
      "Gemini did not return an answer.";

    await prisma.activity.create({
      data: {
        projectId: id,
        message: `Asked ForgeDesk AI: "${question}"`,
      },
    });

    return Response.json({
      answer,
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gemini request failed",
      },
      { status: 500 }
    );
  }
}