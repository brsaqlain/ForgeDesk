"use client";

import { useState } from "react";

type ProjectAIProps = {
  projectId: string;
};

export default function ProjectAI({
  projectId,
}: ProjectAIProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        `/api/projects/${projectId}/ai`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get AI response"
        );
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);

      setAnswer(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 rounded-xl border bg-gray-50 p-6">
      <h2 className="text-2xl font-bold">
        🤖 ForgeDesk AI
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Ask questions about this project and its tasks.
      </p>

      <form
        onSubmit={askAI}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          placeholder="What should I work on next?"
          className="flex-1 rounded-lg border bg-white p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-5 py-2 text-white disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      {answer && (
        <div className="mt-5 rounded-lg border bg-white p-5">
          <p className="whitespace-pre-wrap text-sm leading-6">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}