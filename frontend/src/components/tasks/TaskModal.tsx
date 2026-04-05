"use client";

import { useState, useEffect } from "react";
import { FaCalendarAlt, FaCheckCircle, FaTimes, FaPlus } from "react-icons/fa";
import Input from "../ui/Input";
import Button from "../ui/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
};

const PRIORITY_COLORS = {
  LOW: "bg-green-100 text-green-800 border-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  HIGH: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_COLORS = {
  PENDING: "bg-orange-100 text-orange-800 border-orange-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "PENDING" as const,
    priority: "MEDIUM" as const,
    dueDate: "",
    isCompleted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "PENDING",
        priority: initialData.priority || "MEDIUM",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : "",
        isCompleted: initialData.isCompleted || false,
      });
    } else {
      // Reset form for new task
      setForm({
        title: "",
        description: "",
        status: "PENDING" as const,
        priority: "MEDIUM" as const,
        dueDate: "",
        isCompleted: false,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate) : null,
      });
      onClose();
    } catch (error) {
      console.error("Task submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-blur"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-800/50 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200">
                {initialData ? (
                  <FaPlus className="w-6 h-6 text-white" />
                ) : (
                  <FaPlus className="w-6 h-6 text-white animate-pulse" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {initialData ? "Edit Task" : "Create New Task"}
                </h2>
                <p className="text-sm text-gray-500">
                  {initialData
                    ? "Update your task details"
                    : "Add a new task to your list"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110 hover:rotate-90"
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Task Title *
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter a clear, actionable task title..."
                className="text-lg font-semibold focus:ring-4 focus:ring-indigo-500/20"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Add details, steps, or notes about this task..."
                rows={4}
                className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-vertical text-base placeholder-gray-500"
              />
            </div>

            {/* Status & Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as any })
                    }
                    className="w-full p-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer hover:border-blue-300"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <div
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 ${STATUS_COLORS[form.status as keyof typeof STATUS_COLORS]}`}
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value as any })
                    }
                    className="w-full p-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none cursor-pointer hover:border-orange-300"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  <div
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 ${PRIORITY_COLORS[form.priority as keyof typeof PRIORITY_COLORS]}`}
                  />
                </div>
              </div>
            </div>

            {/* Due Date & Completed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4 text-gray-500" />
                  Due Date (Optional)
                </label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>

              {/* Completed Toggle */}
              <div className="flex items-center justify-center md:justify-start pt-2">
                <label className="flex items-center space-x-3 cursor-pointer group hover:scale-105 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={form.isCompleted}
                    onChange={(e) =>
                      setForm({ ...form, isCompleted: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="relative w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors">
                    Mark Complete
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 rounded-2xl -mx-1 px-1">
              <Button
                type="submit"
                disabled={isSubmitting || !form.title.trim()}
                className="flex-1 group relative overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {initialData ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    {initialData ? "Update Task" : "Create Task"}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 hover:scale-105 hover:shadow-md transition-all duration-200 border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
