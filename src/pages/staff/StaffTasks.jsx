import { useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiFilter,
  FiPackage,
  FiPlay,
  FiSearch,
  FiTool,
  FiUser,
  FiX,
} from "react-icons/fi";

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
  const [tasks, setTasks] = useState(initialTasks);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

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
    const today = "2026-09-18";

    return tasks.filter((task) => task.dueDate === today);
  }, [tasks]);

  // -------------------------------------------------------
  // COUNTS
  // -------------------------------------------------------

  const todayCompleted = todayTasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const todayInProgress = todayTasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  const todayPending = todayTasks.filter(
    (task) => task.status === "Pending",
  ).length;

  const urgentTasks = todayTasks.filter(
    (task) => task.priority === "Urgent" && task.status !== "Completed",
  ).length;

  const todayProgress =
    todayTasks.length > 0
      ? Math.round(
          todayTasks.reduce((total, task) => total + task.progress, 0) /
            todayTasks.length,
        )
      : 0;

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

      const matchesSearch = searchableText.includes(search.toLowerCase());

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

  // -------------------------------------------------------
  // TIME FORMAT
  // -------------------------------------------------------

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="p-5 md:p-8">
        {/* =================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Today's Work
                </h1>

                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  Production
                </span>
              </div>

              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Your assigned production work for today.
              </p>
            </div>

            {/* DATE */}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                <FiCalendar size={17} />
              </div>

              <div>
                <p className="text-xs text-slate-400">Work Date</p>

                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  18 September 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            TODAY SUMMARY
        ================================================== */}

        <div className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col lg:flex-row">
            {/* LEFT PROGRESS */}

            <div className="border-b border-slate-100 p-6 lg:w-[300px] lg:border-b-0 lg:border-r dark:border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Today's Progress
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {todayProgress}%
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                  <FiCheckCircle size={21} />
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-500"
                  style={{
                    width: `${todayProgress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                {todayCompleted} of {todayTasks.length} tasks completed
              </p>
            </div>

            {/* COUNTS */}

            <div className="grid flex-1 grid-cols-1 sm:grid-cols-3">
              <SummaryItem
                icon={FiClock}
                label="Pending"
                value={todayPending}
                description="Waiting to start"
                iconClass="bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400"
              />

              <SummaryItem
                icon={FiTool}
                label="In Progress"
                value={todayInProgress}
                description="Currently working"
                iconClass="bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
              />

              <SummaryItem
                icon={FiCheckCircle}
                label="Completed"
                value={todayCompleted}
                description="Finished today"
                iconClass="bg-green-50 text-green-500 dark:bg-green-500/10 dark:text-green-400"
              />
            </div>
          </div>
        </div>

        {/* =================================================
            URGENT NOTICE
        ================================================== */}

        {urgentTasks > 0 && (
          <div className="mb-7 flex items-center gap-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 dark:border-red-500/20 dark:bg-red-500/5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm dark:bg-slate-900">
              <FiAlertCircle size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-red-700 dark:text-red-400">
                {urgentTasks} urgent{" "}
                {urgentTasks === 1 ? "task needs" : "tasks need"} attention
              </p>

              <p className="mt-0.5 text-xs text-red-600/70 dark:text-red-400/70">
                Check your urgent production work before starting lower-priority
                tasks.
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            TODAY'S WORK
        ================================================== */}

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your Work
                </h2>

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {todayTasks.length}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Complete each task when the production work is finished.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {todayTasks.map((task) => (
              <TodayTaskCard
                key={task.id}
                task={task}
                onStart={startTask}
                onComplete={completeTask}
                onReopen={reopenTask}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))}
          </div>
        </section>

        {/* =================================================
            ALL MY WORK
        ================================================== */}

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              All My Work
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              View your upcoming and previously assigned tasks.
            </p>
          </div>

          {/* SEARCH + FILTER */}

          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <FiSearch
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search project, customer or task..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800 dark:focus:ring-orange-500/10"
                />
              </div>

              <div className="relative md:w-52">
                <FiFilter
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-600 outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="All">All Work</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                {filteredTasks.length}{" "}
                {filteredTasks.length === 1 ? "task" : "tasks"} found
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left dark:border-slate-800">
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Project
                    </th>

                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Task
                    </th>

                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Due
                    </th>

                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Priority
                    </th>

                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      {/* PROJECT */}

                      <td className="px-6 py-4">
                        <p className="max-w-[190px] truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {task.projectName}
                        </p>

                        <p className="mt-1 text-[11px] font-medium text-orange-500">
                          {task.estimateId}
                        </p>
                      </td>

                      {/* TASK */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                            <FiTool size={16} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              {task.task}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {task.workType}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CUSTOMER */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {task.customer.charAt(0)}
                          </div>

                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {task.customer}
                          </span>
                        </div>
                      </td>

                      {/* DUE */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <FiCalendar size={14} />

                          {formatDate(task.dueDate)}
                        </div>
                      </td>

                      {/* PRIORITY */}

                      <td className="px-6 py-4">
                        <PriorityBadge priority={task.priority} />
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <StatusBadge status={task.status} />
                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-4">
                        {task.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => startTask(task.id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
                          >
                            <FiPlay size={13} />
                            Start
                          </button>
                        )}

                        {task.status === "In Progress" && (
                          <button
                            type="button"
                            onClick={() => completeTask(task.id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
                          >
                            <FiCheck size={13} />
                            Complete
                          </button>
                        )}

                        {task.status === "Completed" && (
                          <span className="text-xs font-medium text-slate-400">
                            Finished
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTasks.length === 0 && (
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

          {/* MOBILE */}

          <div className="space-y-3 md:hidden">
            {filteredTasks.map((task) => (
              <MobileTaskCard
                key={task.id}
                task={task}
                onStart={startTask}
                onComplete={completeTask}
                onReopen={reopenTask}
                formatDate={formatDate}
              />
            ))}

            {filteredTasks.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <EmptyState
                  search={search}
                  filter={filter}
                  clear={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

// =========================================================
// TODAY TASK CARD
// =========================================================

const TodayTaskCard = ({
  task,
  onStart,
  onComplete,
  onReopen,
  formatDate,
  formatTime,
}) => {
  const isCompleted = task.status === "Completed";
  const isProgress = task.status === "In Progress";

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition dark:bg-slate-900 ${
        isCompleted
          ? "border-green-200 dark:border-green-500/20"
          : task.priority === "Urgent"
            ? "border-red-200 dark:border-red-500/20"
            : "border-slate-200 dark:border-slate-800"
      }`}
    >
      {/* TOP */}

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold tracking-wide text-orange-500">
                {task.estimateId}
              </span>

              <PriorityBadge priority={task.priority} />

              <StatusBadge status={task.status} />
            </div>

            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              {task.projectName}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <FiUser size={13} />
                {task.customer}
              </span>

              <span className="flex items-center gap-1.5">
                <FiTool size={13} />
                {task.task}
              </span>

              <span className="flex items-center gap-1.5">
                <FiPackage size={13} />
                {task.quantity} pcs
              </span>

              <span className="flex items-center gap-1.5">
                <FiCalendar size={13} />
                Due {formatDate(task.dueDate)}
              </span>
            </div>
          </div>

          {/* ACTION */}

          <div className="shrink-0">
            {task.status === "Pending" && (
              <button
                type="button"
                onClick={() => onStart(task.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 hover:shadow-md sm:w-auto"
              >
                <FiPlay size={16} />
                Start Work
              </button>
            )}

            {task.status === "In Progress" && (
              <button
                type="button"
                onClick={() => onComplete(task.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-600 hover:shadow-md sm:w-auto"
              >
                <FiCheck size={17} />
                Mark Completed
              </button>
            )}

            {task.status === "Completed" && (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-5 py-3 text-sm font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <FiCheckCircle size={17} />
                Completed
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS */}

        {!isCompleted && (
          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Work Progress
                </p>

                {isProgress && task.startedAt && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Started at {formatTime(task.startedAt)}
                  </p>
                )}
              </div>

              <span className="text-sm font-bold text-orange-500">
                {task.progress}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{
                  width: `${task.progress}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* COMPLETED INFO */}

        {isCompleted && task.completedAt && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-green-100 pt-4 dark:border-green-500/10">
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <FiCheckCircle size={14} />
              Completed at {formatTime(task.completedAt)}
            </div>

            <button
              type="button"
              onClick={() => onReopen(task.id)}
              className="text-xs font-semibold text-slate-400 transition hover:text-orange-500"
            >
              Reopen task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================
// MOBILE TASK CARD
// =========================================================

const MobileTaskCard = ({
  task,
  onStart,
  onComplete,
  onReopen,
  formatDate,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-orange-500">
            {task.estimateId}
          </span>

          <h3 className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-white">
            {task.projectName}
          </h3>
        </div>

        <StatusBadge status={task.status} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {task.customer.charAt(0)}
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {task.customer}
          </p>

          <p className="text-[11px] text-slate-400">
            {task.task} · {task.workType}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <SmallInfo label="Quantity" value={`${task.quantity} pcs`} />

        <SmallInfo label="Due" value={formatDate(task.dueDate)} />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400">
            Progress
          </span>

          <span className="text-xs font-bold text-orange-500">
            {task.progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full ${
              task.status === "Completed" ? "bg-green-500" : "bg-orange-500"
            }`}
            style={{
              width: `${task.progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-4">
        {task.status === "Pending" && (
          <button
            type="button"
            onClick={() => onStart(task.id)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <FiPlay size={15} />
            Start Work
          </button>
        )}

        {task.status === "In Progress" && (
          <button
            type="button"
            onClick={() => onComplete(task.id)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-bold text-white transition hover:bg-green-600"
          >
            <FiCheck size={16} />
            Mark Completed
          </button>
        )}

        {task.status === "Completed" && (
          <button
            type="button"
            onClick={() => onReopen(task.id)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 py-3 text-sm font-semibold text-green-600 dark:bg-green-500/10 dark:text-green-400"
          >
            <FiCheckCircle size={15} />
            Completed · Reopen
          </button>
        )}
      </div>
    </div>
  );
};

// =========================================================
// SUMMARY ITEM
// =========================================================

const SummaryItem = ({ icon: Icon, label, value, description, iconClass }) => {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 dark:border-slate-800">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>

        <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">{description}</p>
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
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[priority] || ""}`}
    >
      {priority}
    </span>
  );
};

// =========================================================
// SMALL INFO
// =========================================================

const SmallInfo = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
};

// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = ({ search, filter, clear }) => {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <FiSearch size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-white">
        No work found
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        Try changing your search or filter.
      </p>

      {(search || filter !== "All") && (
        <button
          type="button"
          onClick={clear}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600"
        >
          <FiX size={13} />
          Clear filters
        </button>
      )}
    </div>
  );
};

export default StaffTasks;
