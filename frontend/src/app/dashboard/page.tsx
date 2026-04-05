"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import TaskCard from "../../components/tasks/TaskCard";
import TaskModal from "../../components/tasks/TaskModal";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaSort,
  FaTasks,
  FaClock,
  FaChartBar,
  FaCheckCircle,
} from "react-icons/fa";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
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

  // Filter & Search Logic
  useEffect(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
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
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterStatus, sortBy]);

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
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.isCompleted).length,
  };

  return (
    <div className="pt-21 flex min-h-screen bg-gradient-to-br bg-white">
      <Header />

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black bg-clip-text  mb-3">
                  Welcome Back! 👋
                </h1>
                <p className="text-xl max-w-md">
                  Manage your tasks efficiently with smart filtering and
                  sorting.
                </p>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden self-start lg:self-end w-full lg:w-auto flex items-center justify-center gap-3"
              >
                <FaPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Create New Task
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 -skew-x-12" />
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <FaTasks className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">
                    {stats.total}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Total Tasks
                </h3>
              </div>

              <div className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <FaClock className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    {stats.pending}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Pending
                </h3>
              </div>

              <div className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <FaChartBar className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {stats.inProgress}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  In Progress
                </h3>
              </div>

              <div className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <FaCheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">
                    {stats.completed}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Completed
                </h3>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-3xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder-gray-500 hover:border-indigo-300"
                />
              </div>

              {/* Filters & Sort */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter */}
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 pr-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer hover:border-indigo-300"
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 pr-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer hover:border-indigo-300"
                  >
                    <option value="createdAt">Newest First</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due Date</option>
                  </select>
                  <FaSort className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="space-y-4">
            {loading ? (
              // Loading Skeleton
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-6 animate-pulse shadow-lg hover:shadow-lg"
                  >
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              // Empty State
              <div className="text-center py-20 px-8">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaTasks className="w-12 h-12 text-indigo-500/80" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No tasks yet
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Get started by creating your first task. Organize your work
                  efficiently!
                </p>
                <button
                  onClick={() => setOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <FaPlus className="w-5 h-5" />
                  Create First Task
                </button>
              </div>
            ) : (
              // Tasks Grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTasks.map((task) => (
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
                ))}
              </div>
            )}
          </div>
        </main>
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
