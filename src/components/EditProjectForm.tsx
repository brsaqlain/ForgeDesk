"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EditProjectFormProps = {
  projectId: string;
  currentTitle: string;
};

export default function EditProjectForm({
  projectId,
  currentTitle,
}: EditProjectFormProps) {
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update project.");
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded-lg border p-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}