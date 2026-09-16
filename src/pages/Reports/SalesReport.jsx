import React, { useMemo, useState } from "react";
import {
  FiDollarSign,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiPrinter,
  FiTrendingUp,
  FiCalendar,
  FiDownload,
} from "react-icons/fi";

const SalesReport = () => {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This Month");
  const [statusFilter, setStatusFilter] = useState("All");

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

  // ------------------------------------
  // Total Sales
  // ------------------------------------

  const totalSales = salesData.reduce(
    (total, sale) => total + sale.amount,
    0
  );

  const totalReceived = salesData.reduce(
    (total, sale) => total + sale.paid,
    0
  );

  const totalPending = totalSales - totalReceived;

  // ------------------------------------
  // Status Style
  // ------------------------------------

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-700";

      case "Partial":
        return "bg-orange-50 text-orange-700";

      case "Pending":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ------------------------------------
  // Filter
  // ------------------------------------

  const filteredSales = useMemo(() => {
    return salesData.filter((sale) => {
      const matchesSearch =
        sale.customer.toLowerCase().includes(search.toLowerCase()) ||
        sale.project.toLowerCase().includes(search.toLowerCase()) ||
        sale.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || sale.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  // ------------------------------------
  // Printing Type Sales
  // ------------------------------------

  const printingTypes = [
    {
      name: "Labels",
      amount: 32500,
    },
    {
      name: "Menu",
      amount: 24300,
    },
    {
      name: "Brochure",
      amount: 18900,
    },
    {
      name: "Wedding Card",
      amount: 18750,
    },
    {
      name: "Poster",
      amount: 15400,
    },
    {
      name: "Business Card",
      amount: 12500,
    },
  ];

  const maxPrintingSale = Math.max(
    ...printingTypes.map((item) => item.amount)
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800">
      {/* Header */}

      <header className="border-b border-slate-200 bg-white px-5 py-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-orange-500" />

              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Reports
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Sales Report
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your printing business sales and revenue.
            </p>
          </div>

          <button className="flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
            <FiDownload size={17} />
            Export Report
          </button>
        </div>
      </header>

      <main className="p-5 md:p-8">
        {/* Filters */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Sales</p>

                <h3 className="mt-2 text-2xl font-bold">
                  Rs. {totalSales.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FiDollarSign size={21} />
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold text-green-600">
              +15.8% vs last month
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Received</p>

                <h3 className="mt-2 text-2xl font-bold">
                  Rs. {totalReceived.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FiCheckCircle size={21} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Amount collected
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>

                <h3 className="mt-2 text-2xl font-bold">
                  Rs. {totalPending.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FiClock size={21} />
              </div>
            </div>

            <p className="mt-3 text-xs text-red-500">
              Amount to collect
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Orders</p>

                <h3 className="mt-2 text-2xl font-bold">
                  {salesData.length}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <FiFileText size={21} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Printing projects
            </p>
          </div>
        </div>

        {/* Charts */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Monthly Sales */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div>
              <h3 className="font-bold text-slate-900">
                Monthly Sales
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Revenue performance
              </p>
            </div>

            <div className="mt-8 flex h-56 items-end gap-3">
              {[45, 55, 42, 65, 58, 72, 63, 82, 70, 88, 76, 95].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group flex h-full flex-1 items-end"
                  >
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full rounded-t-lg bg-orange-400 transition group-hover:bg-orange-500"
                    />
                  </div>
                )
              )}
            </div>

            <div className="mt-3 flex justify-between text-[11px] text-slate-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Sales By Printing Type */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-bold text-slate-900">
              Sales by Printing Type
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Which printing services generate more revenue
            </p>

            <div className="mt-6 space-y-5">
              {printingTypes.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex justify-between">
                    <span className="text-sm font-medium">
                      {item.name}
                    </span>

                    <span className="text-sm font-semibold">
                      Rs. {item.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      style={{
                        width: `${(item.amount / maxPrintingSale) * 100}%`,
                      }}
                      className="h-2 rounded-full bg-orange-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Table */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <h3 className="font-bold text-slate-900">
              Sales Transactions
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Project-wise sales details
            </p>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left">
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
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">
                        {sale.project}
                      </p>

                      <p className="mt-1 text-xs text-orange-500">
                        {sale.id}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {sale.customer}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {sale.type}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {sale.date}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold">
                      Rs. {sale.amount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      Rs. {sale.paid.toLocaleString()}
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

          {/* Mobile */}

          <div className="space-y-3 p-4 md:hidden">
            {filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      {sale.project}
                    </p>

                    <p className="mt-1 text-xs text-orange-500">
                      {sale.id}
                    </p>
                  </div>

                  <span
                    className={`h-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
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

                    <p className="mt-1 text-sm font-medium">
                      {sale.customer}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Date
                    </p>

                    <p className="mt-1 text-sm">
                      {sale.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Sale
                    </p>

                    <p className="mt-1 text-sm font-bold">
                      Rs. {sale.amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Received
                    </p>

                    <p className="mt-1 text-sm font-bold text-green-600">
                      Rs. {sale.paid.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesReport;