import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FiFileText,
  FiUsers,
  FiPrinter,
  FiPlus,
  FiClock,
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiAlertCircle,
  FiBriefcase,
  FiUserPlus,
} from "react-icons/fi";

import { FaMoneyBillWave, FaWhatsapp } from "react-icons/fa";
import { MdPeopleOutline } from "react-icons/md";

const HomePage = () => {
  const navigate = useNavigate();

  // =====================================================
  // MAIN STATS
  // =====================================================

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
      title: "New Customers",
      value: "428",
      change: "+2.3%",
      icon: MdPeopleOutline,
    },
    {
      title: "Total Revenue",
      value: "Rs. 8,42,500",
      change: "+15.8%",
      icon: FaMoneyBillWave,
    },
  ];

  // =====================================================
  // TODAY SUMMARY
  // =====================================================

  const todaySummary = [
    {
      title: "Today's Sales",
      value: "Rs. 24,500",
      icon: FaMoneyBillWave,
    },
    {
      title: "Today's Estimates",
      value: "12",
      icon: FiFileText,
    },
    {
      title: "Payments Received",
      value: "Rs. 18,200",
      icon: FiCreditCard,
    },
    {
      title: "Pending Amount",
      value: "Rs. 6,300",
      icon: FiAlertCircle,
    },
  ];

  // =====================================================
  // REVENUE DATA
  // =====================================================

  const revenueData = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 58 },
    { month: "Mar", value: 52 },
    { month: "Apr", value: 68 },
    { month: "May", value: 61 },
    { month: "Jun", value: 76 },
    { month: "Jul", value: 70 },
    { month: "Aug", value: 88 },
    { month: "Sep", value: 78 },
    { month: "Oct", value: 91 },
    { month: "Nov", value: 82 },
    { month: "Dec", value: 96 },
  ];

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const orderStatus = [
    {
      name: "Pending",
      count: 24,
      bar: "bg-orange-400",
      text: "text-orange-600 dark:text-orange-400",
    },
    {
      name: "In Progress",
      count: 18,
      bar: "bg-blue-400",
      text: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Ready",
      count: 9,
      bar: "bg-green-400",
      text: "text-green-600 dark:text-green-400",
    },
    {
      name: "Delivered",
      count: 42,
      bar: "bg-slate-500",
      text: "text-slate-600 dark:text-slate-300",
    },
  ];

  // =====================================================
  // PAYMENT DATA
  // =====================================================

  const paymentData = [
    {
      title: "Collected",
      value: "Rs. 8,42,500",
      percentage: 68,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: "Rs. 1,24,800",
      percentage: 22,
      color: "bg-orange-500",
    },
    {
      title: "Advance",
      value: "Rs. 2,15,000",
      percentage: 10,
      color: "bg-blue-500",
    },
  ];

  // =====================================================
  // WORK DUE TODAY
  // =====================================================

  const dueToday = [
    {
      id: "EST-10248",
      project: "Business Card",
      customer: "Ram Sharma",
      time: "3:00 PM",
      status: "Printing",
    },
    {
      id: "EST-10249",
      project: "Wedding Card",
      customer: "Sita Karki",
      time: "4:30 PM",
      status: "Design",
    },
    {
      id: "EST-10251",
      project: "Flex Banner",
      customer: "Hari Thapa",
      time: "6:00 PM",
      status: "Ready",
    },
  ];

  // =====================================================
  // RECENT ESTIMATES
  // =====================================================

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

  // =====================================================
  // RECENT PAYMENTS
  // =====================================================

  const recentPayments = [
    {
      customer: "Ram Sharma",
      amount: "Rs. 5,000",
      method: "Cash",
      date: "Today",
    },
    {
      customer: "Sita Karki",
      amount: "Rs. 3,500",
      method: "eSewa",
      date: "Today",
    },
    {
      customer: "Hari Thapa",
      amount: "Rs. 8,000",
      method: "Bank",
      date: "Yesterday",
    },
    {
      customer: "Aashish Gurung",
      amount: "Rs. 2,000",
      method: "Cash",
      date: "Yesterday",
    },
  ];

  // =====================================================
  // STAFF ACTIVITY
  // =====================================================

  const staffActivity = [
    {
      text: "Ram completed EST-10245",
      time: "10 min ago",
    },
    {
      text: "Sita added a new customer",
      time: "25 min ago",
    },
    {
      text: "Hari marked EST-10241 as Printed",
      time: "42 min ago",
    },
    {
      text: "Aashish received Rs. 5,000 payment",
      time: "1 hour ago",
    },
  ];

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

  const quickActions = [
    {
      title: "New Project",
      description: "Create customer estimate",
      icon: FiPlus,
      iconStyle:
        "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
      hoverStyle:
        "hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-500/10",
      onClick: () => navigate("/projects/create-project"),
    },
    {
      title: "Add Customer",
      description: "Register a new customer",
      icon: FiUsers,
      iconStyle:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      hoverStyle:
        "hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-500/10",
      onClick: () => navigate("/customers/add"),
    },
    {
      title: "Print Estimate",
      description: "Print pending estimates",
      icon: FiPrinter,
      iconStyle:
        "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
      hoverStyle:
        "hover:border-green-200 hover:bg-green-50 dark:hover:bg-green-500/10",
      onClick: () => navigate("/projects/create-project"),
    },
  ];

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      case "Printed":
        return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

      case "Pending":
        return "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

      case "Printing":
        return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

      case "Design":
        return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";

      case "Ready":
        return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <main>
        <div className="px-3 py-5 sm:px-5 md:p-8">
          {/* =====================================================
              HEADER
          ====================================================== */}
          <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Overview of your printing business.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/projects/create-project")}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-orange-500
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-orange-600
                sm:w-auto
              "
            >
              <FiPlus size={17} />
              New Project
            </button>
          </div>
          {/* =====================================================
              MAIN STATS
          ====================================================== */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className="
                    min-w-0
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    transition
                    hover:border-slate-300
                    sm:rounded-2xl
                    sm:p-5
                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:hover:border-slate-700
                  "
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                        {stat.title}
                      </p>

                      <h3 className="mt-2 truncate text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
                        {stat.value}
                      </h3>
                    </div>

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-orange-50
                        text-orange-500
                        sm:h-11
                        sm:w-11
                        sm:rounded-xl
                        dark:bg-orange-500/10
                      "
                    >
                      <Icon size={18} />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-green-600 dark:text-green-400 sm:text-xs">
                      {stat.change}
                    </span>

                    <span className="text-[10px] text-slate-400 sm:text-xs">
                      vs last month
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* =====================================================
              TODAY SUMMARY
          ====================================================== */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 sm:rounded-2xl sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Today's Summary
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Your business activity for today
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {todaySummary.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="
                      rounded-lg
                      border
                      border-slate-100
                      bg-slate-50
                      p-3
                      sm:p-4
                      dark:border-slate-800
                      dark:bg-slate-800/50
                    "
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
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          {/* ================= REVENUE OVERVIEW ================= */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Revenue Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Monthly revenue performance
                </p>
              </div>

              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                2026
              </span>
            </div>

            {/* Chart */}
            <div className="flex h-80 items-end gap-3 overflow-x-auto px-2 sm:gap-4">
              {[
                { month: "Jan", value: 320, color: "bg-orange-500" },
                { month: "Feb", value: 410, color: "bg-blue-500" },
                { month: "Mar", value: 380, color: "bg-emerald-500" },
                { month: "Apr", value: 520, color: "bg-purple-500" },
                { month: "May", value: 460, color: "bg-pink-500" },
                { month: "Jun", value: 610, color: "bg-cyan-500" },
                { month: "Jul", value: 570, color: "bg-yellow-500" },
                { month: "Aug", value: 680, color: "bg-indigo-500" },
                { month: "Sep", value: 620, color: "bg-rose-500" },
                { month: "Oct", value: 740, color: "bg-teal-500" },
                { month: "Nov", value: 690, color: "bg-violet-500" },
                { month: "Dec", value: 820, color: "bg-orange-600" },
              ].map((item) => {
                const maxValue = 820;

                // Give every bar a minimum height
                const height = Math.max((item.value / maxValue) * 100, 15);

                return (
                  <div
                    key={item.month}
                    className="group flex h-full min-w-[42px] flex-1 flex-col items-center justify-end"
                  >
                    {/* Value */}
                    <div className="mb-2 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-md transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 dark:bg-white dark:text-slate-900">
                      Rs. {item.value}K
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full max-w-[52px] rounded-t-lg ${item.color} transition-all duration-300 group-hover:scale-x-105 group-hover:brightness-110`}
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    {/* Month */}
                    <span className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Summary */}
            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Highest Revenue
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  Rs. 8,20,000
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current Month
                </p>

                <p className="mt-1 text-lg font-bold text-orange-500">
                  Rs. 6,90,000
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              ORDER STATUS + PAYMENT OVERVIEW
          ====================================================== */}
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* ORDER STATUS */}

            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                sm:rounded-2xl
                sm:p-6
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
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
                {orderStatus.map((item) => (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {item.name}
                      </span>

                      <span className={`text-xs font-bold ${item.text}`}>
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full ${item.bar}`}
                        style={{
                          width: `${Math.min(item.count * 2, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAYMENT OVERVIEW */}

            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                sm:rounded-2xl
                sm:p-6
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Payment Overview
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Current payment position
                </p>
              </div>

              {/* PAYMENT BAR */}

              <div className="mt-6">
                <div className="flex h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  {paymentData.map((item) => (
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
                {paymentData.map((item) => (
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
                        {item.value}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {item.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* =====================================================
              WORK DUE TODAY
          ====================================================== */}
          <div
            className="
              mt-5
              overflow-hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              sm:rounded-2xl
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                border-b
                border-slate-200
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:p-6
                dark:border-slate-800
              "
            >
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Work Due Today
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Projects that need attention today
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
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Estimate
                    </th>

                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Project
                    </th>

                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Due
                    </th>

                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dueToday.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4 text-xs font-semibold text-orange-600 dark:text-orange-400">
                        {item.id}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {item.project}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {item.customer}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {item.time}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* =====================================================
              RECENT ESTIMATES + RECENT PAYMENTS
          ====================================================== */}
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            {/* RECENT ESTIMATES */}

            <div
              className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                sm:rounded-2xl
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-slate-200
                  p-4
                  sm:p-6
                  dark:border-slate-800
                "
              >
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Recent Estimates
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Latest customer estimates
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
                {estimates.slice(0, 5).map((estimate) => (
                  <div
                    key={estimate.id}
                    className="flex items-center gap-3 p-4 transition hover:bg-slate-50 sm:px-6 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      {estimate.customer.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {estimate.customer}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {estimate.id} • {estimate.date}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="whitespace-nowrap text-xs font-bold text-slate-700 dark:text-slate-200">
                        {estimate.amount}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${getStatusStyle(
                          estimate.status,
                        )}`}
                      >
                        {estimate.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT PAYMENTS */}

            <div
              className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                sm:rounded-2xl
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-6 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Recent Payments
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Latest received payments
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
                {recentPayments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 sm:px-6"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                      <FiCheckCircle size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {payment.customer}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {payment.method} • {payment.date}
                      </p>
                    </div>

                    <p className="whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                      {payment.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* =====================================================
              STAFF ACTIVITY
          ====================================================== */}
          <div
            className="
              mt-5
              rounded-xl
              border
              border-slate-200
              bg-white
              p-4
              sm:rounded-2xl
              sm:p-6
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Staff Activity
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Recent activity from your team
                </p>
              </div>

              <FiUsers className="text-slate-300 dark:text-slate-600" />
            </div>

            <div className="mt-5 space-y-5">
              {staffActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="relative flex w-5 justify-center">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-500" />

                    {index !== staffActivity.length - 1 && (
                      <span className="absolute top-4 h-full w-px bg-slate-200 dark:bg-slate-800" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {activity.text}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* =====================================================
          FLOATING WHATSAPP
      ====================================================== */}

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
        <FaWhatsapp size={26} />

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
  );
};

export default HomePage;
