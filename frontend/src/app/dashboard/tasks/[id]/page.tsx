"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaUser,
  FaCopy,
} from "react-icons/fa";
import Button from "@/components/ui/Button";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (error) {
        console.error("Failed to fetch task:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id, router]);

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this task? This action cannot be undone.",
      )
    ) {
      try {
        setDeleting(true);
        await api.delete(`/tasks/${id}`);
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to delete task:", error);
        alert("Failed to delete task");
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleToggleComplete = async () => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      // Refresh task data
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(task.title);
    // Visual feedback
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center p-8">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-gray-200/50 dark:border-gray-800/50 animate-pulse">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl animate-pulse" />
            <div className="w-3/4 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-xl mx-auto w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl mx-auto w-1/3" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl mx-auto w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaTasks className="w-12 h-12 text-red-500/80" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Task not found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The task you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-3"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;
  const priorityColor = {
    LOW: "border-green-200 bg-green-50/50 text-green-800",
    MEDIUM: "border-yellow-200 bg-yellow-50/50 text-yellow-800",
    HIGH: "border-red-200 bg-red-50/50 text-red-800",
  }[task.priority];

  const statusColor = {
    PENDING: "border-orange-200 bg-orange-50/50 text-orange-800",
    IN_PROGRESS: "border-blue-200 bg-blue-50/50 text-blue-800",
    COMPLETED: "border-emerald-200 bg-emerald-50/50 text-emerald-800",
  }[task.status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Back Navigation */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors duration-200 hover:scale-105"
          >
            <FaArrowLeft className="w-5 h-5" />
            Back to Tasks
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Task Card */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl overflow-hidden">
          {/* Header */}
          <div
            className={`p-8 border-b border-gray-100/50 dark:border-gray-800/50 ${priorityColor}`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {/* Priority Badge */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${priorityColor}`}
                  >
                    {task.priority}
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${statusColor}`}
                  >
                    {task.status.replace("_", " ")}
                  </div>

                  {isOverdue && (
                    <div className="px-3 py-1 bg-red-500/90 text-white rounded-full text-xs font-bold shadow-lg animate-pulse border border-red-400/50">
                      OVERDUE
                    </div>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                  {task.title}
                </h1>

                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {/* Created */}
                  <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    <span>
                      Created {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Due Date */}
                  {task.dueDate && (
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt
                        className={`w-4 h-4 ${isOverdue ? "text-red-500" : "text-indigo-600"}`}
                      />
                      <span
                        className={
                          isOverdue ? "text-red-600 font-semibold" : ""
                        }
                      >
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Toggle Complete */}
              <label className="relative p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={handleToggleComplete}
                  className="sr-only peer"
                />
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 border-4 ${
                    task.isCompleted
                      ? "bg-emerald-500 border-emerald-400 shadow-emerald-300/50"
                      : "bg-white border-gray-200 dark:border-gray-700 shadow-gray-200/50 hover:border-indigo-300 hover:shadow-indigo-200/50"
                  }`}
                >
                  {task.isCompleted ? (
                    <FaCheckCircle className="w-7 h-7 text-white" />
                  ) : (
                    <FaStar className="w-5 h-5 text-indigo-500" />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {task.description && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  Description
                </h3>
                <div className="prose prose-lg max-w-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="group p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <FaEdit className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Edit Task
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update title, description, or details
                </p>
              </div>

              <div className="group p-6 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <FaCopy className="w-6 h-6 text-emerald-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Copy Link
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share this task with team
                </p>
              </div>

              <div
                className="group p-6 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                onClick={handleDelete}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FaTrash className="w-6 h-6 text-red-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Delete Task
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Permanently remove this task
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100/50 dark:border-gray-800/50">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaUser className="w-5 h-5 text-gray-500" />
                  Task Info
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100/50 dark:border-gray-800/50">
                    <span className="text-gray-600 dark:text-gray-400">ID</span>
                    <code className="font-mono bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded text-xs">
                      {task.id.slice(0, 8)}...
                    </code>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100/50 dark:border-gray-800/50">
                    <span className="text-gray-600 dark:text-gray-400">
                      Created
                    </span>
                    <span className="font-medium">
                      {new Date(task.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Updated
                    </span>
                    <span className="font-medium">
                      {new Date(task.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaStar className="w-5 h-5 text-yellow-500" />
                  Priority Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className={`p-4 rounded-xl border-2 ${priorityColor}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span>Priority Level</span>
                      <span className="font-bold text-lg">{task.priority}</span>
                    </div>
                    <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          task.priority === "HIGH"
                            ? "bg-red-500 w-3/4"
                            : task.priority === "MEDIUM"
                              ? "bg-yellow-500 w-1/2"
                              : "bg-green-500 w-1/4"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={false}
        onClose={() => {}}
        onSubmit={() => {}}
        initialData={null}
      />
    </div>
  );
}
