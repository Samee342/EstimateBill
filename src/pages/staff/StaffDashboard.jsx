import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiMoreHorizontal,
  FiPrinter,
  FiScissors,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const StaffDashboard = () => {
  // =====================================================
  // TASK DATA
  // =====================================================
  // Future me ye data backend/API se aayega.
  // Abhi demo ke liye yaha rakha gaya hai.

  const tasks = [
    {
      id: "TASK-1001",
      projectId: "PRJ-1001",
      projectName: "Business Card Printing",
      customer: "Ram Sharma",
      workType: "Design",
      dueDate: "Today",
      status: "Completed",
      progress: 100,
      priority: "High",
    },
    {
      id: "TASK-1002",
      projectId: "PRJ-1001",
      projectName: "Business Card Printing",
      customer: "Ram Sharma",
      workType: "Printing",
      dueDate: "Today",
      status: "In Progress",
      progress: 65,
      priority: "High",
    },
    {
      id: "TASK-1003",
      projectId: "PRJ-1001",
      projectName: "Business Card Printing",
      customer: "Ram Sharma",
      workType: "Cutting",
      dueDate: "Today",
      status: "Pending",
      progress: 0,
      priority: "Normal",
    },
    {
      id: "TASK-1004",
      projectId: "PRJ-1002",
      projectName: "Restaurant Menu Printing",
      customer: "ABC Restaurant",
      workType: "Lamination",
      dueDate: "Tomorrow",
      status: "In Progress",
      progress: 40,
      priority: "Normal",
    },
    {
      id: "TASK-1005",
      projectId: "PRJ-1003",
      projectName: "Wedding Invitation Cards",
      customer: "Sita Karki",
      workType: "Binding",
      dueDate: "18 Sep",
      status: "Pending",
      progress: 0,
      priority: "High",
    },
    {
      id: "TASK-1006",
      projectId: "PRJ-1004",
      projectName: "Company Brochure",
      customer: "Everest Traders",
      workType: "Printing",
      dueDate: "19 Sep",
      status: "Completed",
      progress: 100,
      priority: "Normal",
    },
    {
      id: "TASK-1007",
      projectId: "PRJ-1005",
      projectName: "Product Label Printing",
      customer: "New Star Hotel",
      workType: "Finishing",
      dueDate: "20 Sep",
      status: "Pending",
      progress: 0,
      priority: "Normal",
    },
  ];

  // =====================================================
  // TASK COUNTS
  // =====================================================

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  // =====================================================
  // OVERALL PROGRESS
  // =====================================================

  const overallProgress = Math.round(
    tasks.reduce((total, task) => total + task.progress, 0) / totalTasks,
  );

  // =====================================================
  // TODAY TASKS
  // =====================================================

  const todayTasks = tasks.filter((task) => task.dueDate === "Today");

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      case "In Progress":
        return "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

      case "Pending":
        return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

      default:
        return "bg-slate-50 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  // =====================================================
  // PRIORITY STYLE
  // =====================================================

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500";

      case "Normal":
        return "text-slate-400";

      default:
        return "text-slate-400";
    }
  };

  // =====================================================
  // WORK TYPE ICON
  // =====================================================

  const getWorkIcon = (workType) => {
    switch (workType) {
      case "Printing":
        return FiPrinter;

      case "Cutting":
        return FiScissors;

      case "Design":
        return FiFileText;

      default:
        return FiFileText;
    }
  };

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const quickActions = [
    {
      title: "My Tasks",
      description: "View and update all your assigned tasks",
      icon: FiCheckCircle,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      link: "/staff/tasks",
    },
    {
      title: "My Orders",
      description: "View projects connected to your work",
      icon: FiFileText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      link: "/staff/orders",
    },
    {
      title: "My Profile",
      description: "View your staff account information",
      icon: FiUser,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      link: "/staff/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="p-5">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Staff Dashboard
              </h1>

              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                Staff
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track your assigned printing work and task progress.
            </p>
          </div>

          <Link
            to="/staff/tasks"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 hover:shadow-md"
          >
            <FiCheckCircle size={16} />
            View My Tasks
            <FiArrowRight size={15} />
          </Link>
        </div>

        {/* =====================================================
            TASK STATS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  My Tasks
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {String(totalTasks).padStart(2, "0")}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400">
                <FiFileText size={21} />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-400">
                Total assigned tasks
              </span>
            </div>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Pending
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {String(pendingTasks).padStart(2, "0")}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400">
                <FiClock size={21} />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-amber-500">
                Waiting to be started
              </span>
            </div>
          </div>

          {/* IN PROGRESS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  In Progress
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {String(inProgressTasks).padStart(2, "0")}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                <FiPrinter size={21} />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-orange-500">
                Currently being worked on
              </span>
            </div>
          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Completed
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {String(completedTasks).padStart(2, "0")}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-500 dark:bg-green-500/10 dark:text-green-400">
                <FiCheckCircle size={21} />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-green-500">Tasks completed</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <div className="mt-6">
          <div className="mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Frequently used staff actions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.iconBg} ${action.iconColor}`}
                    >
                      <Icon size={19} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        {action.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <FiArrowRight
                    className="text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-orange-500"
                    size={18}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            MIDDLE SECTION
        ====================================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* ===================================================
              OVERALL PROGRESS
          ==================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  My Work Overview
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Overall progress of your assigned tasks
                </p>
              </div>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <FiMoreHorizontal />
              </button>
            </div>

            {/* Progress */}

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                    <FiTrendingUp size={15} />
                  </div>

                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Overall Task Progress
                  </span>
                </div>

                <span className="text-sm font-bold text-orange-500">
                  {overallProgress}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-500"
                  style={{
                    width: `${overallProgress}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-400">
                <span>{completedTasks} completed</span>

                <span>{totalTasks} total tasks</span>
              </div>
            </div>

            {/* Task Breakdown */}

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-green-50 p-4 dark:bg-green-500/10">
                <p className="text-xs text-green-600 dark:text-green-400">
                  Completed
                </p>

                <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-400">
                  {completedTasks}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-4 dark:bg-orange-500/10">
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  In Progress
                </p>

                <p className="mt-1 text-xl font-bold text-orange-600 dark:text-orange-400">
                  {inProgressTasks}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-500/10">
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Pending
                </p>

                <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">
                  {pendingTasks}
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              TODAY'S WORK
          ==================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Today's Work
              </h2>

              <p className="mt-1 text-xs text-slate-400">Tasks due today</p>
            </div>

            <div className="mt-6 space-y-3">
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => {
                  const WorkIcon = getWorkIcon(task.workType);

                  return (
                    <div
                      key={task.id}
                      className="rounded-xl border border-slate-100 p-3 dark:border-slate-800"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                          <WorkIcon size={16} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {task.workType}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-400">
                                {task.projectName}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${getStatusStyle(
                                task.status,
                              )}`}
                            >
                              {task.status}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className="h-full rounded-full bg-orange-500"
                                style={{
                                  width: `${task.progress}%`,
                                }}
                              />
                            </div>

                            <span className="text-[10px] font-medium text-slate-400">
                              {task.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl bg-slate-50 p-5 text-center dark:bg-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No tasks due today.
                  </p>
                </div>
              )}
            </div>

            <Link
              to="/staff/tasks"
              className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-orange-500 transition hover:text-orange-600"
            >
              View All Tasks
              <FiArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* =====================================================
            RECENT ASSIGNED TASKS
        ====================================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}

          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-6 dark:border-slate-800 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Recent Assigned Tasks
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Latest work assigned to you
              </p>
            </div>

            <Link
              to="/staff/tasks"
              className="text-sm font-semibold text-orange-500 transition hover:text-orange-600"
            >
              View All
            </Link>
          </div>

          {/* ===================================================
              DESKTOP TABLE
          ==================================================== */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Task
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Project
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Work
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Due
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
                {tasks.slice(0, 6).map((task) => {
                  return (
                    <tr
                      key={task.id}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                    >
                      {/* TASK */}

                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                            {task.id}
                          </p>

                          <p
                            className={`mt-1 text-[10px] font-semibold ${getPriorityStyle(
                              task.priority,
                            )}`}
                          >
                            {task.priority} Priority
                          </p>
                        </div>
                      </td>

                      {/* PROJECT */}

                      <td className="px-6 py-4">
                        <div>
                          <p className="max-w-[180px] truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {task.projectName}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {task.projectId}
                          </p>
                        </div>
                      </td>

                      {/* CUSTOMER */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {task.customer.charAt(0)}
                          </div>

                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {task.customer}
                          </span>
                        </div>
                      </td>

                      {/* WORK TYPE */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                            {React.createElement(getWorkIcon(task.workType), {
                              size: 14,
                            })}
                          </div>

                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {task.workType}
                          </span>
                        </div>
                      </td>

                      {/* DUE */}

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            task.dueDate === "Today"
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {task.dueDate}
                        </span>
                      </td>

                      {/* PROGRESS */}

                      <td className="px-6 py-4">
                        <div className="w-28">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className="h-full rounded-full bg-orange-500"
                                style={{
                                  width: `${task.progress}%`,
                                }}
                              />
                            </div>

                            <span className="text-[10px] text-slate-400">
                              {task.progress}%
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            task.status,
                          )}`}
                        >
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ===================================================
              MOBILE TASK CARDS
          ==================================================== */}

          <div className="space-y-3 p-4 md:hidden">
            {tasks.slice(0, 6).map((task) => {
              const WorkIcon = getWorkIcon(task.workType);

              return (
                <div
                  key={task.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {task.id}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                        task.status,
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {task.projectName}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {task.projectId}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                        <WorkIcon size={14} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {task.workType}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          {task.customer}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-medium ${
                        task.dueDate === "Today"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-slate-400"
                      }`}
                    >
                      Due {task.dueDate}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex justify-between">
                      <span className="text-[10px] text-slate-400">
                        Progress
                      </span>

                      <span className="text-[10px] font-semibold text-orange-500">
                        {task.progress}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{
                          width: `${task.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =============WhatsApp Button=========== */}

          <button
            type="button"
            title="WhatsApp"
            aria-label="Open WhatsApp"
            onClick={() => window.open("https://wa.me/9779742992187", "_blank")}
            className="
                    fixed
                    bottom-4
                    right-4
                    z-50
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-green-500
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:scale-110
                    hover:bg-green-600
                    hover:shadow-xl
                    sm:bottom-6
                    sm:right-6
                    sm:h-14
                    sm:w-14
                    dark:bg-green-600
                    dark:hover:bg-green-500
                  "
          >
            <FaWhatsapp size={26} className="sm:h-[30px] sm:w-[30px]" />

            {/* ORANGE NOTIFICATION DOT */}

            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
              <span
                className="
                        absolute
                        inline-flex
                        h-full
                        w-full
                        animate-ping
                        rounded-full
                        bg-orange-400
                        opacity-75
                      "
              />

              <span
                className="
                        relative
                        inline-flex
                        h-4
                        w-4
                        rounded-full
                        border-2
                        border-white
                        bg-orange-500
                        dark:border-slate-950
                      "
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
