"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  FaHome,
  FaTasks,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaPlus,
  FaCheckCircle,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: FaHome,
      color: "text-indigo-600",
    },
    {
      name: "All Tasks",
      href: "/tasks",
      icon: FaTasks,
      color: "text-emerald-600",
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: FaCalendarAlt,
      color: "text-blue-600",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: FaChartBar,
      color: "text-purple-600",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: FaCog,
      color: "text-orange-600",
    },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    router.push("/login");
  };

  return (
    <>
      {/* Collapsible Toggle Button (for narrow screens) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-20 left-0 z-40 p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 shadow-lg md:hidden hover:scale-105 transition-all duration-200"
      >
        {isCollapsed ? (
          <FaBars className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <FaTimes className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Main Sidebar */}
      <aside
        className={`fixed md:static top-20 left-0 h-[calc(100vh-5rem)] w-64 md:w-72 bg-gradient-to-b from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 shadow-2xl z-30 transform transition-all duration-300 ease-in-out ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        } md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100/50 dark:border-gray-800/50 sticky top-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200">
              <FaTasks className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-xs text-gray-500 font-medium">Dashboard</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 placeholder-gray-500 hover:border-indigo-300"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 pt-6 flex-1 overflow-y-auto">
          <div className="space-y-1 mb-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center p-4 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-x-1 hover:bg-gradient-to-r hover:from-white/70 hover:to-indigo-50/70 dark:hover:from-gray-800/70 dark:hover:to-slate-800/70 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-700 dark:text-indigo-400 shadow-lg border-2 border-indigo-200/50 ring-4 ring-indigo-100/50 font-semibold scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 flex-shrink-0 transition-all duration-200 ${
                      isActive ? item.color : `group-hover:${item.color}`
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full shadow-lg" />
                  )}

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-100/30 dark:border-gray-800/30 pt-6 mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-200 hover:shadow-sm hover:scale-[1.02]">
                <FaPlus className="w-4 h-4" />
                New Task
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-xl hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all duration-200 hover:shadow-sm hover:scale-[1.02]">
                <FaCheckCircle className="w-4 h-4" />
                Mark All Complete
              </button>
            </div>
          </div>

          {/* Profile & Logout */}
          <div className="border-t border-gray-100/30 dark:border-gray-800/30 pt-6 mt-auto sticky bottom-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 rounded-t-2xl -mx-4 mb-4">
            <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-200 cursor-pointer hover:scale-[1.02]">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-white/50">
                U
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 truncate">
                  john@example.com
                </p>
              </div>
              <FaUser className="w-4 h-4 text-gray-500 flex-shrink-0" />
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50/60 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-[1.02] font-medium border border-red-100/50 dark:border-red-900/50"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
