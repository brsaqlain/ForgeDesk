"use client";

import { useRouter } from "next/navigation";

export default function BackToDashboard() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard")}
      className="mb-6 text-sm font-medium text-blue-600 hover:underline"
    >
      ← Back to Dashboard
    </button>
  );
}