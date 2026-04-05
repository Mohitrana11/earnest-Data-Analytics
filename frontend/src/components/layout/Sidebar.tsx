"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth"; // Your auth hook
import {
  FaHome,
  FaTasks,
  FaChartBar,
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
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();

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
      name: "Analytics",
      href: "/analytics",
      icon: FaChartBar,
      color: "text-purple-600",
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-0 z-50 p-4 bg-white shadow-xl border-r border-gray-200 hover:shadow-2xl hover:scale-105 md:hidden"
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6 text-gray-700" />
        ) : (
          <FaBars className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-20 left-0 h-screen w-72 bg-white shadow-2xl border-r border-gray-200 z-40 transform transition-all duration-500 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 p-6 border-b border-gray-100 z-10 bg-white">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaTasks className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Quick search..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-6 py-8 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-px ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border-2 border-indigo-200 shadow-md font-semibold"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-4 ${isActive ? item.color : `group-hover:${item.color}`}`}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="border-t border-gray-100 px-6 py-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-all border hover:border-indigo-200">
              <FaPlus className="w-4 h-4" />
              New Task
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all border hover:border-emerald-200">
              <FaCheckCircle className="w-4 h-4" />
              Mark All Complete
            </button>
          </div>
        </div>

        {/* Profile & Logout */}
        <div className="border-t border-gray-100 p-6 bg-white sticky bottom-0">
          <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all cursor-pointer mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {user?.username || "John Doe"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {user?.email || "john@example.com"}
              </p>
            </div>
            <FaUser className="w-5 h-5 text-gray-500" />
          </div>

          {/* ✅ REAL LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all hover:shadow-md font-medium border hover:border-red-200"
          >
            <FaSignOutAlt className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(true)}
        />
      )}
    </>
  );
}
