
import React, { useMemo, useState } from "react";
import {
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiSearch,
  FiTrendingUp,
  FiDownload,
  FiClock,
} from "react-icons/fi";

// ========================================
// SALES DATA
// ========================================

const salesData = [
  {
    id: "PRJ-1001",
    customer: "Ram Sharma",
    project: "Business Card Printing",
    type: "Business Card",
    date: "07 Sep 2026",
    amount: 12500,
    paid: 12500,
    status: "Paid",
  },
  {
    id: "PRJ-1002",
    customer: "Sita Karki",
    project: "Wedding Invitation Cards",
    type: "Wedding Card",
    date: "07 Sep 2026",
    amount: 18750,
    paid: 10000,
    status: "Partial",
  },
  {
    id: "PRJ-1003",
    customer: "Hari Thapa",
    project: "Restaurant Menu Printing",
    type: "Menu",
    date: "06 Sep 2026",
    amount: 24300,
    paid: 24300,
    status: "Paid",
  },
  {
    id: "PRJ-1004",
    customer: "Aashish Gurung",
    project: "Flex Banner Design",
    type: "Flex",
    date: "06 Sep 2026",
    amount: 5600,
    paid: 0,
    status: "Pending",
  },
  {
    id: "PRJ-1005",
    customer: "Mina Rai",
    project: "Company Brochure",
    type: "Brochure",
    date: "05 Sep 2026",
    amount: 18900,
    paid: 18900,
    status: "Paid",
  },
  {
    id: "PRJ-1006",
    customer: "Everest Traders",
    project: "Product Label Printing",
    type: "Labels",
    date: "04 Sep 2026",
    amount: 32500,
    paid: 20000,
    status: "Partial",
  },
  {
    id: "PRJ-1007",
    customer: "ABC Enterprises",
    project: "Office Letterhead",
    type: "Letterhead",
    date: "03 Sep 2026",
    amount: 7800,
    paid: 7800,
    status: "Paid",
  },
  {
    id: "PRJ-1008",
    customer: "New Star Hotel",
    project: "Promotional Posters",
    type: "Poster",
    date: "02 Sep 2026",
    amount: 15400,
    paid: 5000,
    status: "Partial",
  },
];

// ========================================
// PRINTING TYPES
// ========================================

const printingTypes = [
  { name: "Labels", amount: 32500 },
  { name: "Menu", amount: 24300 },
  { name: "Brochure", amount: 18900 },
  { name: "Wedding Card", amount: 18750 },
  { name: "Poster", amount: 15400 },
  { name: "Business Card", amount: 12500 },
];

// ========================================
// MONTHLY SALES
// ========================================

const monthlySales = [
  { month: "Jan", height: 45, color: "bg-orange-400" },
  { month: "Feb", height: 55, color: "bg-blue-400" },
  { month: "Mar", height: 42, color: "bg-green-400" },
  { month: "Apr", height: 65, color: "bg-purple-400" },
  { month: "May", height: 58, color: "bg-pink-400" },
  { month: "Jun", height: 72, color: "bg-cyan-400" },
  { month: "Jul", height: 63, color: "bg-yellow-400" },
  { month: "Aug", height: 82, color: "bg-red-400" },
  { month: "Sep", height: 70, color: "bg-indigo-400" },
  { month: "Oct", height: 88, color: "bg-emerald-400" },
  { month: "Nov", height: 76, color: "bg-violet-400" },
  { month: "Dec", height: 95, color: "bg-orange-500" },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

const parseSaleDate = (date) => {
  const [day, month, year] = date.split(" ");

  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  return new Date(Number(year), months[month], Number(day));
};

const formatCurrency = (amount) => {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
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

// ========================================
// SALES REPORT COMPONENT
// ========================================

const SalesReport = () => {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This Month");
  const [statusFilter, setStatusFilter] = useState("All");

  // ========================================
  // FILTER SALES
  // ========================================

  const filteredSales = useMemo(() => {
    const today = new Date(2026, 8, 17);

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return salesData.filter((sale) => {
      const saleDate = parseSaleDate(sale.date);

      const matchesSearch =
        sale.customer.toLowerCase().includes(search.toLowerCase()) ||
        sale.project.toLowerCase().includes(search.toLowerCase()) ||
        sale.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || sale.status === statusFilter;

      let matchesPeriod = true;

      if (period === "This Month") {
        matchesPeriod =
          saleDate.getMonth() === currentMonth &&
          saleDate.getFullYear() === currentYear;
      }

      if (period === "Last Month") {
        const lastMonth = new Date(currentYear, currentMonth - 1, 1);

        matchesPeriod =
          saleDate.getMonth() === lastMonth.getMonth() &&
          saleDate.getFullYear() === lastMonth.getFullYear();
      }

      if (period === "Last 3 Months") {
        const startDate = new Date(currentYear, currentMonth - 2, 1);

        matchesPeriod = saleDate >= startDate && saleDate <= today;
      }

      if (period === "This Year") {
        matchesPeriod = saleDate.getFullYear() === currentYear;
      }

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [search, statusFilter, period]);

  // ========================================
  // TOTALS
  // ========================================

  const totalSales = filteredSales.reduce(
    (total, sale) => total + sale.amount,
    0
  );

  const totalReceived = filteredSales.reduce(
    (total, sale) => total + sale.paid,
    0
  );

  const totalPending = totalSales - totalReceived;

  const maxPrintingSale = Math.max(
    ...printingTypes.map((item) => item.amount)
  );

  // ========================================
  // EXPORT CSV
  // ========================================

  const handleExport = () => {
    const headers = [
      "Project ID",
      "Customer",
      "Project",
      "Type",
      "Date",
      "Sale Amount",
      "Received",
      "Pending",
      "Status",
    ];

    const rows = filteredSales.map((sale) => [
      sale.id,
      sale.customer,
      sale.project,
      sale.type,
      sale.date,
      sale.amount,
      sale.paid,
      sale.amount - sale.paid,
      sale.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "sales-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ========================================
  // REUSABLE STATS
  // ========================================

  const stats = [
    {
      title: "Total Sales",
      value: formatCurrency(totalSales),
      description: "Total sales amount",
      icon: FiDollarSign,
      iconStyle: "bg-orange-50 text-orange-500 dark:bg-orange-500/10",
    },
    {
      title: "Received",
      value: formatCurrency(totalReceived),
      description: "Amount collected",
      icon: FiCheckCircle,
      iconStyle: "bg-green-50 text-green-600 dark:bg-green-500/10",
    },
    {
      title: "Pending",
      value: formatCurrency(totalPending),
      description: "Amount to collect",
      icon: FiClock,
      iconStyle: "bg-red-50 text-red-500 dark:bg-red-500/10",
    },
    {
      title: "Total Orders",
      value: filteredSales.length,
      description: "Printing projects",
      icon: FiFileText,
      iconStyle: "bg-blue-50 text-blue-500 dark:bg-blue-500/10",
    },
  ];

  // ========================================
  // JSX
  // ========================================

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-900 dark:text-slate-100">

      {/* ================= HEADER ================= */}

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
            className="flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <FiDownload size={17} />
            Export Report
          </button>
        </div>
      </header>

      <main className="p-5 md:p-8">

        {/* ================= FILTERS ================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search customer, project or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:bg-slate-700"
              />
            </div>

            {/* PERIOD + STATUS */}

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
        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {stat.title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stat.value}
                    </h3>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ================= CHARTS ================= */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* MONTHLY SALES */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                Monthly Sales
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Revenue performance
              </p>
            </div>

            <div className="mt-8 flex h-56 items-end gap-2 sm:gap-3">
              {monthlySales.map((item) => (
                <div
                  key={item.month}
                  className="group flex h-full min-w-0 flex-1 items-end"
                >
                  <div
                    title={`${item.month}: ${item.height}%`}
                    style={{ height: `${item.height}%` }}
                    className={`w-full rounded-t-lg ${item.color} transition-all duration-300 group-hover:brightness-95`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-[10px] text-slate-400 sm:text-[11px]">
              {monthlySales.map((item) => (
                <span key={item.month}>{item.month}</span>
              ))}
            </div>
          </div>

          {/* SALES BY PRINTING TYPE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Sales by Printing Type
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Which printing services generate more revenue
            </p>

            <div className="mt-6 space-y-5">
              {printingTypes.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex justify-between gap-3">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.name}
                    </span>

                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      style={{
                        width: `${(item.amount / maxPrintingSale) * 100}%`,
                      }}
                      className="h-2 rounded-full bg-orange-400 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= SALES TRANSACTIONS ================= */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">

          {/* TABLE HEADER */}

          <div className="border-b border-slate-200 p-6 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Sales Transactions
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Project-wise sales details
            </p>
          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left dark:border-slate-700">
                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Project
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Sale
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Received
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {sale.project}
                      </p>

                      <p className="mt-1 text-xs text-orange-500">
                        {sale.id}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {sale.customer}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {sale.type}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {sale.date}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(sale.amount)}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      {formatCurrency(sale.paid)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          sale.status
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
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {sale.project}
                    </p>

                    <p className="mt-1 text-xs text-orange-500">
                      {sale.id}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                      sale.status
                    )}`}
                  >
                    {sale.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-400">
                      Customer
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {sale.customer}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Date
                    </p>

                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {sale.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Sale
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatCurrency(sale.amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Received
                    </p>

                    <p className="mt-1 text-sm font-bold text-green-600">
                      {formatCurrency(sale.paid)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* NO RESULTS */}

          {filteredSales.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
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