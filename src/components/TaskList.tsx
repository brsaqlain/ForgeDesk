"use client";

import dynamic from "next/dynamic";

type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

type TaskListProps = {
  projectId: string;
  tasks: Task[];
};

const TaskBoard = dynamic(
  () => import("@/components/TaskBoard"),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 md:grid-cols-3">
        <div className="min-h-72 rounded-xl bg-gray-100 p-4">
          Loading...
        </div>

        <div className="min-h-72 rounded-xl bg-gray-100 p-4">
          Loading...
        </div>

        <div className="min-h-72 rounded-xl bg-gray-100 p-4">
          Loading...
        </div>
      </div>
    ),
  }
);

export default function TaskList({
  projectId,
  tasks,
}: TaskListProps) {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">
        Tasks
      </h2>

      <TaskBoard
        projectId={projectId}
        tasks={tasks}
      />
    </div>
  );
}