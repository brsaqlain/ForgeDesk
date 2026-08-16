"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CreateTaskFormProps = {
  projectId: string;
};

export default function CreateTaskForm({
  projectId,
}: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create task");
      }

      setTitle("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to create task.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex gap-2"
    >
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded-lg border p-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}