import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiPackage,
  FiPrinter,
  FiScissors,
  FiTool,
  FiUser,
} from "react-icons/fi";

/* =========================================================
   DEMO ORDER DATA
   Later this data will come from API / Redux
========================================================= */

const orders = [
  {
    id: "PRJ-1001",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    quantity: 500,
    dueDate: "18 Sep 2026",
    amount: "Rs. 12,500",

    tasks: [
      {
        id: "TASK-1001",
        workType: "Design",
        status: "Completed",
        progress: 100,
        assignedTo: "Rahul",
        assignedToId: 3,
      },
      {
        id: "TASK-1002",
        workType: "Pre-Press",
        status: "Completed",
        progress: 100,
        assignedTo: "Amit",
        assignedToId: 4,
      },
      {
        id: "TASK-1003",
        workType: "Printing",
        status: "In Progress",
        progress: 70,
        assignedTo: "You",
        assignedToId: 2,
        isMyTask: true,
      },
      {
        id: "TASK-1004",
        workType: "Cutting",
        status: "Pending",
        progress: 0,
        assignedTo: "Suresh",
        assignedToId: 5,
      },
      {
        id: "TASK-1005",
        workType: "Lamination",
        status: "Pending",
        progress: 0,
        assignedTo: "Suresh",
        assignedToId: 5,
      },
      {
        id: "TASK-1006",
        workType: "Packing",
        status: "Pending",
        progress: 0,
        assignedTo: "You",
        assignedToId: 2,
        isMyTask: true,
      },
    ],
  },
];

/* =========================================================
   WORK ICON
========================================================= */

const getWorkIcon = (workType) => {
  switch (workType) {
    case "Design":
      return FiFileText;

    case "Pre-Press":
      return FiTool;

    case "Printing":
      return FiPrinter;

    case "Cutting":
      return FiScissors;

    case "Lamination":
      return FiFileText;

    case "Packing":
      return FiPackage;

    default:
      return FiFileText;
  }
};

/* =========================================================
   STATUS CONFIG
========================================================= */

const getStatusConfig = (status) => {
  switch (status) {
    case "Completed":
      return {
        icon: FiCheckCircle,
        text: "Completed",
        badge:
          "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
        iconBg:
          "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400",
      };

    case "In Progress":
      return {
        icon: FiClock,
        text: "In Progress",
        badge:
          "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
        iconBg:
          "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
      };

    default:
      return {
        icon: FiClock,
        text: "Pending",
        badge:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        iconBg:
          "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      };
  }
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const StaffOrderDetails = () => {
  const { orderId } = useParams();

  const order = useMemo(() => {
    return orders.find((item) => item.id === orderId);
  }, [orderId]);

  const [tasks, setTasks] = useState(order?.tasks || []);

  /* =======================================================
     UPDATE MY TASK
  ======================================================= */

  const updateMyTask = (taskId, field, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        if (!task.isMyTask) {
          return task;
        }

        return {
          ...task,
          [field]: value,
        };
      })
    );
  };

  /* =======================================================
     STATUS CHANGE
  ======================================================= */

  const handleStatusChange = (taskId, status) => {
    let progress = 0;

    if (status === "In Progress") {
      progress = 20;
    }

    if (status === "Completed") {
      progress = 100;
    }

    updateMyTask(taskId, "status", status);
    updateMyTask(taskId, "progress", progress);
  };

  /* =======================================================
     PROGRESS CHANGE
  ======================================================= */

  const handleProgressChange = (taskId, value) => {
    const progress = Number(value);

    let status = "Pending";

    if (progress > 0 && progress < 100) {
      status = "In Progress";
    }

    if (progress === 100) {
      status = "Completed";
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId || !task.isMyTask) {
          return task;
        }

        return {
          ...task,
          progress,
          status,
        };
      })
    );
  };

  /* =======================================================
     OVERALL PROGRESS
  ======================================================= */

  const overallProgress = useMemo(() => {
    if (!tasks.length) return 0;

    const total = tasks.reduce(
      (sum, task) => sum + task.progress,
      0
    );

    return Math.round(total / tasks.length);
  }, [tasks]);

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <FiPackage size={25} />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Order Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The requested project could not be found.
          </p>

          <Link
            to="/staff/orders"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <FiArrowLeft size={16} />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===================================================
          TOP HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Link
            to="/staff/orders"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <FiArrowLeft size={18} />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                {order.id}
              </span>

              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                Production Order
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {order.projectName}
            </h1>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <FiUser size={15} />
              {order.customer}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/staff/orders"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Back to Orders
          </Link>
        </div>
      </div>

      {/* ===================================================
          ORDER SUMMARY
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          label="Project ID"
          value={order.id}
          icon={FiFileText}
        />

        <InfoCard
          label="Quantity"
          value={`${order.quantity} Units`}
          icon={FiPackage}
        />

        <InfoCard
          label="Due Date"
          value={order.dueDate}
          icon={FiClock}
        />

        <InfoCard
          label="Project Amount"
          value={order.amount}
          icon={FiCheckCircle}
        />
      </div>

      {/* ===================================================
          OVERALL PROGRESS
      =================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Production Progress
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {overallProgress}% Complete
            </h2>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-lg font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            {overallProgress}%
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>Production Started</span>
          <span>{tasks.length} Tasks</span>
        </div>
      </div>

      {/* ===================================================
          PRODUCTION WORKFLOW
      =================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}

        <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                Production Workflow
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                Work Breakdown
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track every production stage of this order.
              </p>
            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 sm:flex dark:bg-orange-500/10">
              <FiTool size={19} />
            </div>
          </div>
        </div>

        {/* Workflow */}

        <div className="p-5">
          <div className="space-y-4">
            {tasks.map((task, index) => {
              const Icon = getWorkIcon(task.workType);
              const statusConfig = getStatusConfig(task.status);
              const StatusIcon = statusConfig.icon;

              const isLast = index === tasks.length - 1;

              return (
                <div key={task.id} className="relative">
                  {/* Vertical Line */}

                  {!isLast && (
                    <div className="absolute left-[23px] top-14 h-[calc(100%-14px)] w-px bg-slate-200 dark:bg-slate-700" />
                  )}

                  <div
                    className={`relative rounded-2xl border p-4 transition ${
                      task.isMyTask
                        ? "border-orange-200 bg-orange-50/40 dark:border-orange-500/20 dark:bg-orange-500/5"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Left */}

                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${statusConfig.iconBg}`}
                        >
                          {task.status === "Completed" ? (
                            <StatusIcon size={20} />
                          ) : (
                            <Icon size={20} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900 dark:text-white">
                              {task.workType}
                            </h3>

                            {task.isMyTask && (
                              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                YOU
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-slate-400">
                            {task.id}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusConfig.badge}`}
                            >
                              <StatusIcon size={12} />
                              {task.status}
                            </span>

                            <span className="text-xs text-slate-400">
                              Assigned to:
                            </span>

                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                              {task.assignedTo}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right */}

                      <div className="w-full lg:max-w-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500">
                            Progress
                          </span>

                          <span className="text-sm font-bold text-slate-800 dark:text-white">
                            {task.progress}%
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
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
                    </div>

                    {/* =================================================
                        MY TASK CONTROLS
                    ================================================= */}

                    {task.isMyTask && (
                      <div className="mt-4 border-t border-orange-100 pt-4 dark:border-orange-500/10">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {/* Status */}

                          <div>
                            <label className="mb-2 block text-xs font-bold text-slate-500">
                              Update Status
                            </label>

                            <select
                              value={task.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  task.id,
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-orange-500/10"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">
                                In Progress
                              </option>
                              <option value="Completed">
                                Completed
                              </option>
                            </select>
                          </div>

                          {/* Progress */}

                          <div>
                            <label className="mb-2 block text-xs font-bold text-slate-500">
                              Update Progress
                            </label>

                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={task.progress}
                                onChange={(e) =>
                                  handleProgressChange(
                                    task.id,
                                    e.target.value
                                  )
                                }
                                className="w-full accent-orange-500"
                              />

                              <span className="w-12 rounded-lg bg-orange-100 px-2 py-1.5 text-center text-xs font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                {task.progress}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-xs text-orange-700 dark:border-orange-500/10 dark:bg-slate-900 dark:text-orange-300">
                          <FiUser size={14} />
                          You are responsible for this task.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================================================
          STAFF NOTE
      =================================================== */}

      <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 dark:border-orange-500/10 dark:bg-orange-500/5">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
            <FiCheck size={18} />
          </div>

          <div>
            <h3 className="font-bold text-orange-800 dark:text-orange-300">
              Staff Workflow
            </h3>

            <p className="mt-1 text-sm leading-6 text-orange-700/80 dark:text-orange-300/70">
              You can update only the tasks assigned to you. Other
              production stages are visible for tracking but cannot be
              edited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INFO CARD
========================================================= */

const InfoCard = ({ label, value, icon: Icon }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

export default StaffOrderDetails;