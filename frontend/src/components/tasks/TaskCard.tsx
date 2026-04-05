import {
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

type Props = {
  task: any;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: any) => void;
};

const PRIORITY_ICONS = {
  LOW: "🟢",
  MEDIUM: "🟡",
  HIGH: "🔴",
};

const PRIORITY_COLORS = {
  LOW: "bg-green-100 text-green-800 border-green-200 ring-green-200/50",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200 ring-yellow-200/50",
  HIGH: "bg-red-100 text-red-800 border-red-200 ring-red-200/50",
};

const STATUS_COLORS = {
  PENDING: "bg-orange-100 text-orange-800 border-orange-200 ring-orange-200/50",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200 ring-blue-200/50",
  COMPLETED:
    "bg-emerald-100 text-emerald-800 border-emerald-200 ring-emerald-200/50",
};

export default function TaskCard({ task, onToggle, onDelete, onEdit }: Props) {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

  // ✅ NATIVE DATE FORMATTING - No date-fns needed
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusText = () => {
    if (task.isCompleted) return "Completed";
    if (isOverdue) return "Overdue";
    if (task.status === "IN_PROGRESS") return "In Progress";
    return "Pending";
  };

  return (
    <div className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:ring-4 hover:ring-indigo-200/50 overflow-hidden">
      {/* Priority Badge */}
      <div
        className={`absolute -top-3 -right-3 p-2 rounded-full shadow-lg ${PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]}`}
      >
        <span className="text-xs font-bold">
          {PRIORITY_ICONS[task.priority as keyof typeof PRIORITY_ICONS]}
        </span>
      </div>

      {/* Overdue Badge */}
      {isOverdue && (
        <div className="absolute -top-3 -left-3 bg-red-500/95 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse border-2 border-red-400/50">
          OVERDUE
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h3
              className={`text-xl font-bold mb-1 transition-all duration-200 pr-2 ${
                task.isCompleted
                  ? "line-through text-gray-500 decoration-2"
                  : "text-gray-900 dark:text-white group-hover:text-indigo-600"
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-sm leading-relaxed transition-all duration-200 ${
                  task.isCompleted
                    ? "text-gray-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {task.description}
              </p>
            )}
          </div>

          {/* Toggle Checkbox */}
          <label className="relative inline-flex items-center cursor-pointer p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => onToggle(task.id)}
              className="sr-only peer"
            />
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 border-4 hover:shadow-lg ${
                task.isCompleted
                  ? "bg-emerald-500 border-emerald-400 shadow-emerald-300/50"
                  : "bg-white border-gray-200 dark:border-gray-700 shadow-gray-200/50 hover:border-indigo-300 hover:shadow-indigo-200/50"
              }`}
            >
              {task.isCompleted ? (
                <FaCheckCircle className="w-6 h-6 text-white" />
              ) : (
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse" />
              )}
            </div>
          </label>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-xs bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-3 -mx-3">
          {/* Status Badge */}
          <div
            className={`px-3 py-1 rounded-full font-semibold border shadow-sm ${STATUS_COLORS[task.status as keyof typeof STATUS_COLORS]} ${getStatusText() === "Overdue" ? "!bg-red-500/95 !text-white !border-red-400 !shadow-red-300/50" : ""}`}
          >
            {getStatusText()}
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full font-medium border shadow-sm ${
                isOverdue
                  ? "bg-red-50/90 text-red-900 border-red-200 shadow-red-200/50"
                  : "bg-indigo-50 text-indigo-900 border-indigo-200 shadow-indigo-200/50"
              }`}
            >
              <FaCalendarAlt className="w-3 h-3 flex-shrink-0" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}

          {/* Created Time */}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-gray-800/80 px-2 py-1 rounded-lg border">
            <FaClock className="w-3 h-3 flex-shrink-0" />
            <span>{formatCreatedDate(task.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100/50 bg-gradient-to-r from-white/70 to-indigo-50/50 dark:from-gray-900/70 dark:to-slate-900/50 rounded-b-xl -mx-3 px-3 py-3">
          <button
            onClick={() => onEdit(task)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-100/80 dark:hover:bg-blue-900/50 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-blue-200/50 hover:-translate-y-0.5"
            title="Edit Task"
          >
            <FaEdit className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-100/80 dark:hover:bg-red-900/50 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-red-200/50 hover:-translate-y-0.5"
            title="Delete Task"
          >
            <FaTrash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm scale-[1.02]" />
    </div>
  );
}
