"use client";

import { useState, useEffect, useRef } from "react";
import type { Task } from "@/app/components/hooks/DriveHook";
import { Plus, Trash2, ClipboardList, Pencil, Check, X } from "lucide-react";
import { useLanguage } from "@/app/components/hooks/LanguageHook";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTaskItem } from "./SortableTaskItem";

interface PacketProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  saveTasks: (tasks: Task[]) => Promise<void>;
  isLoading: boolean;
}

export default function TaskList({
  tasks,
  setTasks,
  saveTasks,
  isLoading,
}: PacketProps) {
  const { t } = useLanguage();
  const [newTaskText, setNewTaskText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + N to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ... (keep addTask, toggleTask, deleteTask functions as is) check next diff for logic retention

  const addTask = async () => {
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText,
      completed: false,
      createdAt: Date.now(),
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    setNewTaskText("");

    setIsSaving(true);
    await saveTasks(updatedTasks);
    setIsSaving(false);
  };

  const toggleTask = async (id: string) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);

    setIsSaving(true);
    await saveTasks(updatedTasks);
    setIsSaving(false);
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);

    setIsSaving(true);
    await saveTasks(updatedTasks);
    setIsSaving(false);
  };

  // Editing Functions
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async () => {
    if (!editingId || !editText.trim()) return;

    const updatedTasks = tasks.map((t) =>
      t.id === editingId ? { ...t, text: editText } : t
    );
    setTasks(updatedTasks);
    setEditingId(null);
    setEditText("");

    setIsSaving(true);
    await saveTasks(updatedTasks);
    setIsSaving(false);
  };

  // Drag and Drop Logic
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks); // Optimistic update
      saveTasks(newTasks); // Persist
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Input Area */}
        <div className="flex gap-2 items-center bg-base-100 p-2 rounded-full shadow-lg border border-base-300 focus-within:ring-2 ring-primary transition-all">
          <input
            className="input input-ghost w-full focus:outline-hidden text-lg pl-6"
            ref={inputRef}
            placeholder={t("task.placeholder")}
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            disabled={isLoading}
            autoFocus
          />
          <button
            className="btn btn-primary btn-circle rounded-full transition-all hover:scale-105"
            onClick={addTask}
            disabled={isLoading || !newTaskText.trim()}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 && !isLoading ? (
            <div className="text-center py-10 opacity-50 flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <ClipboardList
                className="w-16 h-16 mb-4 text-base-content/30"
                strokeWidth={1}
              />
              <p className="text-lg font-medium">{t("task.empty.title")}</p>
              <p className="text-sm">{t("task.empty.subtitle")}</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={tasks}
                strategy={verticalListSortingStrategy}
              >
                {tasks.map((task) => (
                  <SortableTaskItem key={task.id} id={task.id}>
                    <div
                      className={`group flex items-center gap-4 p-4 rounded-2xl bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all duration-200 hover:border-primary/20 cursor-pointer select-none ${
                        task.completed ? "opacity-60 bg-base-200/50" : ""
                      }`}
                      onClick={() => toggleTask(task.id)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        startEditing(task);
                      }}
                    >
                      {editingId === task.id ? (
                        // Edit Mode
                        <div
                          className="flex items-center gap-2 w-full animate-in fade-in zoom-in duration-200"
                          onClick={(e) => e.stopPropagation()}
                          onDoubleClick={(e) => e.stopPropagation()}
                        >
                          <input
                            className="input input-bordered w-full"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit();
                              if (e.key === "Escape") cancelEditing();
                            }}
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="btn btn-circle btn-sm btn-success text-white"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="btn btn-circle btn-sm btn-ghost"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {}} // Handled by parent onClick
                            onClick={(e) => e.stopPropagation()} // Prevent double toggle
                            className="checkbox checkbox-primary checkbox-lg rounded-full border-2 pointer-events-none"
                          />
                          <span
                            className={`flex-1 text-lg transition-all duration-200 ${
                              task.completed
                                ? "line-through text-base-content/50"
                                : "text-base-content font-medium"
                            }`}
                            title="Click to toggle, Double click to edit"
                          >
                            {task.text}
                          </span>

                          {/* Actions Group */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(task);
                              }}
                              className="btn btn-ghost btn-circle btn-sm text-info hover:bg-info/10 hover:scale-110"
                              aria-label="Edit task"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(task.id);
                              }}
                              className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10 hover:scale-110"
                              aria-label="Delete task"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </SortableTaskItem>
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
