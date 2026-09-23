import { useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiChevronRight,
  FiFilter,
  FiPlay,
  FiSearch,
  FiTool,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// =========================================================
// SAMPLE TASK DATA
// =========================================================

const initialTasks = [
  {
    id: "TASK-1001",
    projectId: "PRJ-1001",
    estimateId: "EST-10245",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    task: "Design",
    workType: "Design",
    dueDate: "2026-09-18",
    priority: "High",
    status: "Completed",
    progress: 100,
    quantity: 500,
    startedAt: "2026-09-18T09:10:00",
    completedAt: "2026-09-18T10:42:00",
  },
  {
    id: "TASK-1002",
    projectId: "PRJ-1001",
    estimateId: "EST-10245",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    task: "Printing",
    workType: "Offset Printing",
    dueDate: "2026-09-18",
    priority: "High",
    status: "In Progress",
    progress: 70,
    quantity: 500,
    startedAt: "2026-09-18T11:15:00",
    completedAt: null,
  },
  {
    id: "TASK-1003",
    projectId: "PRJ-1001",
    estimateId: "EST-10245",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    task: "Cutting",
    workType: "Finishing",
    dueDate: "2026-09-18",
    priority: "Medium",
    status: "Pending",
    progress: 0,
    quantity: 500,
    startedAt: null,
    completedAt: null,
  },
  {
    id: "TASK-1004",
    projectId: "PRJ-1002",
    estimateId: "EST-10246",
    projectName: "Wedding Invitation Cards",
    customer: "Sita Karki",
    task: "Printing",
    workType: "Digital Printing",
    dueDate: "2026-09-18",
    priority: "Medium",
    status: "Pending",
    progress: 0,
    quantity: 300,
    startedAt: null,
    completedAt: null,
  },
  {
    id: "TASK-1005",
    projectId: "PRJ-1002",
    estimateId: "EST-10246",
    projectName: "Wedding Invitation Cards",
    customer: "Sita Karki",
    task: "Lamination",
    workType: "Lamination",
    dueDate: "2026-09-19",
    priority: "Low",
    status: "Pending",
    progress: 0,
    quantity: 300,
    startedAt: null,
    completedAt: null,
  },
  {
    id: "TASK-1006",
    projectId: "PRJ-1003",
    estimateId: "EST-10247",
    projectName: "Restaurant Menu Printing",
    customer: "Hari Thapa",
    task: "Printing",
    workType: "Offset Printing",
    dueDate: "2026-09-18",
    priority: "Urgent",
    status: "In Progress",
    progress: 45,
    quantity: 1000,
    startedAt: "2026-09-18T08:45:00",
    completedAt: null,
  },
  {
    id: "TASK-1007",
    projectId: "PRJ-1003",
    estimateId: "EST-10247",
    projectName: "Restaurant Menu Printing",
    customer: "Hari Thapa",
    task: "Binding",
    workType: "Finishing",
    dueDate: "2026-09-18",
    priority: "High",
    status: "Pending",
    progress: 0,
    quantity: 1000,
    startedAt: null,
    completedAt: null,
  },
  {
    id: "TASK-1008",
    projectId: "PRJ-1004",
    estimateId: "EST-10248",
    projectName: "Flex Banner Design",
    customer: "Aashish Gurung",
    task: "Printing",
    workType: "Flex Printing",
    dueDate: "2026-09-18",
    priority: "Urgent",
    status: "Completed",
    progress: 100,
    quantity: 20,
    startedAt: "2026-09-18T08:00:00",
    completedAt: "2026-09-18T09:25:00",
  },
];

// =========================================================
// MAIN COMPONENT
// =========================================================

const StaffTasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // -------------------------------------------------------
  // DATE
  // -------------------------------------------------------

  const today = "2026-09-18";

  // -------------------------------------------------------
  // START TASK
  // -------------------------------------------------------

  const startTask = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          status: "In Progress",
          progress: task.progress === 0 ? 10 : task.progress,
          startedAt: task.startedAt || new Date().toISOString(),
        };
      }),
    );
  };

  // -------------------------------------------------------
  // COMPLETE TASK
  // -------------------------------------------------------

  const completeTask = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          status: "Completed",
          progress: 100,
          completedAt: new Date().toISOString(),
        };
      }),
    );
  };

  // -------------------------------------------------------
  // REOPEN TASK
  // -------------------------------------------------------

  const reopenTask = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          status: "In Progress",
          progress: task.progress === 100 ? 50 : task.progress,
          completedAt: null,
        };
      }),
    );
  };

  // -------------------------------------------------------
  // TODAY'S TASKS
  // -------------------------------------------------------

  const todayTasks = useMemo(() => {
    return tasks.filter((task) => task.dueDate === today);
  }, [tasks]);

  // -------------------------------------------------------
  // TODAY COUNTS
  // -------------------------------------------------------

  const todayPending = todayTasks.filter(
    (task) => task.status === "Pending",
  ).length;

  const todayInProgress = todayTasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  const todayCompleted = todayTasks.filter(
    (task) => task.status === "Completed",
  ).length;

  // -------------------------------------------------------
  // SORT TODAY'S TASKS
  // -------------------------------------------------------

  const sortedTodayTasks = useMemo(() => {
    const priorityOrder = {
      Urgent: 1,
      High: 2,
      Medium: 3,
      Low: 4,
    };

    const statusOrder = {
      "In Progress": 1,
      Pending: 2,
      Completed: 3,
    };

    return [...todayTasks].sort((a, b) => {
      const priorityDifference =
        priorityOrder[a.priority] - priorityOrder[b.priority];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [todayTasks]);

  // -------------------------------------------------------
  // SEARCH + FILTER
  // -------------------------------------------------------

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchableText = `
        ${task.id}
        ${task.projectId}
        ${task.estimateId}
        ${task.projectName}
        ${task.customer}
        ${task.task}
        ${task.workType}
      `.toLowerCase();

      const matchesSearch = searchableText.includes(
        search.toLowerCase().trim(),
      );

      const matchesFilter = filter === "All" || task.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  // -------------------------------------------------------
  // DATE FORMAT
  // -------------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="p-5 md:p-8">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Today's Work
              </h1>

              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                Production
              </span>
            </div>

            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Tasks assigned to you for today's production work.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
              <FiCalendar size={17} />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Work Date</p>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                18 September 2026
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            SIMPLE SUMMARY
        ================================================== */}

        <div className="mb-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-900">
          <SummaryItem
            label="Pending"
            value={todayPending}
            description="Waiting to start"
            type="pending"
          />

          <SummaryItem
            label="In Progress"
            value={todayInProgress}
            description="Currently working"
            type="progress"
          />

          <SummaryItem
            label="Completed"
            value={todayCompleted}
            description="Finished today"
            type="completed"
          />
        </div>

        {/* =================================================
            TODAY'S TASKS
        ================================================== */}

        <section>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Today's Tasks
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {todayTasks.length}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Start or complete your assigned production work.
            </p>
          </div>

          <div className="space-y-3">
            {sortedTodayTasks.map((task) => (
              <TodayTask
                key={task.id}
                task={task}
                onStart={startTask}
                onComplete={completeTask}
                onReopen={reopenTask}
                onView={() => navigate(`/staff/tasks/${task.id}`)}
                formatDate={formatDate}
              />
            ))}
          </div>
        </section>

        {/* =================================================
            ALL TASKS
        ================================================== */}

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              All My Tasks
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              View upcoming and previously assigned work.
            </p>
          </div>

          {/* SEARCH + FILTER */}

          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks, projects or customers..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-orange-500/10"
              />
            </div>

            <div className="relative sm:w-48">
              <FiFilter
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-600 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-orange-500/10"
              >
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* TASK LIST */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {filteredTasks.length}{" "}
                {filteredTasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>

            {filteredTasks.length > 0 ? (
              <div>
                {filteredTasks.map((task, index) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onStart={startTask}
                    onComplete={completeTask}
                    onView={() => navigate(`/staff/tasks/${task.id}`)}
                    formatDate={formatDate}
                    isLast={index === filteredTasks.length - 1}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                search={search}
                filter={filter}
                clear={() => {
                  setSearch("");
                  setFilter("All");
                }}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

// =========================================================
// TODAY TASK
// =========================================================

const TodayTask = ({
  task,
  onStart,
  onComplete,
  onReopen,
  onView,
  formatDate,
}) => {
  const isCompleted = task.status === "Completed";
  const isProgress = task.status === "In Progress";

  return (
    <div
      className={`group rounded-2xl border bg-white transition hover:shadow-sm dark:bg-slate-900 ${
        task.priority === "Urgent" && !isCompleted
          ? "border-red-200 dark:border-red-500/20"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* MAIN INFO */}

          <button
            type="button"
            onClick={onView}
            className="min-w-0 flex-1 text-left"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold tracking-wide text-orange-500">
                {task.estimateId}
              </span>

              <PriorityBadge priority={task.priority} />

              <StatusBadge status={task.status} />
            </div>

            <div className="mt-2.5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                <FiTool size={17} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-slate-900 transition group-hover:text-orange-500 dark:text-white dark:group-hover:text-orange-400">
                  {task.projectName}
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  {task.task} · {task.workType}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <FiUser size={13} />
                {task.customer}
              </span>

              <span>{task.quantity} pcs</span>

              <span className="flex items-center gap-1.5">
                <FiCalendar size={13} />
                {formatDate(task.dueDate)}
              </span>
            </div>
          </button>

          {/* PROGRESS */}

          <div className="w-full lg:w-44">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Progress
              </span>

              <span className="text-xs font-bold text-orange-500">
                {task.progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted ? "bg-green-500" : "bg-orange-500"
                }`}
                style={{
                  width: `${task.progress}%`,
                }}
              />
            </div>
          </div>

          {/* ACTION */}

          <div className="flex shrink-0 items-center gap-2">
            {!isCompleted && (
              <button
                type="button"
                onClick={onView}
                className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:border-orange-200 hover:text-orange-500 sm:inline-flex dark:border-slate-700 dark:text-slate-300 dark:hover:border-orange-500/30 dark:hover:text-orange-400"
              >
                Details
                <FiChevronRight size={13} />
              </button>
            )}

            {task.status === "Pending" && (
              <button
                type="button"
                onClick={() => onStart(task.id)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600 sm:flex-none"
              >
                <FiPlay size={13} />
                Start
              </button>
            )}

            {isProgress && (
              <button
                type="button"
                onClick={() => onComplete(task.id)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-green-600 sm:flex-none"
              >
                <FiCheck size={14} />
                Complete
              </button>
            )}

            {isCompleted && (
              <button
                type="button"
                onClick={() => onReopen(task.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-600 transition hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
              >
                <FiCheckCircle size={14} />
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// TASK LIST ITEM
// =========================================================

const TaskListItem = ({
  task,
  onStart,
  onComplete,
  onView,
  formatDate,
  isLast,
}) => {
  return (
    <div
      className={`group p-4 transition hover:bg-slate-50 sm:px-5 dark:hover:bg-slate-800/40 ${
        !isLast ? "border-b border-slate-100 dark:border-slate-800" : ""
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* ICON */}

        <button
          type="button"
          onClick={onView}
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-orange-50 hover:text-orange-500 sm:flex dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
        >
          <FiTool size={16} />
        </button>

        {/* DETAILS */}

        <button
          type="button"
          onClick={onView}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-orange-500 dark:text-slate-100 dark:group-hover:text-orange-400">
              {task.projectName}
            </p>

            <span className="text-[10px] font-bold text-orange-500">
              {task.estimateId}
            </span>
          </div>

          <p className="mt-1 truncate text-xs text-slate-400">
            {task.task} · {task.customer}
          </p>
        </button>

        {/* DUE */}

        <div className="hidden w-28 shrink-0 lg:block">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Due
          </p>

          <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
            {formatDate(task.dueDate)}
          </p>
        </div>

        {/* PRIORITY */}

        <div className="hidden shrink-0 sm:block">
          <PriorityBadge priority={task.priority} />
        </div>

        {/* STATUS */}

        <div className="shrink-0">
          <StatusBadge status={task.status} />
        </div>

        {/* ACTION */}

        <div className="hidden shrink-0 sm:block">
          {task.status === "Pending" && (
            <button
              type="button"
              onClick={() => onStart(task.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-orange-600"
            >
              <FiPlay size={12} />
              Start
            </button>
          )}

          {task.status === "In Progress" && (
            <button
              type="button"
              onClick={() => onComplete(task.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-600"
            >
              <FiCheck size={13} />
              Complete
            </button>
          )}

          {task.status === "Completed" && (
            <button
              type="button"
              onClick={onView}
              className="p-2 text-slate-400 transition hover:text-orange-500"
              title="View task"
            >
              <FiChevronRight size={17} />
            </button>
          )}
        </div>

        {/* MOBILE VIEW */}

        <button
          type="button"
          onClick={onView}
          className="shrink-0 p-2 text-slate-400 sm:hidden"
          aria-label="View task details"
        >
          <FiChevronRight size={17} />
        </button>
      </div>

      {/* MOBILE ACTION */}

      <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />

          <span className="text-[11px] text-slate-400">
            {formatDate(task.dueDate)}
          </span>
        </div>

        {task.status === "Pending" && (
          <button
            type="button"
            onClick={() => onStart(task.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold text-white"
          >
            <FiPlay size={12} />
            Start
          </button>
        )}

        {task.status === "In Progress" && (
          <button
            type="button"
            onClick={() => onComplete(task.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white"
          >
            <FiCheck size={13} />
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

// =========================================================
// SUMMARY ITEM
// =========================================================

const SummaryItem = ({ label, value, description, type }) => {
  const styles = {
    pending: {
      dot: "bg-amber-500",
      number: "text-amber-600 dark:text-amber-400",
    },
    progress: {
      dot: "bg-orange-500",
      number: "text-orange-600 dark:text-orange-400",
    },
    completed: {
      dot: "bg-green-500",
      number: "text-green-600 dark:text-green-400",
    },
  };

  const style = styles[type];

  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r dark:border-slate-800">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />

      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>

        <div className="mt-0.5 flex items-baseline gap-2">
          <p className={`text-2xl font-bold ${style.number}`}>{value}</p>

          <p className="text-[10px] text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = ({ status }) => {
  const styles = {
    Pending:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",

    "In Progress":
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",

    Completed:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[status] || ""}`}
    >
      {status === "Completed" && <FiCheck size={10} />}

      {status === "In Progress" && (
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
      )}

      {status === "Pending" && (
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      )}

      {status}
    </span>
  );
};

// =========================================================
// PRIORITY BADGE
// =========================================================

const PriorityBadge = ({ priority }) => {
  const styles = {
    Urgent:
      "border-red-100 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",

    High: "border-orange-100 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",

    Medium:
      "border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",

    Low: "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[priority] || ""}`}
    >
      {priority}
    </span>
  );
};

// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = ({ search, filter, clear }) => {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <FiSearch size={20} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-white">
        No tasks found
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        Try changing your search or status filter.
      </p>

      {(search || filter !== "All") && (
        <button
          type="button"
          onClick={clear}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 transition hover:text-orange-600"
        >
          <FiX size={13} />
          Clear filters
        </button>
      )}
    </div>
  );
};

export default StaffTasks;
