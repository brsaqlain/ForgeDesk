"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
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

type TaskListProps = {
  projectId: string;
  tasks: Task[];
};

const columns = [
  { status: "TODO" as const, title: "To Do" },
  { status: "IN_PROGRESS" as const, title: "In Progress" },
  { status: "DONE" as const, title: "Done" },
];

function TaskCard({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: (id: string) => void;
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
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg bg-white p-4 shadow-sm active:cursor-grabbing"
    >
      <p className="font-medium">{task.title}</p>

      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onDelete(task.id)}
        className="mt-3 rounded bg-red-100 px-2 py-1 text-xs text-red-600"
      >
        Delete
      </button>
    </div>
  );
}

function Column({
  status,
  title,
  tasks,
  onDelete,
}: {
  status: Task["status"];
  title: string;
  tasks: Task[];
  onDelete: (id: string) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="min-h-72 rounded-xl bg-gray-100 p-4"
    >
      <h3 className="mb-4 font-semibold">{title}</h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
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

export default function TaskList({
  projectId,
  tasks,
}: TaskListProps) {
  const router = useRouter();
  const [activeTask, setActiveTask] = useState<Task | null>(
    null
  );

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
    if (!window.confirm("Delete this task?")) return;

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

  function handleDragStart(event: any) {
    const task = tasks.find(
      (task) => task.id === event.active.id
    );

    setActiveTask(task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;

    const task = tasks.find(
      (task) => task.id === active.id
    );

    if (!task) return;

    const newStatus = over.id as Task["status"];

    if (task.status === newStatus) return;

    await updateTask(task.id, newStatus);
  }

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">
        Tasks
      </h2>

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
                (task) => task.status === column.status
              )}
              onDelete={deleteTask}
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
    </div>
  );
}