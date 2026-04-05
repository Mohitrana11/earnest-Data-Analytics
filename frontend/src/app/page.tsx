"use";
import Link from "next/link";
import Header from "@/components/layout/Header";
import taskMan from "../../public/taskMan.png";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <Header />

      {/* Main Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Content */}
            <div className="lg:pr-12 order-2 lg:order-1 animate-fade-in-left">
              {/* <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 rounded-full text-white text-sm font-semibold mb-8 shadow-lg animate-float">
                🚀 Your Task Management Solution
              </div> */}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900 bg-clip-text text-transparent leading-tight mb-6 animate-slide-up">
                Manage Your Tasks <br className="hidden lg:block" />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Smarter, Faster
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-lg animate-slide-up delay-200">
                Organize your work, boost productivity, and achieve your goals
                with our intuitive task management platform built for modern
                teams.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md animate-slide-up delay-400">
                <Link href="/auth/register">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 -skew-x-12"></div>
                  </button>
                </Link>

                <Link href="/auth/login">
                  <button className="px-8 py-4 border-2 text-black cursor-pointer font-semibold text-lg rounded-2xl hover:bg-green-600  hover:shadow-lg  bg-green-200 border-none transition-all duration-300 hover:scale-105">
                    Login Now
                  </button>
                </Link>
              </div>

              {/* Features Highlights */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up delay-600">
                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-md transition-all duration-200 hover:scale-105">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    📱
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Mobile Ready
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-md transition-all duration-200 hover:scale-105">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    ⚡
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Lightning Fast
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-md transition-all duration-200 hover:scale-105">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    🔒
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Secure
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-md transition-all duration-200 hover:scale-105">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    📊
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Analytics
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-md transition-all duration-200 hover:scale-105">
                  <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    👥
                  </div>
                  W
                  <span className="text-sm font-medium text-gray-700">
                    Team Sync
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50 hover:shadow-md transition-all duration-200 hover:scale-105">
                  <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    🎨
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Beautiful UI
                  </span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative animate-fade-in-right">
              <div className="relative z-10">
                {/* Main Illustration */}
                <img
                  src={taskMan}
                  alt="Task Management Illustration"
                  className="w-full max-w-md mx-auto lg:max-w-lg rounded-3xl shadow-2xl ring-4 ring-white/50 hover:scale-105 transition-all duration-500 cursor-pointer"
                />

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-2xl blur-xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-xl animate-pulse delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
