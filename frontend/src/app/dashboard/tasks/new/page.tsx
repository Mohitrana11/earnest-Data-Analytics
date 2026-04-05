"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import TaskCard from "@/components/tasks/TaskCard";
import TaskModal from "@/components/tasks/TaskModal";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort,
  FaTasks,
  FaList,
  FaGrid,
} from "react-icons/fa";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      const tasksData = res.data.tasks || res.data;
      setTasks(tasksData);
      setFilteredTasks(tasksData);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Advanced Filter & Search
  useEffect(() => {
    let filtered = [...tasks];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === "dueDate") {
        return (
          new Date(a.dueDate || 0).getTime() -
          new Date(b.dueDate || 0).getTime()
        );
      }
      if (sortBy === "status") {
        const statusOrder = { PENDING: 1, IN_PROGRESS: 2, COMPLETED: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterPriority, filterStatus, sortBy]);

  const handleCreate = async (data: any) => {
    await api.post("/tasks", data);
    fetchTasks();
  };

  const handleUpdate = async (data: any) => {
    await api.patch(`/tasks/${editTask.id}`, data);
    setEditTask(null);
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    }
  };

  const handleToggle = async (id: string) => {
    await api.patch(`/tasks/${id}/toggle`);
    fetchTasks();
  };

  const stats = {
    total: tasks.length,
    highPriority: tasks.filter((t) => t.priority === "HIGH").length,
    overdue: tasks.filter(
      (t) => new Date(t.dueDate || 0) < new Date() && !t.isCompleted,
    ).length,
    today: tasks.filter((t) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(t.dueDate || 0);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              All Tasks
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto">
              Organize, prioritize, and complete your tasks with ease
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="group bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center hover:bg-white/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold mb-1">{stats.total}</div>
              <div className="text-indigo-100 font-medium">Total Tasks</div>
            </div>
            <div className="group bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center hover:bg-white/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-red-300 mb-1">
                {stats.highPriority}
              </div>
              <div className="text-indigo-100 font-medium">High Priority</div>
            </div>
            <div className="group bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center hover:bg-white/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-orange-300 mb-1">
                {stats.overdue}
              </div>
              <div className="text-indigo-100 font-medium">Overdue</div>
            </div>
            <div className="group bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 text-center hover:bg-white/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-emerald-300 mb-1">
                {stats.today}
              </div>
              <div className="text-indigo-100 font-medium">Due Today</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => setOpen(true)}
              className="group relative px-10 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white hover:bg-white/30 text-white font-semibold text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <FaPlus className="w-6 h-6 mr-3 inline group-hover:scale-110 transition-transform" />
              Add New Task
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter & Search Bar */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-3xl p-8 mb-12 shadow-xl">
          <div className="flex flex-col xl:flex-row xl:items-center gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-2xl">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="🔍 Search tasks by title, description, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl text-lg focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 placeholder-gray-500 shadow-lg hover:border-indigo-300"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 order-first xl:order-last">
              {/* View Toggle */}
              <div className="flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-1 shadow-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300/50"
                      : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                  }`}
                >
                  <FaGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300/50"
                      : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                  }`}
                >
                  <FaList className="w-5 h-5" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-1 shadow-lg items-center gap-1">
                <div className="p-2">
                  <FaFilter className="w-5 h-5 text-gray-500" />
                </div>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-3 bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="all">All Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-1 shadow-lg items-center">
                <div className="p-2">
                  <FaSort className="w-5 h-5 text-gray-500" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="priority">Priority</option>
                  <option value="dueDate">Due Date</option>
                  <option value="status">Status</option>
                  <option value="createdAt">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
            <div className="text-lg font-semibold text-white/90">
              Showing{" "}
              <span className="text-indigo-200">{filteredTasks.length}</span> of{" "}
              <span className="text-indigo-200">{tasks.length}</span> tasks
            </div>
            <div className="text-sm text-indigo-200">
              Updated {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Tasks Display */}
        <div
          className={`transition-all duration-300 ${viewMode === "list" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}`}
        >
          {loading ? (
            // Loading Skeleton
            Array.from({ length: viewMode === "list" ? 6 : 12 }, (_, i) => (
              <div
                key={i}
                className={`animate-pulse bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/30 dark:border-gray-800/30 overflow-hidden ${
                  viewMode === "list"
                    ? "p-6 flex items-center gap-6 h-28"
                    : "p-6 h-80"
                }`}
              >
                <div
                  className={`${viewMode === "list" ? "w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-700" : "w-full h-full rounded-xl bg-gray-300 dark:bg-gray-700"}`}
                />
              </div>
            ))
          ) : filteredTasks.length === 0 ? (
            // Empty State
            <div className="col-span-full text-center py-24 px-8">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <FaTasks className="w-16 h-16 text-indigo-500/80" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                No tasks match your filters
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                Try adjusting your search, filters, or create a new task to get
                started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                >
                  <FaPlus className="w-5 h-5" />
                  Create New Task
                </button>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterPriority("all");
                    setFilterStatus("all");
                    setSortBy("priority");
                  }}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-lg rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={(t) => {
                  setEditTask(t);
                  setOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setEditTask(null);
        }}
        onSubmit={editTask ? handleUpdate : handleCreate}
        initialData={editTask}
      />
    </div>
  );
}
