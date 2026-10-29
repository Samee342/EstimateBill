import React, { useEffect, useMemo, useState } from "react";
import {
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiSearch,
  FiTrendingUp,
  FiDownload,
  FiClock,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../../api/project";

// ========================================
// HELPERS
// ========================================

const getProjectRecords = (response) => {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.orders)) return response.orders;

  return [];
};

const formatCurrency = (amount) => {
  return `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

// Parse ISO dates without accidentally shifting the calendar day.
const parseSaleDate = (date) => {
  if (!date) return null;

  const datePart = String(date).slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) return null;

  const parsedDate = new Date(year, month - 1, day);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const formatDate = (date) => {
  const parsedDate = parseSaleDate(date);

  if (!parsedDate) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDisplayId = (sale) => {
  return sale.slip_no !== null && sale.slip_no !== undefined
    ? `EST-${sale.slip_no}`
    : "EST-—";
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Paid":
      return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "Partial":
      return "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

    case "Pending":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  }
};

const getWorkStageStyle = (stage) => {
  switch (
    String(stage || "")
      .toLowerCase()
      .replace(/_/g, " ")
  ) {
    case "pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

    case "designing":
      return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";

    case "in progress":
    case "processing":
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

    case "printed":
      return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "completed":
    case "delivered":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";

    case "cancelled":
    case "canceled":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  }
};

const getSaleStatus = (amount, paid, balance) => {
  if (balance <= 0) return "Paid";
  if (paid > 0) return "Partial";
  if (amount > 0 || balance > 0) return "Pending";

  return "Pending";
};

const getErrorMessage = (error) => {
  if (error.response?.data) {
    const data = error.response.data;

    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;

    return JSON.stringify(data);
  }

  return error.message || "Unable to load sales data.";
};

// ========================================
// SALES REPORT COMPONENT
// ========================================

const SalesReport = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This Month");
  const [statusFilter, setStatusFilter] = useState("All");

  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH REAL PROJECTS / SALES
  // ========================================

  useEffect(() => {
    let isMounted = true;

    const fetchSales = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("[SALES REPORT] Fetching projects from API...");

        const response = await getProjects();

        console.log("[SALES REPORT] API response:", response);

        const records = getProjectRecords(response);

        console.log("[SALES REPORT] Record count:", records.length);

        if (records.length > 0) {
          console.log("[SALES REPORT] First project:", records[0]);
        }

        const mappedSales = records.map((project) => {
          const amount = Number(project.total_amount) || 0;
          const paid = Number(project.paid_amount) || 0;

          // Prefer the API balance. If it is missing, calculate it.
          const balance =
            project.balance !== null &&
            project.balance !== undefined &&
            project.balance !== ""
              ? Number(project.balance) || 0
              : Math.max(amount - paid, 0);

          return {
            id: project.id,
            slip_no: project.slip_no,
            displayId: getDisplayId(project),

            customer:
              project.customer_details?.name ||
              project.customer_name ||
              "Unknown Customer",

            project: project.project_name || "Untitled Project",

            date: project.slip_date || project.created_at || "",
            amount,
            paid,
            balance,

            workStage: project.work_stage || "pending",

            status: getSaleStatus(amount, paid, balance),
          };
        });

        // Newest orders first.
        mappedSales.sort((a, b) => {
          const dateA = parseSaleDate(a.date)?.getTime() || 0;
          const dateB = parseSaleDate(b.date)?.getTime() || 0;

          return dateB - dateA;
        });

        if (isMounted) {
          setSalesData(mappedSales);
        }
      } catch (error) {
        console.error("[SALES REPORT] Failed to load sales:", error);
        console.error("[SALES REPORT] Backend response:", error.response?.data);

        if (isMounted) {
          setError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSales();

    return () => {
      isMounted = false;
    };
  }, []);

  // ========================================
  // FILTER SALES
  // ========================================

  const filteredSales = useMemo(() => {
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const normalizedSearch = search.trim().toLowerCase();

    return salesData.filter((sale) => {
      const saleDate = parseSaleDate(sale.date);

      const matchesSearch =
        sale.customer.toLowerCase().includes(normalizedSearch) ||
        sale.project.toLowerCase().includes(normalizedSearch) ||
        sale.displayId.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || sale.status === statusFilter;

      let matchesPeriod = true;

      if (period === "This Month") {
        matchesPeriod =
          saleDate !== null &&
          saleDate.getMonth() === currentMonth &&
          saleDate.getFullYear() === currentYear;
      }

      if (period === "Last Month") {
        const lastMonth = new Date(currentYear, currentMonth - 1, 1);

        matchesPeriod =
          saleDate !== null &&
          saleDate.getMonth() === lastMonth.getMonth() &&
          saleDate.getFullYear() === lastMonth.getFullYear();
      }

      if (period === "Last 3 Months") {
        const startDate = new Date(currentYear, currentMonth - 2, 1);

        matchesPeriod =
          saleDate !== null && saleDate >= startDate && saleDate <= today;
      }

      if (period === "This Year") {
        matchesPeriod =
          saleDate !== null && saleDate.getFullYear() === currentYear;
      }

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [salesData, search, statusFilter, period]);

  // ========================================
  // TOTALS
  // ========================================

  const totalSales = filteredSales.reduce(
    (total, sale) => total + sale.amount,
    0,
  );

  const totalReceived = filteredSales.reduce(
    (total, sale) => total + sale.paid,
    0,
  );

  const totalPending = filteredSales.reduce(
    (total, sale) => total + sale.balance,
    0,
  );

  // ========================================
  // REAL MONTHLY SALES
  // Uses all fetched records for the current year.
  // ========================================

  const monthlySales = useMemo(() => {
    const currentYear = new Date().getFullYear();

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

    const totals = Array(12).fill(0);

    salesData.forEach((sale) => {
      const saleDate = parseSaleDate(sale.date);

      if (saleDate && saleDate.getFullYear() === currentYear) {
        totals[saleDate.getMonth()] += sale.amount;
      }
    });

    const maxValue = Math.max(...totals, 1);

    return months.map((month, index) => ({
      month,
      amount: totals[index],
      height:
        totals[index] > 0 ? Math.max((totals[index] / maxValue) * 100, 5) : 0,
    }));
  }, [salesData]);

  // ========================================
  // SALES BY PROJECT
  // The API has project_name, not a printing type.
  // ========================================

  const salesByProject = useMemo(() => {
    const totals = {};

    filteredSales.forEach((sale) => {
      const name = sale.project || "Untitled Project";

      if (!totals[name]) {
        totals[name] = {
          name,
          amount: 0,
          count: 0,
        };
      }

      totals[name].amount += sale.amount;
      totals[name].count += 1;
    });

    return Object.values(totals)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [filteredSales]);

  const maxProjectSale = Math.max(
    ...salesByProject.map((item) => item.amount),
    1,
  );

  // ========================================
  // EXPORT REAL DATA TO CSV
  // ========================================

  const handleExport = () => {
    const headers = [
      "Estimate Number",
      "Customer",
      "Project",
      "Date",
      "Total Amount",
      "Received",
      "Pending",
      "Work Stage",
      "Payment Status",
    ];

    const rows = filteredSales.map((sale) => [
      sale.displayId,
      sale.customer,
      sale.project,
      formatDate(sale.date),
      sale.amount,
      sale.paid,
      sale.balance,
      sale.workStage,
      sale.status,
    ]);

    const escapeCsvValue = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "printtech-sales-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ========================================
  // STATS
  // ========================================

  const stats = [
    {
      title: "Total Sales",
      value: formatCurrency(totalSales),
      description: "Total value of filtered orders",
      icon: FaMoneyBillWave,
      iconStyle: "bg-orange-50 text-orange-500 dark:bg-orange-500/10",
    },
    {
      title: "Received",
      value: formatCurrency(totalReceived),
      description: "Amount recorded as received",
      icon: FiCheckCircle,
      iconStyle: "bg-green-50 text-green-600 dark:bg-green-500/10",
    },
    {
      title: "Pending",
      value: formatCurrency(totalPending),
      description: "Outstanding balance on orders",
      icon: FiClock,
      iconStyle: "bg-red-50 text-red-500 dark:bg-red-500/10",
    },
    {
      title: "Total Orders",
      value: filteredSales.length.toLocaleString("en-IN"),
      description: "Orders matching your filters",
      icon: FiFileText,
      iconStyle: "bg-blue-50 text-blue-500 dark:bg-blue-500/10",
    },
  ];

  // ========================================
  // JSX
  // ========================================

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white px-5 py-5 dark:border-slate-700 dark:bg-slate-800 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-orange-500" />

              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Reports
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Sales Report
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track your printing business sales and revenue.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={loading || filteredSales.length === 0}
            className="flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiDownload size={17} />
            Export Report
          </button>
        </div>
      </header>

      <main className="p-5 md:p-8">
        {/* LOADING */}

        {loading && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-orange-100 bg-white p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            Loading sales data...
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Unable to load sales report
            </p>

            <p className="mt-1 break-words text-sm text-red-600 dark:text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-semibold text-red-700 underline dark:text-red-400"
            >
              Try again
            </button>
          </div>
        )}

        {/* FILTERS */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search customer, project or estimate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:bg-slate-700"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {!loading && !error && (
            <p className="mt-3 text-xs text-slate-400">
              Showing {filteredSales.length} of {salesData.length} orders
            </p>
          )}
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {stat.title}
                    </p>

                    <h3 className="mt-2 break-words text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
                      {loading ? "—" : stat.value}
                    </h3>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CHARTS */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* MONTHLY SALES */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                Monthly Sales
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Actual order totals for {new Date().getFullYear()}
              </p>
            </div>

            <div className="mt-8 flex h-56 items-end gap-2 sm:gap-3">
              {monthlySales.map((item) => (
                <div
                  key={item.month}
                  className="group relative flex h-full min-w-0 flex-1 items-end"
                  title={`${item.month}: ${formatCurrency(item.amount)}`}
                >
                  <div
                    style={{ height: `${item.height}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      item.amount > 0
                        ? "bg-orange-400 group-hover:bg-orange-500"
                        : "bg-slate-100 dark:bg-slate-700"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-[10px] text-slate-400 sm:text-[11px]">
              {monthlySales.map((item) => (
                <span key={item.month}>{item.month}</span>
              ))}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-700">
              <p className="text-xs text-slate-400">Total sales this year</p>

              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrency(
                  monthlySales.reduce((sum, item) => sum + item.amount, 0),
                )}
              </p>
            </div>
          </div>

          {/* SALES BY PROJECT */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Sales by Project
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Highest-value projects matching the selected filters
            </p>

            <div className="mt-6 space-y-5">
              {salesByProject.length > 0 ? (
                salesByProject.map((item) => (
                  <div key={item.name}>
                    <div className="mb-2 flex justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                          {item.name}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {item.count} {item.count === 1 ? "order" : "orders"}
                        </span>
                      </div>

                      <span className="shrink-0 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        style={{
                          width: `${(item.amount / maxProjectSale) * 100}%`,
                        }}
                        className="h-2 rounded-full bg-orange-400 transition-all"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <FiFileText className="mx-auto text-2xl text-slate-300" />

                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    No project sales found for these filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SALES TRANSACTIONS */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 p-6 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Sales Transactions
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Real project-wise sales and payment details
            </p>
          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left dark:border-slate-700">
                  {[
                    "Project",
                    "Customer",
                    "Work Stage",
                    "Date",
                    "Sale",
                    "Received",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-xs uppercase text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700"
                  >
                    <td
                      className="cursor-pointer px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      onClick={() => navigate(`/projects/${sale.id}`)}
                    >
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {sale.project}
                      </p>

                      <p className="mt-1 text-xs text-orange-500">
                        {sale.displayId}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {sale.customer}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getWorkStageStyle(
                          sale.workStage,
                        )}`}
                      >
                        {String(sale.workStage).replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(sale.date)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(sale.amount)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(sale.paid)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          sale.status,
                        )}`}
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}

          <div className="space-y-3 p-4 md:hidden">
            {filteredSales.map((sale) => (
              <div
                key={sale.id}
                onClick={() => navigate(`/projects/${sale.id}`)}
                className="cursor-pointer rounded-xl border border-slate-200 p-4 transition hover:border-orange-300 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {sale.project}
                    </p>

                    <p className="mt-1 text-xs text-orange-500">
                      {sale.displayId}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                      sale.status,
                    )}`}
                  >
                    {sale.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-400">Customer</p>

                    <p className="mt-1 break-words text-sm font-medium text-slate-700 dark:text-slate-300">
                      {sale.customer}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Date</p>

                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {formatDate(sale.date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Sale</p>

                    <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatCurrency(sale.amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Received</p>

                    <p className="mt-1 text-sm font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(sale.paid)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Pending</p>

                    <p className="mt-1 text-sm font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(sale.balance)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Work Stage</p>

                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[11px] text-slate-400">Work Stage</p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getWorkStageStyle(
                            sale.workStage,
                          )}`}
                        >
                          {String(sale.workStage).replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* NO RESULTS */}

          {!loading && !error && filteredSales.length === 0 && (
            <div className="p-10 text-center">
              <FiSearch className="mx-auto text-2xl text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-300">
                No sales transactions found.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search, period or status filter.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SalesReport;
