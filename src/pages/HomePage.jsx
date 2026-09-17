import React from "react";
import {
  FiFileText,
  FiUsers,
  FiPrinter,
  FiDollarSign,
  FiPlus,
  FiClock,
} from "react-icons/fi";

const HomePage = () => {
  const stats = [
    {
      title: "Total Estimates",
      value: "1,248",
      change: "+12.5%",
      icon: FiFileText,
    },
    {
      title: "Pending Estimates",
      value: "86",
      change: "+4.2%",
      icon: FiClock,
    },
    {
      title: "Printed Bills",
      value: "1,105",
      change: "+8.3%",
      icon: FiPrinter,
    },
    {
      title: "Total Revenue",
      value: "Rs. 8,42,500",
      change: "+15.8%",
      icon: FiDollarSign,
    },
  ];

  const estimates = [
    {
      id: "EST-10245",
      customer: "Ram Sharma",
      date: "07 Sep 2026",
      amount: "Rs. 12,500",
      status: "Completed",
    },
    {
      id: "EST-10244",
      customer: "Sita Karki",
      date: "07 Sep 2026",
      amount: "Rs. 8,750",
      status: "Pending",
    },
    {
      id: "EST-10243",
      customer: "Hari Thapa",
      date: "06 Sep 2026",
      amount: "Rs. 24,300",
      status: "Printed",
    },
    {
      id: "EST-10242",
      customer: "Aashish Gurung",
      date: "06 Sep 2026",
      amount: "Rs. 5,600",
      status: "Pending",
    },
    {
      id: "EST-10241",
      customer: "Mina Rai",
      date: "05 Sep 2026",
      amount: "Rs. 18,900",
      status: "Completed",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700";
      case "Printed":
        return "bg-blue-50 text-blue-700";
      case "Pending":
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-700">
      <main>
        {/* Content */}
        <div className="p-5 md:p-8">
          {/* Welcome */}

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-300">
                        {stat.value}
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 dark:bg-slate-200 text-orange-500">
                      <Icon size={21} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-semibold text-green-600">
                      {stat.change}
                    </span>

                    <span className="text-xs text-slate-400">
                      vs last month
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= MIDDLE SECTION ================= */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Revenue Overview */}
            <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-6 xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">
                    Revenue Overview
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Monthly revenue performance
                  </p>
                </div>

                <select className="rounded-lg border border-slate-200 px-3 py-2 text-xs dark:text-slate-300 text-slate-600 outline-none">
                  <option>Last 6 Months</option>
                  <option>Last 12 Months</option>
                </select>
              </div>

              {/* Fake chart */}
              <div className="mt-8 flex h-56 items-end gap-3">
                {[45, 65, 52, 75, 60, 88, 72, 95, 80, 90, 70, 100].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="group flex h-full flex-1 items-end"
                    >
                      <div
                        style={{ height: `${height}%` }}
                        className="w-full rounded-t-lg bg-orange-400 transition group-hover:bg-orange-500"
                      ></div>
                    </div>
                  ),
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

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Quick Actions
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Frequently used actions
              </p>

              <div className="mt-5 space-y-3">
                <button className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-500">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <FiPlus />
                  </div>

                  <div>
                    <p className="text-sm font-semibold dark:text-slate-200">
                      New Project
                    </p>
                    <p className="text-xs text-slate-400">
                      Create customer estimate Bill
                    </p>
                  </div>
                </button>

                <button className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FiUsers />
                  </div>

                  <div>
                    <p className="text-sm font-semibold dark:text-slate-200">
                      Add Customer
                    </p>
                    <p className="text-xs text-slate-400">
                      Register a new customer
                    </p>
                  </div>
                </button>

                <button className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <FiPrinter />
                  </div>

                  <div>
                    <p className="text-sm font-semibold dark:text-slate-200">
                      Print Estimate
                    </p>
                    <p className="text-xs text-slate-400">
                      Print pending estimates
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ================= RECENT ESTIMATES ================= */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Recent Estimates
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Latest customer estimates and bills
                </p>
              </div>

              <button className="text-sm font-semibold text-orange-500 hover:text-orange-600">
                View All
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                      Estimate ID
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {estimates.map((estimate) => (
                    <tr
                      key={estimate.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-orange-600">
                          {estimate.id}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                            {estimate.customer.charAt(0)}
                          </div>

                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {estimate.customer}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {estimate.date}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {estimate.amount}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            estimate.status,
                          )}`}
                        >
                          {estimate.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 p-4 md:hidden">
              {estimates.map((estimate) => (
                <div
                  key={estimate.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-orange-600">
                      {estimate.id}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                        estimate.status,
                      )}`}
                    >
                      {estimate.status}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        {estimate.customer}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {estimate.date}
                      </p>
                    </div>

                    <p className="text-sm font-bold">{estimate.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
