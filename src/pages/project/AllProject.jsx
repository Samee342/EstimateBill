import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiMoreVertical,
  FiCalendar,
  FiUser,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiPrinter,
} from "react-icons/fi";

const AllProject = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const projects = [
    {
      id: "PRJ-1001",
      name: "Business Card Printing",
      customer: "Ram Sharma",
      date: "07 Sep 2026",
      amount: "Rs. 12,500",
      status: "Completed",
    },
    {
      id: "PRJ-1002",
      name: "Wedding Invitation Cards",
      customer: "Sita Karki",
      date: "07 Sep 2026",
      amount: "Rs. 18,750",
      status: "Pending",
    },
    {
      id: "PRJ-1003",
      name: "Restaurant Menu Printing",
      customer: "Hari Thapa",
      date: "06 Sep 2026",
      amount: "Rs. 24,300",
      status: "Printed",
    },
    {
      id: "PRJ-1004",
      name: "Flex Banner Design",
      customer: "Aashish Gurung",
      date: "06 Sep 2026",
      amount: "Rs. 5,600",
      status: "Pending",
    },
    {
      id: "PRJ-1005",
      name: "Company Brochure",
      customer: "Mina Rai",
      date: "05 Sep 2026",
      amount: "Rs. 18,900",
      status: "Completed",
    },
    {
      id: "PRJ-1006",
      name: "Product Label Printing",
      customer: "Everest Traders",
      date: "04 Sep 2026",
      amount: "Rs. 32,500",
      status: "Printed",
    },
    {
      id: "PRJ-1007",
      name: "Office Letterhead",
      customer: "ABC Enterprises",
      date: "03 Sep 2026",
      amount: "Rs. 7,800",
      status: "Pending",
    },
    {
      id: "PRJ-1008",
      name: "Promotional Posters",
      customer: "New Star Hotel",
      date: "02 Sep 2026",
      amount: "Rs. 15,400",
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
        return "bg-slate-100 text-slate-600";
    }
  };

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
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">All Projects</h2>

          <p className="mt-1 text-xs text-slate-400">
            Manage all your printing projects
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
          <FiPlus size={18} />
          <a href="/projects/create-project">New Project</a>
        </button>
      </header>

      {/* Main Content */}
      <div className="p-5 md:p-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage all printing projects from one place.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Projects</p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">248</h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FiFileText size={21} />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">32</h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FiClock size={21} />
              </div>
            </div>
          </div>

          {/* Printed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Printed</p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">64</h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <FiPrinter size={21} />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">152</h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-500">
                <FiCheckCircle size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search project, customer or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white"
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Status:</span>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-400"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Printed">Printed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Table Header */}
          <div className="flex flex-col justify-between gap-2 border-b border-slate-200 p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-slate-900">All Projects</h3>

              <p className="mt-1 text-xs text-slate-400">
                {filteredProjects.length} projects found
              </p>
            </div>
          </div>

          {/* Desktop Table */}
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
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    {/* Project */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                          <FiFileText size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
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
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {project.customer.charAt(0)}
                        </div>

                        <span className="text-sm text-slate-700">
                          {project.customer}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FiCalendar size={15} />
                        {project.date}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-800">
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

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 md:hidden">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-slate-200 p-4"
              >
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

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-slate-400">Customer</p>

                    <p className="mt-1 text-sm font-medium">
                      {project.customer}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Date</p>

                    <p className="mt-1 text-sm font-medium">{project.date}</p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Amount</p>

                    <p className="mt-1 text-sm font-bold">{project.amount}</p>
                  </div>

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

          {/* Empty State */}
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
