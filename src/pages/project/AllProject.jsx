import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiMoreVertical,
  FiCalendar,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiPrinter,
} from "react-icons/fi";

const AllProject = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Projects
  // Date format: YYYY-MM-DD
  const [projects, setProjects] = useState([
    {
      id: "PRJ-1001",
      name: "Business Card Printing",
      customer: "Ram Sharma",
      date: "2026-09-07",
      dueDate: "2026-09-10",
      amount: "Rs. 12,500",
      status: "Completed",
    },
    {
      id: "PRJ-1002",
      name: "Wedding Invitation Cards",
      customer: "Sita Karki",
      date: "2026-09-07",
      dueDate: "2026-09-15",
      amount: "Rs. 18,750",
      status: "Pending",
    },
    {
      id: "PRJ-1003",
      name: "Restaurant Menu Printing",
      customer: "Hari Thapa",
      date: "2026-09-06",
      dueDate: "2026-09-12",
      amount: "Rs. 24,300",
      status: "Printed",
    },
    {
      id: "PRJ-1004",
      name: "Flex Banner Design",
      customer: "Aashish Gurung",
      date: "2026-09-06",
      dueDate: "2026-09-11",
      amount: "Rs. 5,600",
      status: "Pending",
    },
    {
      id: "PRJ-1005",
      name: "Company Brochure",
      customer: "Mina Rai",
      date: "2026-09-05",
      dueDate: "2026-09-14",
      amount: "Rs. 18,900",
      status: "Completed",
    },
    {
      id: "PRJ-1006",
      name: "Product Label Printing",
      customer: "Everest Traders",
      date: "2026-09-04",
      dueDate: "2026-09-13",
      amount: "Rs. 32,500",
      status: "Printed",
    },
    {
      id: "PRJ-1007",
      name: "Office Letterhead",
      customer: "ABC Enterprises",
      date: "2026-09-03",
      dueDate: "2026-09-09",
      amount: "Rs. 7,800",
      status: "Pending",
    },
    {
      id: "PRJ-1008",
      name: "Promotional Posters",
      customer: "New Star Hotel",
      date: "2026-09-02",
      dueDate: "2026-09-08",
      amount: "Rs. 15,400",
      status: "Completed",
    },
  ]);

  // -----------------------------
  // Date ko readable format mein convert karega
  // 2026-09-07 -> 07 Sep 2026
  // -----------------------------
  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

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

    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  // -----------------------------
  // Date update function
  // -----------------------------
  const updateProjectDate = (projectId, field, newDate) => {
    setProjects((previousProjects) =>
      previousProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              [field]: newDate,
            }
          : project,
      ),
    );
  };

  // -----------------------------
  // Status Style
  // -----------------------------
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700";

      case "Printed":
        return "bg-blue-50 text-blue-700";

      case "Pending":
        return "bg-orange-50 text-orange-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // -----------------------------
  // Search + Status Filter
  // -----------------------------
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.customer.toLowerCase().includes(search.toLowerCase()) ||
      project.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-700">
      {/* ================= HEADER ================= */}

      <header className=" top-0 z-30 flex h-20 items-center justify-between border-slate-200 bg-white/95 dark:bg-slate-700 px-5 backdrop-blur md:px-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            All Projects
          </h2>
        </div>

        <a
          href="/projects/create-project"
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <FiPlus size={18} />
          New Project
        </a>
      </header>

      {/* ================= MAIN CONTENT ================= */}

      <div className="p-5 md:p-5">
        {/* ================= SUMMARY CARDS ================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Projects</p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-200">
                  248
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FiFileText size={21} />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-200">
                  32
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FiClock size={21} />
              </div>
            </div>
          </div>

          {/* Printed */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Printed</p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-200">
                  64
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <FiPrinter size={21} />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-200">
                  152
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-500">
                <FiCheckCircle size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SEARCH + FILTER ================= */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="text"
                placeholder="Search project, customer or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-700 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400"
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Status:</span>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-400"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Printed">Printed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= PROJECT TABLE ================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-slate-800">
          {/* Table Header */}
          <div className="flex flex-col justify-between gap-2 border-b border-slate-200 p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                All Projects
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                {filteredProjects.length} projects found
              </p>
            </div>
          </div>

          {/* ================= DESKTOP TABLE ================= */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                    Project
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                    Due Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    {/* Project */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50  text-orange-500">
                          <FiFileText size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {project.name}
                          </p>

                          <p className="mt-1 text-xs text-orange-500">
                            {project.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-400  text-xs font-bold text-slate-600">
                          {project.customer.charAt(0)}
                        </div>

                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          {project.customer}
                        </span>
                      </div>
                    </td>

                    {/* ================= DATE ================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Date Text */}
                        <span className="text-sm text-slate-500">
                          {formatDate(project.date)}
                        </span>

                        {/* Calendar Icon */}
                        <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-orange-500">
                          <FiCalendar size={17} />

                          {/* Invisible input sitting ON TOP of icon */}
                          <input
                            type="date"
                            value={project.date}
                            onChange={(e) =>
                              updateProjectDate(
                                project.id,
                                "date",
                                e.target.value,
                              )
                            }
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                        </label>
                      </div>
                    </td>

                    {/* ================= DUE DATE ================= */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Due Date Text */}
                        <span className="text-sm font-medium text-orange-600">
                          {formatDate(project.dueDate)}
                        </span>

                        {/* Calendar Icon */}
                        <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-orange-400 transition hover:bg-orange-50 hover:text-orange-600">
                          <FiCalendar size={17} />

                          {/* Invisible input sitting ON TOP of icon */}
                          <input
                            type="date"
                            value={project.dueDate}
                            onChange={(e) =>
                              updateProjectDate(
                                project.id,
                                "dueDate",
                                e.target.value,
                              )
                            }
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                        </label>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {project.amount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          project.status,
                        )}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <FiMoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}

          <div className="space-y-3 p-4 md:hidden">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                      <FiFileText size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{project.name}</p>

                      <p className="mt-1 text-xs text-orange-500">
                        {project.id}
                      </p>
                    </div>
                  </div>

                  <button className="text-slate-400">
                    <FiMoreVertical />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  {/* Customer */}
                  <div>
                    <p className="text-[11px] text-slate-400">Customer</p>

                    <p className="mt-1 text-sm font-medium">
                      {project.customer}
                    </p>
                  </div>

                  {/* ================= MOBILE DATE ================= */}

                  <div>
                    <p className="text-[11px] text-slate-400">Date</p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatDate(project.date)}
                      </span>

                      <label className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-orange-500">
                        <FiCalendar size={16} />

                        <input
                          type="date"
                          value={project.date}
                          onChange={(e) =>
                            updateProjectDate(
                              project.id,
                              "date",
                              e.target.value,
                            )
                          }
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </label>
                    </div>
                  </div>

                  {/* ================= MOBILE DUE DATE ================= */}

                  <div>
                    <p className="text-[11px] text-slate-400">Due Date</p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-orange-600">
                        {formatDate(project.dueDate)}
                      </span>

                      <label className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-orange-400 hover:bg-orange-50 hover:text-orange-600">
                        <FiCalendar size={16} />

                        <input
                          type="date"
                          value={project.dueDate}
                          onChange={(e) =>
                            updateProjectDate(
                              project.id,
                              "dueDate",
                              e.target.value,
                            )
                          }
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-[11px] text-slate-400">Amount</p>

                    <p className="mt-1 text-sm font-bold">{project.amount}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-[11px] text-slate-400">Status</p>

                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                        project.status,
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= EMPTY STATE ================= */}

          {filteredProjects.length === 0 && (
            <div className="p-12 text-center">
              <FiFileText size={35} className="mx-auto text-slate-300" />

              <h3 className="mt-3 font-semibold text-slate-700">
                No projects found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or status filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProject;
