
import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FiFileText,
  FiUsers,
  FiPrinter,
  FiDollarSign,
  FiPlus,
  FiClock,
} from "react-icons/fi";

const HomePage = () => {
  const navigate = useNavigate();

  // ================= STATS DATA =================

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

  // ================= ESTIMATES DATA =================

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

  // ================= REVENUE GRAPH DATA =================

  const revenueData = [
    { month: "Jan", height: 45, color: "bg-orange-400" },
    { month: "Feb", height: 65, color: "bg-blue-400" },
    { month: "Mar", height: 52, color: "bg-green-400" },
    { month: "Apr", height: 75, color: "bg-purple-400" },
    { month: "May", height: 60, color: "bg-pink-400" },
    { month: "Jun", height: 88, color: "bg-cyan-400" },
    { month: "Jul", height: 72, color: "bg-yellow-400" },
    { month: "Aug", height: 95, color: "bg-red-400" },
    { month: "Sep", height: 80, color: "bg-indigo-400" },
    { month: "Oct", height: 90, color: "bg-emerald-400" },
    { month: "Nov", height: 70, color: "bg-violet-400" },
    { month: "Dec", height: 100, color: "bg-orange-500" },
  ];

  // ================= STATUS STYLE =================

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

  // ================= QUICK ACTIONS =================

  const quickActions = [
    {
      title: "New Project",
      description: "Create customer estimate Bill",
      icon: FiPlus,
      iconStyle: "bg-orange-100 text-orange-600",
      hoverStyle:
        "hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-500/10",
      onClick: () => navigate("/projects/create-project"),
    },
    {
      title: "Add Customer",
      description: "Register a new customer",
      icon: FiUsers,
      iconStyle: "bg-blue-50 text-blue-600",
      hoverStyle:
        "hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-500/10",
      onClick: () => navigate("/customers/add"),
    },
    {
      title: "Print Estimate",
      description: "Print pending estimates",
      icon: FiPrinter,
      iconStyle: "bg-green-50 text-green-600",
      hoverStyle:
        "hover:border-green-200 hover:bg-green-50 dark:hover:bg-green-500/10",
      onClick: undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <main>
        <div className="p-5 md:p-8">

          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {stat.title}
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {stat.value}
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-slate-700">
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

            {/* ================= REVENUE OVERVIEW ================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">
                    Revenue Overview
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Monthly revenue performance
                  </p>
                </div>

                <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  <option>Last 6 Months</option>
                  <option>Last 12 Months</option>
                </select>
              </div>

              {/* ================= BAR CHART ================= */}

              <div className="mt-8 flex h-56 items-end gap-3">
                {revenueData.map((item, index) => (
                  <div
                    key={index}
                    className="group flex h-full flex-1 items-end"
                  >
                    <div
                      style={{
                        height: `${item.height}%`,
                      }}
                      className={`w-full rounded-t-lg ${item.color} transition-all duration-300 group-hover:scale-y-105 group-hover:brightness-95`}
                    />
                  </div>
                ))}
              </div>

              {/* ================= MONTH LABELS ================= */}

              <div className="mt-3 flex justify-between text-[11px] text-slate-400">
                {revenueData.map((item) => (
                  <span key={item.month}>
                    {item.month}
                  </span>
                ))}
              </div>
            </div>

            {/* ================= QUICK ACTIONS ================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Quick Actions
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Frequently used actions
              </p>

              <div className="mt-5 space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={action.onClick}
                      disabled={!action.onClick}
                      className={`flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition dark:border-slate-700 ${action.hoverStyle} ${
                        !action.onClick
                          ? "cursor-not-allowed opacity-70"
                          : "cursor-pointer"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.iconStyle}`}
                      >
                        <Icon />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {action.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RECENT ESTIMATES ================= */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-6 dark:border-slate-700 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Recent Estimates
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Latest customer estimates and bills
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="text-sm font-semibold text-orange-500 transition hover:text-orange-600"
              >
                View All
              </button>
            </div>

            {/* ================= DESKTOP TABLE ================= */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left dark:border-slate-700">
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
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-orange-600">
                          {estimate.id}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                            {estimate.customer.charAt(0)}
                          </div>

                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {estimate.customer}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {estimate.date}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {estimate.amount}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            estimate.status
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

            {/* ================= MOBILE CARDS ================= */}

            <div className="space-y-3 p-4 md:hidden">
              {estimates.map((estimate) => (
                <div
                  key={estimate.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-orange-600">
                      {estimate.id}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                        estimate.status
                      )}`}
                    >
                      {estimate.status}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {estimate.customer}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {estimate.date}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {estimate.amount}
                    </p>
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