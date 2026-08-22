"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Member = {
  id: string;
  role: "ADMIN" | "MEMBER";
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type ProjectMembersProps = {
  projectId: string;
  members: Member[];
};

export default function ProjectMembers({
  projectId,
  members,
}: ProjectMembersProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function addMember(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to add member"
        );
      }

      setEmail("");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add member"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-2xl font-bold">
        Team Members
      </h2>

      <form
        onSubmit={addMember}
        className="flex gap-2"
      >
        <input
          type="email"
          placeholder="Enter user's email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          className="flex-1 rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:bg-gray-400"
        >
          {loading ? "Adding..." : "Add Member"}
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {members.length === 0 ? (
          <p className="rounded-lg border border-dashed p-5 text-center text-sm text-gray-500">
            No team members yet.
          </p>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">
                  {member.user.name}
                </p>

                <p className="text-sm text-gray-500">
                  {member.user.email}
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                {member.role}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}