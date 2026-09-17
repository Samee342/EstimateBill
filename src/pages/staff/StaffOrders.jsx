import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiFileText,
  FiFilter,
  FiPrinter,
  FiSearch,
  FiScissors,
} from "react-icons/fi";

const initialOrders = [
  {
    id: "PRJ-1001",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    date: "2026-09-15",
    dueDate: "2026-09-17",
    amount: "Rs. 12,500",
    priority: "High",

    tasks: [
      {
        id: "TASK-1001",
        workType: "Design",
        assignedTo: "PrintTech Staff",
        status: "Completed",
        progress: 100,
      },
      {
        id: "TASK-1002",
        workType: "Printing",
        assignedTo: "PrintTech Staff",
        status: "In Progress",
        progress: 65,
      },
      {
        id: "TASK-1003",
        workType: "Cutting",
        assignedTo: "Other Staff",
        status: "Pending",
        progress: 0,
      },
    ],
  },

  {
    id: "PRJ-1002",
    projectName: "Restaurant Menu Printing",
    customer: "ABC Restaurant",
    date: "2026-09-16",
    dueDate: "2026-09-18",
    amount: "Rs. 8,500",
    priority: "Normal",

    tasks: [
      {
        id: "TASK-1004",
        workType: "Design",
        assignedTo: "Other Staff",
        status: "Completed",
        progress: 100,
      },
      {
        id: "TASK-1005",
        workType: "Printing",
        assignedTo: "PrintTech Staff",
        status: "In Progress",
        progress: 40,
      },
      {
        id: "TASK-1006",
        workType: "Lamination",
        assignedTo: "PrintTech Staff",
        status: "Pending",
        progress: 0,
      },
    ],
  },

  {
    id: "PRJ-1003",
    projectName: "Wedding Invitation Cards",
    customer: "Sita Karki",
    date: "2026-09-16",
    dueDate: "2026-09-18",
    amount: "Rs. 15,000",
    priority: "High",

    tasks: [
      {
        id: "TASK-1007",
        workType: "Design",
        assignedTo: "Other Staff",
        status: "Completed",
        progress: 100,
      },
      {
        id: "TASK-1008",
        workType: "Printing",
        assignedTo: "Other Staff",
        status: "Completed",
        progress: 100,
      },
      {
        id: "TASK-1009",
        workType: "Binding",
        assignedTo: "PrintTech Staff",
        status: "Pending",
        progress: 0,
      },
    ],
  },

  {
    id: "PRJ-1004",
    projectName: "Company Brochure",
    customer: "Everest Traders",
    date: "2026-09-17",
    dueDate: "2026-09-19",
    amount: "Rs. 6,800",
    priority: "Normal",

    tasks: [
      {
        id: "TASK-1010",
        workType: "Printing",
        assignedTo: "PrintTech Staff",
        status: "Completed",
        progress: 100,
      },
      {
        id: "TASK-1011",
        workType: "Finishing",
        assignedTo: "PrintTech Staff",
        status: "In Progress",
        progress: 50,
      },
    ],
  },

  {
    id: "PRJ-1005",
    projectName: "Product Label Printing",
    customer: "New Star Hotel",
    date: "2026-09-17",
    dueDate: "2026-09-20",
    amount: "Rs. 9,200",
    priority: "Normal",

    tasks: [
      {
        id: "TASK-1012",
        workType: "Printing",
        assignedTo: "PrintTech Staff",
        status: "Pending",
        progress: 0,
      },
      {
        id: "TASK-1013",
        workType: "Cutting",
        assignedTo: "Other Staff",
        status: "Pending",
        progress: 0,
      },
    ],
  },

  {
    id: "PRJ-1006",
    projectName: "Office Letterhead",
    customer: "Himalayan School",
    date: "2026-09-17",
    dueDate: "2026-09-21",
    amount: "Rs. 4,500",
    priority: "Low",

    tasks: [
      {
        id: "TASK-1014",
        workType: "Printing",
        assignedTo: "PrintTech Staff",
        status: "Pending",
        progress: 0,
      },
    ],
  },
];

const CURRENT_STAFF = "PrintTech Staff";

const StaffOrders = () => {
  const [orders, setOrders] = useState(initialOrders);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [priorityFilter, setPriorityFilter] = useState("All");

  const [expandedOrder, setExpandedOrder] = useState(null);

  // =====================================================
  // GET ONLY CURRENT STAFF TASKS
  // =====================================================

  const staffOrders = useMemo(() => {
    return orders
      .map((order) => {
        const myTasks = order.tasks.filter(
          (task) => task.assignedTo === CURRENT_STAFF
        );

        return {
          ...order,
          myTasks,
        };
      })
      .filter((order) => order.myTasks.length > 0);
  }, [orders]);

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const getOrderStatus = (order) => {
    const tasks = order.myTasks;

    if (tasks.every((task) => task.status === "Completed")) {
      return "Completed";
    }

    if (tasks.some((task) => task.status === "In Progress")) {
      return "In Progress";
    }

    return "Pending";
  };

  // =====================================================
  // ORDER PROGRESS
  // =====================================================

  const getOrderProgress = (order) => {
    if (!order.myTasks.length) return 0;

    const totalProgress = order.myTasks.reduce(
      (total, task) => total + task.progress,
      0
    );

    return Math.round(
      totalProgress / order.myTasks.length
    );
  };

  // =====================================================
  // UPDATE TASK STATUS
  // =====================================================

  const updateTaskStatus = (
    orderId,
    taskId,
    newStatus
  ) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        return {
          ...order,

          tasks: order.tasks.map((task) => {
            if (task.id !== taskId) {
              return task;
            }

            let progress = task.progress;

            if (newStatus === "Pending") {
              progress = 0;
            }

            if (newStatus === "In Progress") {
              progress =
                task.progress === 0
                  ? 20
                  : task.progress;
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
        };
      })
    );
  };

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders = useMemo(() => {
    return staffOrders.filter((order) => {
      const orderStatus = getOrderStatus(order);

      const searchText = `
        ${order.id}
        ${order.projectName}
        ${order.customer}
        ${order.myTasks
          .map((task) => task.workType)
          .join(" ")}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All" ||
        orderStatus === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        order.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    staffOrders,
    search,
    statusFilter,
    priorityFilter,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalOrders = staffOrders.length;

  const pendingOrders = staffOrders.filter(
    (order) => getOrderStatus(order) === "Pending"
  ).length;

  const inProgressOrders = staffOrders.filter(
    (order) => getOrderStatus(order) === "In Progress"
  ).length;

  const completedOrders = staffOrders.filter(
    (order) => getOrderStatus(order) === "Completed"
  ).length;

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/10";

      case "In Progress":
        return "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/10";

      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/10";

      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
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

      case "Low":
        return "text-blue-500";

      default:
        return "text-slate-400";
    }
  };

  // =====================================================
  // WORK ICON
  // =====================================================

  const getWorkIcon = (workType) => {
    switch (workType) {
      case "Printing":
        return FiPrinter;

      case "Cutting":
        return FiScissors;

      case "Design":
        return FiFileText;

      case "Binding":
        return FiFileText;

      case "Lamination":
        return FiFileText;

      case "Finishing":
        return FiCheckCircle;

      default:
        return FiFileText;
    }
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    const formattedDate = new Date(
      `${date}T00:00:00`
    );

    return formattedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">

      <div className="p-5 md:p-8">

        {/* =================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                My Orders
              </h1>

              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                Assigned
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Projects connected to your assigned printing work.
            </p>

          </div>

          <Link
            to="/staff/tasks"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 hover:shadow-md"
          >
            <FiCheckCircle size={16} />

            Manage My Tasks

            <FiArrowRight size={15} />
          </Link>

        </div>

        {/* =================================================
            STATS
        ================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  My Orders
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {String(totalOrders).padStart(2, "0")}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400">
                <FiFileText size={21} />
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Projects assigned to you
            </p>

          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Pending
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {String(pendingOrders).padStart(2, "0")}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400">
                <FiClock size={21} />
              </div>

            </div>

            <p className="mt-4 text-xs text-amber-500">
              Projects waiting for your work
            </p>

          </div>

          {/* IN PROGRESS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  In Progress
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {String(inProgressOrders).padStart(2, "0")}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                <FiPrinter size={21} />
              </div>

            </div>

            <p className="mt-4 text-xs text-orange-500">
              Projects currently in progress
            </p>

          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Completed
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {String(completedOrders).padStart(2, "0")}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-500 dark:bg-green-500/10 dark:text-green-400">
                <FiCheckCircle size={21} />
              </div>

            </div>

            <p className="mt-4 text-xs text-green-500">
              All assigned work completed
            </p>

          </div>

        </div>

        {/* =================================================
            FILTERS
        ================================================== */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">

            {/* SEARCH */}

            <div className="relative flex-1">

              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search project, customer, work..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-orange-500/50 dark:focus:ring-orange-500/10"
              />

            </div>

            {/* STATUS */}

            <div className="relative">

              <FiFilter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={15}
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm font-medium text-slate-600 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 xl:w-44"
              >
                <option value="All">
                  All Status
                </option>

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

              <FiChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={15}
              />

            </div>

            {/* PRIORITY */}

            <div className="relative">

              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value)
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-9 text-sm font-medium text-slate-600 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 xl:w-40"
              >
                <option value="All">
                  All Priority
                </option>

                <option value="High">
                  High
                </option>

                <option value="Normal">
                  Normal
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

              <FiChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={15}
              />

            </div>

            {/* CLEAR */}

            {(search ||
              statusFilter !== "All" ||
              priorityFilter !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 rounded-xl px-4 text-sm font-semibold text-orange-500 transition hover:bg-orange-50 dark:hover:bg-orange-500/10"
              >
                Clear Filters
              </button>
            )}

          </div>

        </div>

        {/* =================================================
            PROJECT LIST
        ================================================== */}

        <div className="mt-6 space-y-4">

          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {

              const orderStatus =
                getOrderStatus(order);

              const orderProgress =
                getOrderProgress(order);

              const isExpanded =
                expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                >

                  {/* =================================================
                      PROJECT HEADER
                  ================================================== */}

                  <div className="p-5 md:p-6">

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      {/* PROJECT INFO */}

                      <div className="flex min-w-0 items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                          <FiFileText size={21} />
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                              {order.id}
                            </span>

                            <span
                              className={`text-xs font-semibold ${getPriorityStyle(
                                order.priority
                              )}`}
                            >
                              {order.priority} Priority
                            </span>

                          </div>

                          <h2 className="mt-1 truncate text-base font-bold text-slate-900 dark:text-white md:text-lg">
                            {order.projectName}
                          </h2>

                          <p className="mt-1 text-sm text-slate-400">
                            {order.customer}
                          </p>

                        </div>

                      </div>

                      {/* PROJECT META */}

                      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 xl:min-w-[500px]">

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Created
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                            {formatDate(order.date)}
                          </p>

                        </div>

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Due Date
                          </p>

                          <p className="mt-1 text-sm font-semibold text-orange-600 dark:text-orange-400">
                            {formatDate(order.dueDate)}
                          </p>

                        </div>

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Amount
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-white">
                            {order.amount}
                          </p>

                        </div>

                        <div>

                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Status
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                              orderStatus
                            )}`}
                          >
                            {orderStatus}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        PROGRESS
                    ================================================== */}

                    <div className="mt-6">

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          My Work Progress
                        </span>

                        <span className="text-xs font-bold text-orange-500">
                          {orderProgress}%
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                        <div
                          className="h-full rounded-full bg-orange-500 transition-all duration-300"
                          style={{
                            width: `${orderProgress}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">

                      <p className="text-xs text-slate-400">

                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {order.myTasks.length}
                        </span>{" "}
                        task
                        {order.myTasks.length > 1
                          ? "s"
                          : ""}{" "}
                        assigned to you

                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(
                            isExpanded
                              ? null
                              : order.id
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-orange-500/30 dark:hover:bg-orange-500/10 dark:hover:text-orange-400"
                      >

                        {isExpanded
                          ? "Hide My Tasks"
                          : "View My Tasks"}

                        <FiChevronDown
                          className={`transition-transform ${
                            isExpanded
                              ? "rotate-180"
                              : ""
                          }`}
                          size={15}
                        />

                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      TASK BREAKDOWN
                  ================================================== */}

                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40 md:p-6">

                      <div className="mb-4">

                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                          My Assigned Tasks
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Update only the work assigned to you.
                        </p>

                      </div>

                      <div className="space-y-3">

                        {order.myTasks.map((task) => {

                          const WorkIcon =
                            getWorkIcon(
                              task.workType
                            );

                          return (
                            <div
                              key={task.id}
                              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                            >

                              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                {/* TASK INFO */}

                                <div className="flex items-center gap-3">

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                                    <WorkIcon size={17} />
                                  </div>

                                  <div>

                                    <div className="flex flex-wrap items-center gap-2">

                                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                                        {task.workType}
                                      </p>

                                      <span className="text-[10px] text-slate-400">
                                        {task.id}
                                      </span>

                                    </div>

                                    <p className="mt-1 text-xs text-slate-400">
                                      Assigned to you
                                    </p>

                                  </div>

                                </div>

                                {/* PROGRESS */}

                                <div className="w-full lg:w-48">

                                  <div className="mb-1 flex justify-between">

                                    <span className="text-[10px] text-slate-400">
                                      Progress
                                    </span>

                                    <span className="text-[10px] font-bold text-orange-500">
                                      {task.progress}%
                                    </span>

                                  </div>

                                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                                    <div
                                      className="h-full rounded-full bg-orange-500 transition-all"
                                      style={{
                                        width: `${task.progress}%`,
                                      }}
                                    />

                                  </div>

                                </div>

                                {/* STATUS */}

                                <div className="flex flex-wrap items-center gap-3">

                                  <span
                                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                                      task.status
                                    )}`}
                                  >
                                    {task.status}
                                  </span>

                                  <select
                                    value={task.status}
                                    onChange={(event) =>
                                      updateTaskStatus(
                                        order.id,
                                        task.id,
                                        event.target.value
                                      )
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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

                            </div>
                          );
                        })}

                      </div>

                    </div>
                  )}

                </div>
              );
            })
          ) : (

            /* =================================================
               EMPTY STATE
            ================================================== */

            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <FiSearch size={23} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-white">
                No orders found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
                No projects match your current search or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Clear Filters
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default StaffOrders;