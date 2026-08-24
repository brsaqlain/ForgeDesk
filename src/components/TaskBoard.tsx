"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

type TaskBoardProps = {
  projectId: string;
  tasks: Task[];
};

const columns = [
  {
    status: "TODO" as const,
    title: "To Do",
  },
  {
    status: "IN_PROGRESS" as const,
    title: "In Progress",
  },
  {
    status: "DONE" as const,
    title: "Done",
  },
];

function TaskCard({
  task,
  onDelete,
  onUpdate,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (id: string, status: Task["status"]) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing"
      >
        <p className="font-medium">
          {task.title}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {task.status !== "TODO" && (
          <button
            type="button"
            onClick={() =>
              onUpdate(task.id, "TODO")
            }
            className="rounded bg-gray-200 px-2 py-1 text-xs"
          >
            To Do
          </button>
        )}

        {task.status !== "IN_PROGRESS" && (
          <button
            type="button"
            onClick={() =>
              onUpdate(task.id, "IN_PROGRESS")
            }
            className="rounded bg-blue-100 px-2 py-1 text-xs"
          >
            In Progress
          </button>
        )}

        {task.status !== "DONE" && (
          <button
            type="button"
            onClick={() =>
              onUpdate(task.id, "DONE")
            }
            className="rounded bg-green-100 px-2 py-1 text-xs"
          >
            Done
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="rounded bg-red-100 px-2 py-1 text-xs text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Column({
  status,
  title,
  tasks,
  onDelete,
  onUpdate,
}: {
  status: Task["status"];
  title: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, status: Task["status"]) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="min-h-72 rounded-xl bg-gray-100 p-4"
    >
      <h3 className="mb-4 font-semibold">
        {title}
      </h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}

        {tasks.length === 0 && (
          <p className="text-sm text-gray-400">
            Drop tasks here
          </p>
        )}
      </div>
    </div>
  );
}

export default function TaskBoard({
  projectId,
  tasks,
}: TaskBoardProps) {
  const router = useRouter();

  const [activeTask, setActiveTask] =
    useState<Task | null>(null);

  async function updateTask(
    taskId: string,
    status: Task["status"]
  ) {
    const response = await fetch(
      `/api/projects/${projectId}/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      alert("Failed to update task.");
      return;
    }

    router.refresh();
  }

  async function deleteTask(taskId: string) {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    const response = await fetch(
      `/api/projects/${projectId}/tasks/${taskId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      alert("Failed to delete task.");
      return;
    }

    router.refresh();
  }

  function handleDragStart(
    event: DragStartEvent
  ) {
    const task = tasks.find(
      (task) => task.id === event.active.id
    );

    setActiveTask(task ?? null);
  }

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const task = tasks.find(
      (task) => task.id === active.id
    );

    if (!task) {
      return;
    }

    const newStatus =
      over.id as Task["status"];

    if (task.status === newStatus) {
      return;
    }

    await updateTask(task.id, newStatus);
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((column) => (
          <Column
            key={column.status}
            status={column.status}
            title={column.title}
            tasks={tasks.filter(
              (task) =>
                task.status === column.status
            )}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rounded-lg bg-white p-4 shadow-lg">
            {activeTask.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}