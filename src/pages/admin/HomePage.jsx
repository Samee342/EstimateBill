import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiFileText,
  FiUsers,
  FiPrinter,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiCreditCard,
  FiAlertCircle,
  FiBriefcase,
} from "react-icons/fi";

import { FaMoneyBillWave, FaWhatsapp } from "react-icons/fa";
import { MdPeopleOutline } from "react-icons/md";

import { getProjects } from "../../api/project";
import { getCustomer } from "../../api/customer";

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getRecords = (response, possibleKeys = []) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  for (const key of possibleKeys) {
    if (Array.isArray(response[key])) {
      return response[key];
    }
  }

  return [];
};

const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const formatNPR = (value) => {
  return `Rs. ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(toAmount(value))}`;
};

// Avoid date-only strings being shifted by timezone conversion.
const getDateKey = (value) => {
  if (!value) return "";

  const valueString = String(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(valueString)) {
    return valueString;
  }

  const date = new Date(valueString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTodayKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const dateKey = getDateKey(value);

  if (!dateKey) return "—";

  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCustomerName = (project) => {
  return (
    project?.customer_details?.name ||
    project?.customer_name ||
    project?.customer_details?.customer_name ||
    (project?.customer ? `Customer #${project.customer}` : "Unknown customer")
  );
};

const getEstimateNumber = (project) => {
  return project?.slip_no != null ? `EST-${project.slip_no}` : "Estimate";
};

const getStage = (project) => {
  return String(project?.work_stage || "pending")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ");
};

const getSortDate = (project) => {
  const value =
    project?.updated_at || project?.created_at || project?.slip_date;
  const timestamp = value ? new Date(value).getTime() : 0;

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getStatusStyle = (status) => {
  switch (
    String(status || "")
      .toLowerCase()
      .replace(/_/g, " ")
  ) {
    case "completed":
    case "delivered":
      return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "printed":
    case "printing":
    case "in progress":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

    case "pending":
      return "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

    case "design":
      return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";

    case "ready":
      return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    default:
      return "bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  }
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const HomePage = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // =====================================================
  // FETCH REAL DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setLoading(true);
      setApiError("");

      try {
        console.log("==========================================");
        console.log("PRINTTECH DASHBOARD DATA REQUEST");
        console.log("==========================================");

        const results = await Promise.allSettled([
          getProjects(),
          getCustomer(),
        ]);

        if (!isMounted) return;

        const projectResult = results[0];
        const customerResult = results[1];

        if (projectResult.status === "fulfilled") {
          const projectResponse = projectResult.value;

          const projectRecords = getRecords(projectResponse, [
            "orders",
            "results",
            "data",
            "projects",
          ]);

          console.log("[PROJECTS] API response:", projectResponse);
          console.log("[PROJECTS] Record count:", projectRecords.length);
          console.log("[PROJECTS] Work stages:", [
            ...new Set(projectRecords.map((project) => project.work_stage)),
          ]);

          setProjects(projectRecords);
        } else {
          console.error("[PROJECTS] API request failed:", projectResult.reason);
          setProjects([]);
        }

        if (customerResult.status === "fulfilled") {
          const customerResponse = customerResult.value;

          const customerRecords = getRecords(customerResponse, [
            "customers",
            "results",
            "data",
          ]);

          console.log("[CUSTOMERS] API response:", customerResponse);
          console.log("[CUSTOMERS] Record count:", customerRecords.length);

          setCustomers(customerRecords);
        } else {
          console.error(
            "[CUSTOMERS] API request failed:",
            customerResult.reason,
          );

          setCustomers([]);
        }

        const failures = results.filter(
          (result) => result.status === "rejected",
        );

        if (failures.length === results.length) {
          setApiError("Unable to load dashboard data. Please try again.");
        } else if (failures.length > 0) {
          setApiError(
            "Some dashboard data could not be loaded. Check your API connection.",
          );
        }

        console.log("==========================================");
        console.log("PRINTTECH DASHBOARD DATA LOADED");
        console.log("==========================================");
      } catch (error) {
        console.error("[DASHBOARD] Unexpected error:", error);

        if (isMounted) {
          setApiError("Unable to load dashboard data.");
          setProjects([]);
          setCustomers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // CALCULATE REAL STATISTICS
  // =====================================================

  const today = getTodayKey();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const totalEstimates = projects.length;

  const pendingProjects = projects.filter(
    (project) => getStage(project) === "pending",
  );

  const printedProjects = projects.filter(
    (project) => getStage(project) === "printed",
  );

  const totalBilled = projects.reduce(
    (sum, project) => sum + toAmount(project.total_amount),
    0,
  );

  const totalPaid = projects.reduce(
    (sum, project) => sum + toAmount(project.paid_amount),
    0,
  );

  const totalPending = projects.reduce(
    (sum, project) => sum + toAmount(project.balance),
    0,
  );

  const todayProjects = projects.filter(
    (project) => getDateKey(project.slip_date) === today,
  );

  const todaySales = todayProjects.reduce(
    (sum, project) => sum + toAmount(project.total_amount),
    0,
  );

  const paidOnTodayOrders = todayProjects.reduce(
    (sum, project) => sum + toAmount(project.paid_amount),
    0,
  );

  // Monthly amounts are grouped by slip_date because the orders API
  // does not currently provide individual payment transaction dates.
  const monthlyRevenue = Array.from({ length: 12 }, (_, monthIndex) => {
    const monthProjects = projects.filter((project) => {
      const dateKey = getDateKey(project.slip_date);

      if (!dateKey) return false;

      const [year, month] = dateKey.split("-").map(Number);

      return year === currentYear && month === monthIndex + 1;
    });

    return {
      month: new Date(currentYear, monthIndex, 1).toLocaleDateString("en-US", {
        month: "short",
      }),
      value: monthProjects.reduce(
        (sum, project) => sum + toAmount(project.paid_amount),
        0,
      ),
    };
  });

  const highestMonthlyRevenue = Math.max(
    0,
    ...monthlyRevenue.map((item) => item.value),
  );

  const currentMonthRevenue = monthlyRevenue[currentMonth]?.value || 0;

  const maxChartValue = Math.max(
    1,
    ...monthlyRevenue.map((item) => item.value),
  );

  // Calculate percentages from actual billed amounts.
  const collectedPercentage =
    totalBilled > 0 ? Math.min((totalPaid / totalBilled) * 100, 100) : 0;

  const pendingPercentage =
    totalBilled > 0 ? Math.min((totalPending / totalBilled) * 100, 100) : 0;

  const paymentTotal = totalPaid + totalPending;

  const paymentCollectedPercentage =
    paymentTotal > 0 ? (totalPaid / paymentTotal) * 100 : 0;

  const paymentPendingPercentage =
    paymentTotal > 0 ? (totalPending / paymentTotal) * 100 : 0;

  // =====================================================
  // MAIN STATS
  // =====================================================

  const stats = [
    {
      title: "Total Estimates",
      value: totalEstimates.toLocaleString("en-IN"),
      description: "All available projects",
      icon: FiFileText,
    },
    {
      title: "Pending Estimates",
      value: pendingProjects.length.toLocaleString("en-IN"),
      description: "Awaiting work",
      icon: FiClock,
    },
    {
      title: "Printed Bills",
      value: printedProjects.length.toLocaleString("en-IN"),
      description: "Marked as printed",
      icon: FiPrinter,
    },
    {
      title: "Total Customers",
      value: customers.length.toLocaleString("en-IN"),
      description: "Customers returned by API",
      icon: MdPeopleOutline,
    },
    {
      title: "Total Revenue",
      value: formatNPR(totalPaid),
      description: "Total recorded paid amount",
      icon: FaMoneyBillWave,
    },
  ];

  // =====================================================
  // TODAY SUMMARY
  // =====================================================

  const todaySummary = [
    {
      title: "Today's Sales",
      value: formatNPR(todaySales),
      icon: FaMoneyBillWave,
    },
    {
      title: "Today's Estimates",
      value: todayProjects.length.toLocaleString("en-IN"),
      icon: FiFileText,
    },
    {
      title: "Paid on Today's Orders",
      value: formatNPR(paidOnTodayOrders),
      icon: FiCreditCard,
    },
    {
      title: "Pending Amount",
      value: formatNPR(totalPending),
      icon: FiAlertCircle,
    },
  ];

  // =====================================================
  // DERIVED LISTS
  // =====================================================

  const sortedProjects = [...projects].sort(
    (a, b) => getSortDate(b) - getSortDate(a),
  );

  const recentEstimates = sortedProjects.slice(0, 5);

  const dueTodayProjects = projects
    .filter((project) => getDateKey(project.delivery_date) === today)
    .sort((a, b) => {
      return String(a.delivery_date || "").localeCompare(
        String(b.delivery_date || ""),
      );
    });

  // These are orders with payments recorded, not individual payment
  // transactions. A transaction history endpoint is needed for that.
  const recentPaidOrders = sortedProjects
    .filter((project) => toAmount(project.paid_amount) > 0)
    .slice(0, 4);

  const recentUpdates = sortedProjects.slice(0, 4);

  const orderStatusItems = [
    {
      name: "Pending",
      count: pendingProjects.length,
      bar: "bg-orange-400",
      text: "text-orange-600 dark:text-orange-400",
    },
    {
      name: "Printed",
      count: printedProjects.length,
      bar: "bg-blue-400",
      text: "text-blue-600 dark:text-blue-400",
    },
  ];

  const paymentItems = [
    {
      title: "Collected",
      value: formatNPR(totalPaid),
      percentage: paymentCollectedPercentage,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: formatNPR(totalPending),
      percentage: paymentPendingPercentage,
      color: "bg-orange-500",
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <main>
        <div className="px-3 py-5 sm:px-5 md:p-8">
          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Overview of your printing business.
              </p>

              {apiError && (
                <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                  {apiError}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate("/projects/create-project")}
              className="flex w-20 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              <FiPlus size={17} />
              New Project
            </button>
          </div>

          {/* MAIN STATS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 sm:rounded-2xl sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                        {stat.title}
                      </p>

                      <h3 className="mt-2 truncate text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
                        {loading ? "..." : stat.value}
                      </h3>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 sm:h-11 sm:w-11 sm:rounded-xl dark:bg-orange-500/10">
                      <Icon size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TODAY SUMMARY */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 sm:rounded-2xl sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Today's Summary
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Activity based on today's estimate dates
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {todaySummary.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                        <Icon size={16} />
                      </div>

                      <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                        {item.title}
                      </p>
                    </div>

                    <p className="mt-3 truncate text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                      {loading ? "..." : item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* REVENUE OVERVIEW */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Revenue Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Recorded paid amounts grouped by estimate date
                </p>
              </div>

              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {currentYear}
              </span>
            </div>

            <div className="flex h-80 items-end gap-3 overflow-x-auto px-2 sm:gap-4">
              {monthlyRevenue.map((item) => {
                const height =
                  item.value > 0
                    ? Math.max((item.value / maxChartValue) * 100, 4)
                    : 0;

                return (
                  <div
                    key={item.month}
                    className="group flex h-full min-w-[42px] flex-1 flex-col items-center justify-end"
                  >
                    <div className="mb-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-md transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 dark:bg-white dark:text-slate-900">
                      {formatNPR(item.value)}
                    </div>

                    <div
                      className={`w-full max-w-[52px] rounded-t-lg ${
                        item.value > 0
                          ? "bg-orange-500"
                          : "bg-slate-100 dark:bg-slate-800"
                      } transition-all duration-300 group-hover:brightness-110`}
                      style={{ height: `${height}%` }}
                    />

                    <span className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Highest Monthly Recorded Amount
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  {formatNPR(highestMonthlyRevenue)}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current Month
                </p>

                <p className="mt-1 text-lg font-bold text-orange-500">
                  {formatNPR(currentMonthRevenue)}
                </p>
              </div>
            </div>
          </div>

          {/* ORDER STATUS + PAYMENT OVERVIEW */}
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* ORDER STATUS */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:rounded-2xl sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Order Status
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Current project workload
                  </p>
                </div>

                <FiBriefcase className="text-slate-300 dark:text-slate-600" />
              </div>

              <div className="mt-6 space-y-5">
                {orderStatusItems.map((item) => (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {item.name}
                      </span>

                      <span className={`text-xs font-bold ${item.text}`}>
                        {loading ? "..." : item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full ${item.bar} transition-all`}
                        style={{
                          width: `${
                            totalEstimates > 0
                              ? (item.count / totalEstimates) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                <p className="text-xs text-slate-400">
                  These counts use the work stages currently returned by your
                  API.
                </p>
              </div>
            </div>

            {/* PAYMENT OVERVIEW */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:rounded-2xl sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Payment Overview
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Recorded payments and outstanding balances
                </p>
              </div>

              <div className="mt-6">
                <div className="flex h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  {paymentItems.map((item) => (
                    <div
                      key={item.title}
                      className={item.color}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {paymentItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                      />

                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {item.title}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {loading ? "..." : item.value}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Total billed
                    </span>

                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {loading ? "..." : formatNPR(totalBilled)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WORK DUE TODAY */}
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white sm:rounded-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Work Due Today
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Projects with today's delivery date
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="self-start text-xs font-semibold text-orange-500 hover:text-orange-600 sm:self-auto"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left dark:border-slate-800">
                    {[
                      "Estimate",
                      "Project",
                      "Customer",
                      "Due Date",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {!loading && dueTodayProjects.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-sm text-slate-400"
                      >
                        No projects are due today.
                      </td>
                    </tr>
                  )}

                  {dueTodayProjects.map((project) => (
                    <tr
                      key={project.id}
                      onClick={() => navigate("/projects")}
                      className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4 text-xs font-semibold text-orange-600 dark:text-orange-400">
                        {getEstimateNumber(project)}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {project.project_name || "Untitled project"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {getCustomerName(project)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {formatDate(project.delivery_date)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                            getStage(project),
                          )}`}
                        >
                          {getStage(project)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECENT ESTIMATES + RECENT PAID ORDERS */}
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            {/* RECENT ESTIMATES */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white sm:rounded-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-6 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Recent Estimates
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Latest projects returned by the API
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="text-xs font-semibold text-orange-500 hover:text-orange-600"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {!loading && recentEstimates.length === 0 && (
                  <p className="p-6 text-center text-sm text-slate-400">
                    No estimates found.
                  </p>
                )}

                {recentEstimates.map((estimate) => (
                  <div
                    key={estimate.id}
                    onClick={() => navigate("/projects")}
                    className="flex cursor-pointer items-center gap-3 p-4 transition hover:bg-slate-50 sm:px-6 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      {getCustomerName(estimate).charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {estimate.project_name || "Untitled project"}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        {getEstimateNumber(estimate)} •{" "}
                        {getCustomerName(estimate)} •{" "}
                        {formatDate(estimate.slip_date)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="whitespace-nowrap text-xs font-bold text-slate-700 dark:text-slate-200">
                        {formatNPR(estimate.total_amount)}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${getStatusStyle(
                          getStage(estimate),
                        )}`}
                      >
                        {getStage(estimate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT PAID ORDERS */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white sm:rounded-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-6 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Recent Paid Orders
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Latest orders with recorded payments
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/reports/payments")}
                  className="text-xs font-semibold text-orange-500 hover:text-orange-600"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {!loading && recentPaidOrders.length === 0 && (
                  <p className="p-6 text-center text-sm text-slate-400">
                    No paid orders found.
                  </p>
                )}

                {recentPaidOrders.map((payment) => (
                  <div
                    key={payment.id}
                    onClick={() => navigate("/projects")}
                    className="flex cursor-pointer items-center gap-3 p-4 transition hover:bg-slate-50 sm:px-6 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                      <FiCheckCircle size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {getCustomerName(payment)}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {getEstimateNumber(payment)} •{" "}
                        {formatDate(payment.slip_date)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                        {formatNPR(payment.paid_amount)}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Paid against order
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT PROJECT UPDATES */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 sm:rounded-2xl sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Recent Project Updates
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Latest project records by update time
                </p>
              </div>

              <FiUsers className="text-slate-300 dark:text-slate-600" />
            </div>

            <div className="mt-5 space-y-5">
              {!loading && recentUpdates.length === 0 && (
                <p className="text-sm text-slate-400">
                  No recent project updates.
                </p>
              )}

              {recentUpdates.map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => navigate("/projects")}
                  className="flex cursor-pointer gap-3"
                >
                  <div className="relative flex w-5 justify-center">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-500" />

                    {index !== recentUpdates.length - 1 && (
                      <span className="absolute top-4 h-full w-px bg-slate-200 dark:bg-slate-800" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {getEstimateNumber(project)} —{" "}
                      {project.project_name || "Untitled project"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {getCustomerName(project)} · Stage: {getStage(project)}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Updated:{" "}
                      {project.updated_at
                        ? new Date(project.updated_at).toLocaleString()
                        : formatDate(project.slip_date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* FLOATING WHATSAPP */}
      <button
        type="button"
        title="WhatsApp"
        aria-label="Open WhatsApp"
        onClick={() =>
          window.open(
            "https://wa.me/9779800526479",
            "_blank",
            "noopener,noreferrer",
          )
        }
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600 hover:shadow-xl sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 dark:bg-green-600 dark:hover:bg-green-500"
      >
        <FaWhatsapp size={26} />

        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />

          <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-orange-500 dark:border-slate-950" />
        </span>
      </button>
    </div>
  );
};

export default HomePage;
