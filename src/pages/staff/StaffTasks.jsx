import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiPrinter,
  FiSearch,
  FiSliders,
  FiTool,
  FiUser,
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiPackage,
} from "react-icons/fi";

const initialTasks = [
  {
    id: "TASK-1001",
    projectId: "PRJ-1001",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    task: "Design",
    workType: "Design",
    assignedTo: "PrintTech Staff",
    dueDate: "2026-09-17",
    priority: "High",
    status: "Completed",
    progress: 100,
    quantity: 500,
  },
  {
    id: "TASK-1002",
    projectId: "PRJ-1001",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    task: "Printing",
    workType: "Offset Printing",
    assignedTo: "PrintTech Staff",
    dueDate: "2026-09-17",
    priority: "High",
    status: "In Progress",
    progress: 70,
    quantity: 500,
  },
  {
    id: "TASK-1003",
    projectId: "PRJ-1001",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    task: "Cutting",
    workType: "Finishing",
    assignedTo: "PrintTech Staff",
    dueDate: "2026-09-18",
    priority: "Medium",
    status: "Pending",
    progress: 0,
    quantity: 500,
  },
  {
    id: "TASK-1004",
    projectId: "PRJ-1002",
    projectName: "Wedding Invitation Cards",
    customer: "Sita Karki",
    task: "Printing",
    workType: "Digital Printing",
    assignedTo: "PrintTech Staff",
    dueDate: "2026-09-18",
    priority: "Medium",
    status: "Pending",
    progress: 0,
    quantity: 300,
  },
  {
    id: "TASK-1005",
    projectId: "PRJ-1002",
    projectName: "Wedding Invitation Cards",
    customer: "Sita Karki",
    task: "Lamination",
    workType: "Lamination",
    assignedTo: "PrintTech Staff",
    dueDate: "2026-09-19",
    priority: "Low",
    status: "Pending",
    progress: 0,
    quantity: 300,
  },
  {
    id: "TASK-1006",
    projectId: "PRJ-1003",
    projectName: "Restaurant Menu Printing",
    customer: "Hari Thapa",
    task: "Printing",
    workType: "Offset Printing",
    assignedTo: "PrintTech Staff",
    dueDate: "2026-09-17",
    priority: "Urgent",
    status: "In Progress",
    progress: 45,
    quantity: 1000,
  },
  {
    id: "TASK-1007",
    projectId: "PRJ-1003",
    projectName: "Restaurant Menu Printing",
    customer: "Hari Thapa",
    task: "Binding",
    workType: "Finishing",
    assignedTo: "PrintTech Staff",
    dueDate: "2026-09-18",
    priority: "High",
    status: "Pending",
    progress: 0,
    quantity: 1000,
  },
  {
    id: "TASK-1008",
    projectId: "PRJ-1004",
    projectName: "Flex Banner Design",
    customer: "Aashish Gurung",
    task: "Printing",
    workType: "Flex Printing",
    assignedTo: "PrintTech Staff",
    dueDate: "2026-09-17",
    priority: "Urgent",
    status: "Completed",
    progress: 100,
    quantity: 20,
  },
];

const StaffTasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* =====================================================
     UPDATE STATUS
  ====================================================== */

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        let progress = task.progress;

        if (newStatus === "Pending") {
          progress = 0;
        }

        if (newStatus === "In Progress") {
          progress = task.progress === 0 ? 10 : task.progress;
        }

        if (newStatus === "Completed") {
          progress = 100;
        }

        return {
          ...task,
          status: newStatus,
          progress,
        };
      }),
    );
  };

  /* =====================================================
     UPDATE PROGRESS
  ====================================================== */

  const updateProgress = (taskId, newProgress) => {
    const progress = Number(newProgress);

    setTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        let status = task.status;

        if (progress === 0) {
          status = "Pending";
        } else if (progress === 100) {
          status = "Completed";
        } else {
          status = "In Progress";
        }

        return {
          ...task,
          progress,
          status,
        };
      }),
    );
  };

  /* =====================================================
     FILTER
  ====================================================== */

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchText = `
        ${task.id}
        ${task.projectId}
        ${task.projectName}
        ${task.customer}
        ${task.task}
        ${task.workType}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase(),
      );

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  /* =====================================================
     COUNTS
  ====================================================== */

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const urgentTasks = tasks.filter(
    (task) => task.priority === "Urgent" && task.status !== "Completed",
  ).length;

  /* =====================================================
     OVERALL PROGRESS
  ====================================================== */

  const overallProgress =
    totalTasks > 0
      ? Math.round(
          tasks.reduce(
            (total, task) => total + task.progress,
            0,
          ) / totalTasks,
        )
      : 0;

  /* =====================================================
     STYLES
  ====================================================== */

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400";

      case "In Progress":
        return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400";

      case "Pending":
        return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";

      default:
        return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";

      case "High":
        return "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20";

      case "Medium":
        return "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";

      case "Low":
        return "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";

      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

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

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="p-5 md:p-8">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-7">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  My Tasks
                </h1>

                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  Production
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Track completed, active and pending production work.
              </p>
            </div>

            {/* OVERALL PROGRESS */}
            <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:w-72 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Overall Progress
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    {overallProgress}%
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                  <FiActivityIcon />
                </div>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-500"
                  style={{
                    width: `${overallProgress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            STATUS OVERVIEW
        ================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {/* ALL */}
          <StatusCard
            title="All Tasks"
            count={totalTasks}
            subtitle="Assigned to you"
            icon={FiFileText}
            active={statusFilter === "All"}
            onClick={() => setStatusFilter("All")}
            iconClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          />

          {/* PENDING */}
          <StatusCard
            title="Pending"
            count={pendingTasks}
            subtitle="Waiting to start"
            icon={FiClock}
            active={statusFilter === "Pending"}
            onClick={() => setStatusFilter("Pending")}
            iconClass="bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400"
          />

          {/* IN PROGRESS */}
          <StatusCard
            title="In Progress"
            count={inProgressTasks}
            subtitle="Currently working"
            icon={FiPrinter}
            active={statusFilter === "In Progress"}
            onClick={() => setStatusFilter("In Progress")}
            iconClass="bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
          />

          {/* COMPLETED */}
          <StatusCard
            title="Completed"
            count={completedTasks}
            subtitle="Finished work"
            icon={FiCheckCircle}
            active={statusFilter === "Completed"}
            onClick={() => setStatusFilter("Completed")}
            iconClass="bg-green-50 text-green-500 dark:bg-green-500/10 dark:text-green-400"
          />

          {/* URGENT */}
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm dark:border-red-500/20 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Urgent
                </p>

                <h2 className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                  {urgentTasks}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                <FiAlertCircle size={21} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Need attention
            </p>
          </div>
        </div>

        {/* =================================================
            QUICK STATUS BAR
        ================================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Work Summary
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Your current production workload
            </p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-slate-800">

            {/* PENDING */}
            <button
              type="button"
              onClick={() => setStatusFilter("Pending")}
              className="group flex items-center gap-4 p-5 text-left transition hover:bg-amber-50/50 dark:hover:bg-amber-500/5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400">
                <FiClock size={20} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Pending Work
                  </p>

                  <FiArrowRight
                    size={15}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-amber-500"
                  />
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {pendingTasks} tasks are waiting to start
                </p>
              </div>
            </button>

            {/* PROGRESS */}
            <button
              type="button"
              onClick={() => setStatusFilter("In Progress")}
              className="group flex items-center gap-4 p-5 text-left transition hover:bg-orange-50/50 dark:hover:bg-orange-500/5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                <FiPrinter size={20} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Active Work
                  </p>

                  <FiArrowRight
                    size={15}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500"
                  />
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {inProgressTasks} tasks currently in progress
                </p>
              </div>
            </button>

            {/* COMPLETED */}
            <button
              type="button"
              onClick={() => setStatusFilter("Completed")}
              className="group flex items-center gap-4 p-5 text-left transition hover:bg-green-50/50 dark:hover:bg-green-500/5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-500 dark:bg-green-500/10 dark:text-green-400">
                <FiCheckCircle size={20} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Finished Work
                  </p>

                  <FiArrowRight
                    size={15}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-green-500"
                  />
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {completedTasks} tasks completed
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* =================================================
            SEARCH + FILTER
        ================================================== */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row">

            {/* SEARCH */}
            <div className="relative flex-1">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search project, customer, task or work type..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800 dark:focus:ring-orange-500/10"
              />
            </div>

            {/* FILTER */}
            <div className="relative lg:w-52">
              <FiSliders
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* =================================================
            TASK TABLE
        ================================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

          {/* TABLE HEADER */}
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                {statusFilter === "All"
                  ? "All Production Tasks"
                  : `${statusFilter} Tasks`}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {filteredTasks.length}{" "}
                {filteredTasks.length === 1
                  ? "task"
                  : "tasks"}{" "}
                found
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {completedTasks} Done
              </span>

              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                {inProgressTasks} Active
              </span>

              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {pendingTasks} Pending
              </span>
            </div>
          </div>

          {/* =================================================
              DESKTOP
          ================================================== */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1150px]">
              <thead>
                <tr className="border-b border-slate-100 text-left dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Project
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Task
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Due
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Progress
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
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
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {task.projectName}
                      </p>

                      <p className="mt-1 text-xs font-medium text-orange-500">
                        {task.projectId}
                      </p>
                    </td>

                    {/* TASK */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                          <FiTool size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {task.task}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {task.workType}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CUSTOMER */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {task.customer.charAt(0)}
                        </div>

                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          {task.customer}
                        </span>
                      </div>
                    </td>

                    {/* DUE */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <FiCalendar size={14} />

                        {formatDate(task.dueDate)}
                      </div>
                    </td>

                    {/* PRIORITY */}
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getPriorityStyle(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* PROGRESS */}
                    <td className="px-6 py-5">
                      <div className="w-32">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            Progress
                          </span>

                          <span className="text-[11px] font-bold text-orange-500">
                            {task.progress}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all ${
                              task.status === "Completed"
                                ? "bg-green-500"
                                : "bg-orange-500"
                            }`}
                            style={{
                              width: `${task.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <select
                        value={task.status}
                        onChange={(event) =>
                          updateTaskStatus(
                            task.id,
                            event.target.value,
                          )
                        }
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold outline-none transition focus:ring-4 focus:ring-orange-100 ${getStatusStyle(
                          task.status,
                        )}`}
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Completed">
                          Completed
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE
          ================================================== */}

          <div className="space-y-3 p-4 md:hidden">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                      {task.task}
                    </p>

                    <p className="mt-1 text-xs font-medium text-orange-500">
                      {task.projectId}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                      task.status,
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* PROJECT */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Project
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {task.projectName}
                  </p>
                </div>

                {/* CUSTOMER */}
                <div className="mt-4 flex items-center gap-2">
                  <FiUser
                    className="text-slate-400"
                    size={15}
                  />

                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {task.customer}
                  </span>
                </div>

                {/* INFO GRID */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoBox
                    label="Work Type"
                    value={task.workType}
                  />

                  <InfoBox
                    label="Due Date"
                    value={formatDate(task.dueDate)}
                  />

                  <InfoBox
                    label="Quantity"
                    value={`${task.quantity} pcs`}
                  />

                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                      Priority
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full border px-2 py-1 text-[10px] font-semibold ${getPriorityStyle(
                        task.priority,
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Work Progress
                    </span>

                    <span className="text-sm font-bold text-orange-500">
                      {task.progress}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={task.progress}
                    onChange={(event) =>
                      updateProgress(
                        task.id,
                        event.target.value,
                      )
                    }
                    className="w-full accent-orange-500"
                  />

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all ${
                        task.status === "Completed"
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                      style={{
                        width: `${task.progress}%`,
                      }}
                    />
                  </div>
                </div>

                {/* STATUS */}
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    Update Status
                  </label>

                  <select
                    value={task.status}
                    onChange={(event) =>
                      updateTaskStatus(
                        task.id,
                        event.target.value,
                      )
                    }
                    className={`w-full rounded-xl border px-3 py-2.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-orange-100 ${getStatusStyle(
                      task.status,
                    )}`}
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {filteredTasks.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <FiSearch size={23} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-white">
                No tasks found
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or status filter.
              </p>

              {(search || statusFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-4 text-sm font-semibold text-orange-500 hover:text-orange-600"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STATUS CARD
========================================================= */

const StatusCard = ({
  title,
  count,
  subtitle,
  icon: Icon,
  active,
  onClick,
  iconClass,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${
        active
          ? "border-orange-300 ring-2 ring-orange-100 dark:border-orange-500/50 dark:ring-orange-500/10"
          : "border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {count}
          </h2>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {subtitle}
        </p>

        <FiArrowRight
          size={14}
          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500"
        />
      </div>
    </button>
  );
};

/* =========================================================
   INFO BOX
========================================================= */

const InfoBox = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   PROGRESS ICON
========================================================= */

const FiActivityIcon = () => {
  return (
    <div className="flex items-end gap-0.5">
      <span className="h-3 w-1 rounded-full bg-orange-400" />
      <span className="h-5 w-1 rounded-full bg-orange-500" />
      <span className="h-4 w-1 rounded-full bg-orange-400" />
      <span className="h-6 w-1 rounded-full bg-orange-500" />
    </div>
  );
};

export default StaffTasks;