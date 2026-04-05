"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaCalendarAlt,
  FaStar,
} from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "PENDING" as const,
    priority: "MEDIUM" as const,
    dueDate: "",
    isCompleted: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tasks/${id}`);
        const taskData = res.data;
        setForm({
          title: taskData.title || "",
          description: taskData.description || "",
          status: taskData.status || "PENDING",
          priority: taskData.priority || "MEDIUM",
          dueDate: taskData.dueDate
            ? new Date(taskData.dueDate).toISOString().split("T")[0]
            : "",
          isCompleted: taskData.isCompleted || false,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load task");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await api.patch(`/tasks/${id}`, {
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate) : null,
      });
      router.push(`/dashboard/tasks/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const PRIORITY_COLORS = {
    LOW: "ring-green-500/20 border-green-200 hover:border-green-300",
    MEDIUM: "ring-yellow-500/20 border-yellow-200 hover:border-yellow-300",
    HIGH: "ring-red-500/20 border-red-200 hover:border-red-300",
  };

  const STATUS_COLORS = {
    PENDING: "ring-orange-500/20 border-orange-200 hover:border-orange-300",
    IN_PROGRESS: "ring-blue-500/20 border-blue-200 hover:border-blue-300",
    COMPLETED:
      "ring-emerald-500/20 border-emerald-200 hover:border-emerald-300",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 flex items-center justify-center p-8">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-12 w-full max-w-2xl mx-auto animate-pulse">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl animate-pulse" />
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl w-3/4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              <div className="grid grid-cols-2 gap-4 h-12">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
            >
              <FaArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Task
            </button>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleUpdate}
                disabled={saving || !form.title.trim()}
                className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 font-semibold text-lg"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 inline-block" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Update Task
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-6 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaTimes className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                  Update Failed
                </h4>
                <p className="text-red-800 dark:text-red-200 text-sm">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <FaEdit className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Edit Task</h1>
                <p className="text-indigo-100">
                  Update your task details below
                </p>
              </div>
            </div>

            {/* Priority & Status Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-xl border-2 ${PRIORITY_COLORS[form.priority as keyof typeof PRIORITY_COLORS]} group hover:shadow-lg transition-all duration-200 cursor-pointer`}
                onClick={() => {}}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FaStar className="w-5 h-5" />
                  <span className="font-semibold">Priority</span>
                </div>
                <span className="text-lg font-bold">{form.priority}</span>
              </div>

              <div
                className={`p-4 rounded-xl border-2 ${STATUS_COLORS[form.status as keyof typeof STATUS_COLORS]} group hover:shadow-lg transition-all duration-200 cursor-pointer`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FaCheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Status</span>
                </div>
                <span className="text-lg font-bold capitalize">
                  {form.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleUpdate} className="p-8 space-y-8">
            {/* Title */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Task Title *
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter a clear, actionable title for your task..."
                className="text-2xl font-bold h-16 focus:ring-4 focus:ring-indigo-500/30 shadow-lg"
                required
              />
              {form.title.length === 0 && (
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  💡 Write a specific, actionable title (max 100 chars
                  recommended)
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe this task in detail. Include steps, requirements, notes, or any relevant information..."
                rows={8}
                className="w-full p-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 resize-vertical text-lg shadow-lg placeholder-gray-500"
              />
            </div>

            {/* Advanced Options */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <FaStar className="w-6 h-6 text-yellow-500" />
                Advanced Options
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value as any })
                      }
                      className={`w-full p-4 pr-12 border-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 appearance-none cursor-pointer shadow-lg hover:shadow-md ${STATUS_COLORS[form.status as keyof typeof STATUS_COLORS]}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      value={form.priority}
                      onChange={(e) =>
                        setForm({ ...form, priority: e.target.value as any })
                      }
                      className={`w-full p-4 pr-12 border-2 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-300 appearance-none cursor-pointer shadow-lg hover:shadow-md ${PRIORITY_COLORS[form.priority as keyof typeof PRIORITY_COLORS]}`}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FaCalendarAlt className="w-5 h-5 text-gray-500" />
                    Due Date (Optional)
                  </label>
                  <Input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                    className="shadow-lg hover:shadow-md transition-all duration-200 focus:ring-4 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              {/* Completed Toggle */}
              <div className="pt-6 border-t border-gray-100/50 dark:border-gray-800/50">
                <label className="flex items-center space-x-4 cursor-pointer group hover:scale-105 transition-all duration-200 p-4 rounded-2xl hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                  <input
                    type="checkbox"
                    checked={form.isCompleted}
                    onChange={(e) =>
                      setForm({ ...form, isCompleted: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="relative w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 shadow-lg"></div>
                  <div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white block">
                      Mark as Complete
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Check to mark task as completed
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100/50 dark:border-gray-800/50 bg-gradient-to-r from-white/70 to-indigo-50/70 dark:from-gray-900/70 dark:to-slate-900/70 rounded-3xl -mx-2 px-2 py-4">
              <Button
                type="submit"
                disabled={saving || !form.title.trim()}
                className="flex-1 group relative overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 font-semibold text-lg px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              >
                {saving ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3 inline-block" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <FaSave className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                    Update Task
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
                className="flex-1 px-8 py-4 font-semibold text-lg border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-lg hover:shadow-indigo-200/50 transition-all duration-300 shadow-sm"
              >
                <FaArrowLeft className="w-5 h-5 mr-2 -ml-1" />
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
