"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Tasks", href: "/tasks" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        onClick={() => console.log("hi")}
        className="bg-white/90  border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 group hover:scale-105 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:rotate-3 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent transition-all duration-200 group-hover:scale-105">
                  TaskFlow
                </h1>
                <p className="text-xs text-gray-500 font-medium transition-all duration-200 group-hover:translate-x-1">
                  Manage Smartly
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group hover:scale-105 ${
                    pathname === link.href
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                      : "text-gray-600 hover:text-gray-900 text-[14px] "
                  }`}
                >
                  <span
                    className={`relative z-10 transition-colors duration-200 ${pathname === link.href ? "text-white" : ""}`}
                  >
                    {link.name}
                  </span>
                  {pathname === link.href && (
                    <div className="absolute inset-0 bg-indigo-500 rounded-full -z-10 shadow-lg shadow-indigo-500/25 blur-sm scale-110" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-gray-600 hidden lg:block animate-pulse">
                    Welcome 👋
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    Logout
                  </button>
                  <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:scale-110 hover:rotate-5 transition-all duration-200 cursor-pointer">
                    <FaUserCircle className="w-5 h-5" />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-sm hover:scale-105 hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-6 h-6 text-gray-700" />
              ) : (
                <FaBars className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/95 dark:bg-gray-100 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 hover:scale-105 ${
                    pathname === link.href
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-100 transform scale-105"
                      : "text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-100 hover:text-indigo-100 "
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-gray-200/50 space-y-3">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold hover:scale-110 transition-all duration-200">
                      <FaUserCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">User Name</p>
                      <p className="text-sm text-gray-500">user@example.com</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 bg-gray-100 text-red-600 hover:bg-red-500/20 border border-red-500/30 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    className="w-full text-lg block py-3 px-4 text-center font-medium text-gray-700 hover:t ext-indigo-600 bg-gray-100  rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="w-full block py-3.5 px-4 text-center font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 hover:-translate-y-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
