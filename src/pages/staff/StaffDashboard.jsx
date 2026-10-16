import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  FiUsers,
  FiRefreshCw,
  FiAlertCircle,
  FiCalendar,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { assignedWork } from "../../api/staffWork";
import { getProjects } from "../../api/project";

// =====================================================
// RESPONSE NORMALIZER
// =====================================================

const getArray = (response) => {
  if (Array.isArray(response)) return response;

  const candidates = [
    response?.data,
    response?.data?.data,
    response?.data?.results,
    response?.data?.orders,
    response?.data?.projects,
    response?.results,
    response?.orders,
    response?.projects,
  ];

  return candidates.find(Array.isArray) || [];
};

// =====================================================
// LOGGED-IN USER
// =====================================================

const getLoggedInUser = () => {
  const keys = ["user", "currentUser", "authUser", "userData", "staff"];

  for (const key of keys) {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) continue;

      const user = JSON.parse(stored);

      if (user && typeof user === "object") {
        return {
          id: user.id ?? user.user_id ?? user.pk ?? null,
          username: String(
            user.username ?? user.name ?? user.email ?? "",
          ).toLowerCase(),
        };
      }
    } catch {
      // Continue checking other storage keys.
    }
  }

  return { id: null, username: "" };
};

// =====================================================
// STATUS HELPERS
// =====================================================

const normalizeStatus = (value) => {
  const status = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (["completed", "complete", "done", "finished"].includes(status)) {
    return "Completed";
  }

  if (["in_progress", "inprogress", "processing", "started"].includes(status)) {
    return "In Progress";
  }

  return "Pending";
};

const getStatusProgress = (status) => {
  if (status === "Completed") return 100;
  if (status === "In Progress") return 50;
  return 0;
};

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

const getPriority = (priority) => {
  const value = String(priority ?? "")
    .trim()
    .toLowerCase();

  if (value === "urgent") return "Urgent";
  if (value === "high") return "High";
  if (value === "low") return "Low";

  return "Normal";
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "Urgent":
      return "text-red-600 dark:text-red-400";

    case "High":
      return "text-orange-600 dark:text-orange-400";

    case "Low":
      return "text-slate-400";

    default:
      return "text-slate-500 dark:text-slate-400";
  }
};

// =====================================================
// DATE HELPERS
// =====================================================

const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date;
};

const formatDueDate = (value) => {
  const date = parseDate(value);

  if (!date) return "Not set";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const difference = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (difference === 0) return "Today";
  if (difference === 1) return "Tomorrow";
  if (difference === -1) return "Yesterday";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isDueToday = (value) => formatDueDate(value) === "Today";

// =====================================================
// SAFE DISPLAY HELPERS
// =====================================================

const getDisplayName = (value, fallback = "Not available") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "object") {
    return (
      value.name ??
      value.username ??
      value.full_name ??
      value.customer_name ??
      fallback
    );
  }

  return String(value);
};

const getWorkIcon = (workType) => {
  const type = String(workType ?? "").toLowerCase();

  if (type.includes("print")) return FiPrinter;
  if (type.includes("cut")) return FiScissors;
  if (type.includes("design")) return FiFileText;
  if (type.includes("bind")) return FiFileText;

  return FiFileText;
};

// =====================================================
// STAFF ASSIGNMENT CHECK
// =====================================================

const isAssignedToCurrentUser = (assignment, user) => {
  const assignedId =
    assignment?.id ?? assignment?.user_id ?? assignment?.pk ?? null;

  const assignedUsername = String(
    assignment?.username ?? assignment?.name ?? "",
  ).toLowerCase();

  // If the logged-in user ID is available, compare IDs first.
  if (user.id !== null && user.id !== undefined) {
    return String(assignedId) === String(user.id);
  }

  // Username comparison is a fallback when the user ID is unavailable.
  if (user.username && assignedUsername) {
    return assignedUsername === user.username;
  }

  // The authenticated API may already return only the current user's work.
  return true;
};

// =====================================================
// MAP API RECORDS TO DASHBOARD TASKS
// =====================================================

const mapAssignedWork = (item, currentUser, projectMap) => {
  const orderId = item?.order ?? item?.order_details?.id;

  const project = item?.order_details ?? projectMap.get(String(orderId)) ?? {};

  const customer = project?.customer_details ?? project?.customer ?? {};

  const customerName =
    getDisplayName(customer, "") ||
    project?.customer_name ||
    "Unknown customer";

  const projectName =
    project?.project_name ||
    project?.projectName ||
    item?.item_description ||
    "Untitled project";

  const stages = [
    {
      key: "designing",
      label: "Designing",
      personField: "Designing_person",
      detailsField: "designing_person_details",
      statusField: "designing_status",
    },
    {
      key: "printing",
      label: "Printing",
      personField: "printing_person",
      detailsField: "printing_person_details",
      statusField: "printing_status",
    },
    {
      key: "binding",
      label: "Binding",
      personField: "binding_person",
      detailsField: "binding_person_details",
      statusField: "binding_status",
    },
  ];

  const assignedStages = stages.filter((stage) => {
    const assignedPerson =
      item?.[stage.detailsField] ?? item?.[stage.personField];

    if (
      assignedPerson === null ||
      assignedPerson === undefined ||
      assignedPerson === ""
    ) {
      return false;
    }

    return isAssignedToCurrentUser(
      typeof assignedPerson === "object"
        ? assignedPerson
        : { id: assignedPerson },
      currentUser,
    );
  });

  return assignedStages.map((stage) => {
    const status = normalizeStatus(item?.[stage.statusField]);
    const dueDate = project?.delivery_date ?? null;

    return {
      // Use real database IDs rather than demo task IDs.
      id: `${item?.id ?? "item"}-${stage.key}`,
      rawId: item?.id,
      orderId,
      stageKey: stage.key,
      stageStatusField: stage.statusField,

      projectId:
        project?.slip_no !== null && project?.slip_no !== undefined
          ? `SLIP-${project.slip_no}`
          : orderId
            ? `ORDER-${orderId}`
            : "—",

      estimateId:
        project?.slip_no !== null && project?.slip_no !== undefined
          ? `EST-${project.slip_no}`
          : "—",

      projectName,
      customer: customerName,
      workType: stage.label,
      itemDescription:
        item?.item_description ||
        item?.description ||
        project?.description ||
        "No item description",

      dueDate: formatDueDate(dueDate),
      rawDueDate: dueDate,

      status,
      progress: getStatusProgress(status),
      priority: getPriority(project?.priority),

      quantity: item?.quantity ?? null,
      raw: item,
      order: project,
    };
  });
};

// =====================================================
// DASHBOARD COMPONENT
// =====================================================

const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = useMemo(() => getLoggedInUser(), []);

  // ---------------------------------------------------
  // LOAD REAL API DATA
  // ---------------------------------------------------

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([assignedWork(), getProjects()]);

      const workResult = results[0];
      const projectsResult = results[1];

      if (workResult.status === "rejected") {
        throw workResult.reason;
      }

      const workItems = getArray(workResult.value);

      const projects =
        projectsResult.status === "fulfilled"
          ? getArray(projectsResult.value)
          : [];

      // Build a lookup so project information can be used when
      // the assigned-work response does not include order_details.
      const projectMap = new Map();

      projects.forEach((project) => {
        if (project?.id !== undefined && project?.id !== null) {
          projectMap.set(String(project.id), project);
        }

        if (project?.order !== undefined && project?.order !== null) {
          projectMap.set(String(project.order), project);
        }
      });

      const mappedTasks = workItems.flatMap((item) =>
        mapAssignedWork(item, currentUser, projectMap),
      );

      // Sort by priority, then incomplete tasks first.
      const priorityOrder = {
        Urgent: 0,
        High: 1,
        Normal: 2,
        Low: 3,
      };

      mappedTasks.sort((a, b) => {
        const priorityDifference =
          priorityOrder[a.priority] - priorityOrder[b.priority];

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return a.progress - b.progress;
      });

      setTasks(mappedTasks);
    } catch (err) {
      console.error("Staff dashboard API error:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load your assigned work.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ---------------------------------------------------
  // TASK COUNTS
  // ---------------------------------------------------

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  // ---------------------------------------------------
  // OVERALL PROGRESS
  // ---------------------------------------------------

  const overallProgress = totalTasks
    ? Math.round(
        tasks.reduce((total, task) => total + task.progress, 0) / totalTasks,
      )
    : 0;

  // ---------------------------------------------------
  // TODAY'S TASKS
  // ---------------------------------------------------

  const todayTasks = tasks.filter((task) => isDueToday(task.rawDueDate));

  const recentTasks = tasks.slice(0, 6);

  // ---------------------------------------------------
  // QUICK ACTIONS
  // ---------------------------------------------------

  const quickActions = [
    {
      title: "My Tasks",
      description: "View your assigned work and update its status",
      icon: FiCheckCircle,
      iconBg: "bg-orange-50 dark:bg-orange-500/10",
      iconColor: "text-orange-500 dark:text-orange-400",
      link: "/staff/tasks",
    },
    {
      title: "My Customers",
      description: "View customers connected to your work",
      icon: FiUsers,
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-500 dark:text-blue-400",
      link: "/staff/customers",
    },
    {
      title: "My Projects",
      description: "View your staff account information",
      icon: FiUser,
      iconBg: "bg-purple-50 dark:bg-purple-500/10",
      iconColor: "text-purple-500 dark:text-purple-400",
      link: "/staff/projects",
    },
  ];

  // ---------------------------------------------------
  // LOADING STATE
  // ---------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f8fa] dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <FiRefreshCw size={28} className="animate-spin text-orange-500" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------
  // ERROR STATE
  // ---------------------------------------------------

  if (error) {
    return (
      <div className="min-h-[60vh] bg-[#f7f8fa] p-5 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-6 dark:border-red-900/50 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <FiAlertCircle size={22} className="mt-0.5 shrink-0 text-red-500" />

            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Unable to load dashboard
              </h2>

              <p className="mt-2 break-words text-sm text-slate-500 dark:text-slate-400">
                {error}
              </p>

              <button
                type="button"
                onClick={loadDashboard}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <FiRefreshCw size={15} />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------
  // MAIN DASHBOARD
  // ---------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="p-4 sm:p-5">
        {/* PAGE HEADER */}

        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Staff Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your assigned work and production progress
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FiRefreshCw size={15} />
              Refresh
            </button>

            <Link
              to="/staff/tasks"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <FiCheckCircle size={16} />
              View My Tasks
              <FiArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* TASK STATS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  My Tasks
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {String(totalTasks).padStart(2, "0")}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <FiFileText size={21} />
              </div>
            </div>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-amber-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500/30">
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
          </div>

          {/* IN PROGRESS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30">
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
          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-green-500/30">
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
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-7">
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
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-200 hover:bg-orange-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.iconBg} ${action.iconColor}`}
                    >
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        {action.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <FiArrowRight
                    className="ml-3 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500"
                    size={18}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* OVERVIEW AND TODAY'S WORK */}

        <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* OVERALL PROGRESS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  My Work Overview
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Progress calculated from actual task statuses
                </p>
              </div>

              <button
                type="button"
                onClick={loadDashboard}
                title="Refresh dashboard"
                aria-label="Refresh dashboard"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <FiMoreHorizontal />
              </button>
            </div>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-3">
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
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-400">
                <span>{completedTasks} completed</span>
                <span>{totalTasks} total tasks</span>
              </div>
            </div>

            {/* STATUS BREAKDOWN */}

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

          {/* TODAY'S WORK */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Today's Work
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Tasks with today's delivery date
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {todayTasks.length > 0 ? (
                todayTasks.slice(0, 5).map((task) => {
                  const WorkIcon = getWorkIcon(task.workType);

                  return (
                    <Link
                      key={task.id}
                      to={`/staff/tasks/${task.rawId}`}
                      className="block rounded-xl border border-slate-100 p-3 transition hover:border-orange-200 hover:bg-orange-50/40 dark:border-slate-800 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                          <WorkIcon size={16} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {task.workType}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-400">
                                {task.projectName}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${getStatusStyle(task.status)}`}
                            >
                              {task.status}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className="h-full rounded-full bg-orange-500"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>

                            <span className="text-[10px] font-medium text-slate-400">
                              {task.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="rounded-xl bg-slate-50 p-5 text-center dark:bg-slate-800">
                  <FiCalendar
                    className="mx-auto mb-2 text-slate-400"
                    size={20}
                  />

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

        {/* RECENT ASSIGNED TASKS */}

        <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:p-6 dark:border-slate-800">
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

          {tasks.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <FiFileText size={22} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800 dark:text-white">
                No assigned tasks found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                Your assigned work will appear here when a project is assigned
                to your staff account.
              </p>

              <button
                type="button"
                onClick={loadDashboard}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600"
              >
                <FiRefreshCw size={14} />
                Refresh tasks
              </button>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 text-left dark:border-slate-800">
                      {[
                        "Task",
                        "Project",
                        "Customer",
                        "Work",
                        "Due",
                        "Progress",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {recentTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                      >
                        {/* TASK */}

                        <td className="px-5 py-4">
                          <Link
                            to={`/staff/tasks/${task.rawId}`}
                            className="text-sm font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                          >
                            {task.estimateId}
                          </Link>

                          <p
                            className={`mt-1 text-[10px] font-semibold ${getPriorityStyle(task.priority)}`}
                          >
                            {task.priority} Priority
                          </p>
                        </td>

                        {/* PROJECT */}

                        <td className="px-5 py-4">
                          <p className="max-w-[180px] truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {task.projectName}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {task.projectId}
                          </p>
                        </td>

                        {/* CUSTOMER */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {task.customer.charAt(0).toUpperCase()}
                            </div>

                            <span className="max-w-[160px] truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                              {task.customer}
                            </span>
                          </div>
                        </td>

                        {/* WORK TYPE */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                              {React.createElement(getWorkIcon(task.workType), {
                                size: 14,
                              })}
                            </div>

                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {task.workType}
                            </span>
                          </div>
                        </td>

                        {/* DUE DATE */}

                        <td className="px-5 py-4">
                          <span
                            className={`whitespace-nowrap text-sm font-medium ${
                              task.dueDate === "Today"
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {task.dueDate}
                          </span>
                        </td>

                        {/* PROGRESS */}

                        <td className="px-5 py-4">
                          <div className="w-28">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                  className="h-full rounded-full bg-orange-500"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>

                              <span className="text-[10px] text-slate-400">
                                {task.progress}%
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(task.status)}`}
                          >
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE TASK CARDS */}

              <div className="space-y-3 p-4 md:hidden">
                {recentTasks.map((task) => {
                  const WorkIcon = getWorkIcon(task.workType);

                  return (
                    <Link
                      key={task.id}
                      to={`/staff/tasks/${task.rawId}`}
                      className="block rounded-xl border border-slate-200 p-4 transition hover:border-orange-200 dark:border-slate-800 dark:hover:border-orange-500/30"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                          {task.estimateId}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(task.status)}`}
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

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                            <WorkIcon size={14} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                              {task.workType}
                            </p>

                            <p className="truncate text-[10px] text-slate-400">
                              {task.customer}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 text-xs font-medium ${
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
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* WHATSAPP SUPPORT */}

        <button
          type="button"
          title="WhatsApp"
          aria-label="Open WhatsApp"
          onClick={() =>
            window.open(
              "https://wa.me/9779742992187",
              "_blank",
              "noopener,noreferrer",
            )
          }
          className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-green-600 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 dark:bg-green-600 dark:hover:bg-green-500"
        >
          <FaWhatsapp size={26} />

          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />

            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-orange-500 dark:border-slate-950" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default StaffDashboard;
