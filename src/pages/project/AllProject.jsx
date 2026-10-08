import React, { useEffect, useMemo, useState } from "react";
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
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../modal/DeleteModal";
import { getProjects, deleteProject } from "../../api/project";

const AllProject = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [projects, setProjects] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // GET PROJECTS
  // =====================================================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();

        console.log("Projects API response:", response);

        if (Array.isArray(response)) {
          setProjects(response);
        } else if (Array.isArray(response?.results)) {
          setProjects(response.results);
        } else if (Array.isArray(response?.data)) {
          setProjects(response.data);
        } else if (Array.isArray(response?.data?.results)) {
          setProjects(response.data.results);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Get projects error:", error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;

    try {
      setDeleteLoading(true);

      await deleteProject(selectedProject.id);

      setProjects((previousProjects) =>
        previousProjects.filter((project) => project.id !== selectedProject.id),
      );

      setDeleteModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Delete project error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteClose = () => {
    if (deleteLoading) return;

    setDeleteModalOpen(false);
    setSelectedProject(null);
  };

  // =====================================================
  // EDIT PROJECT
  // =====================================================

  const handleEditProject = (project) => {
    navigate(`/projects/edit/${project.id}`);
  };

  // =====================================================
  // VIEW PROJECT
  // =====================================================

  const handleViewProject = (project) => {
    navigate(`/projects/${project.id}`);
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const dateOnly = String(date).split("T")[0];

    const [year, month, day] = dateOnly.split("-");

    if (!year || !month || !day) return "-";

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

  // =====================================================
  // DATE INPUT VALUE
  // =====================================================

  const getDateInputValue = (date) => {
    if (!date) return "";

    return String(date).split("T")[0];
  };

  // =====================================================
  // UPDATE DATE
  // =====================================================

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

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    switch (normalizedStatus) {
      case "completed":
        return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      case "printed":
        return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

      case "pending":
        return "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredProjects = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return projects.filter((project) => {
      const projectName = String(project?.name || "").toLowerCase();
      const customerName = String(project?.customer || "").toLowerCase();
      const projectId = String(project?.id || "").toLowerCase();
      const projectStatus = String(project?.status || "").toLowerCase();

      const matchesSearch =
        projectName.includes(searchValue) ||
        customerName.includes(searchValue) ||
        projectId.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || projectStatus === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  // =====================================================
  // PROJECT SUMMARY DATA
  // =====================================================

  const totalProjects = projects.length;

  const pendingProjects = projects.filter(
    (project) => String(project?.status || "").toLowerCase() === "pending",
  ).length;

  const printedProjects = projects.filter(
    (project) => String(project?.status || "").toLowerCase() === "printed",
  ).length;

  const completedProjects = projects.filter(
    (project) => String(project?.status || "").toLowerCase() === "completed",
  ).length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fa] text-slate-800 dark:bg-slate-700 dark:text-slate-200">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700">
        <div className="flex min-h-20 flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              All Projects
            </h2>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Manage and track your printing projects
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/projects/create-project")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 sm:w-auto"
          >
            <FiPlus size={18} />
            New Project
          </button>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="p-4 sm:p-5 md:p-6">
        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {/* Total */}

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Total Projects
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-200 sm:mt-2 sm:text-2xl">
                  {totalProjects}
                </h3>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 sm:h-11 sm:w-11 sm:rounded-xl">
                <FiFileText size={19} />
              </div>
            </div>
          </div>

          {/* Pending */}

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Pending
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-200 sm:mt-2 sm:text-2xl">
                  {pendingProjects}
                </h3>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 sm:h-11 sm:w-11 sm:rounded-xl">
                <FiClock size={19} />
              </div>
            </div>
          </div>

          {/* Printed */}

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Printed
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-200 sm:mt-2 sm:text-2xl">
                  {printedProjects}
                </h3>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10 sm:h-11 sm:w-11 sm:rounded-xl">
                <FiPrinter size={19} />
              </div>
            </div>
          </div>

          {/* Completed */}

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Completed
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-200 sm:mt-2 sm:text-2xl">
                  {completedProjects}
                </h3>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-500 dark:bg-green-500/10 sm:h-11 sm:w-11 sm:rounded-xl">
                <FiCheckCircle size={19} />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SEARCH + FILTER
        ====================================================== */}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search project, customer or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-orange-500/10"
              />
            </div>

            <div className="flex w-full items-center gap-2 lg:w-auto">
              <span className="shrink-0 text-sm text-slate-500 dark:text-slate-400">
                Status:
              </span>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:px-4 lg:w-40 lg:flex-none"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Printed">Printed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* =====================================================
            PROJECT CONTAINER
        ====================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl">
          <div className="border-b border-slate-200 p-4 dark:border-slate-600 sm:p-6">
            <h3 className="font-bold text-slate-900 dark:text-white">
              All Projects
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {filteredProjects.length} projects found
            </p>
          </div>

          {/* =====================================================
              DESKTOP TABLE
          ====================================================== */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-100 text-left dark:border-slate-700">
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
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700"
                  >
                    {/* Project */}

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleViewProject(project)}
                        className="flex items-center gap-3 text-left"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                          <FiFileText size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800 transition hover:text-orange-500 dark:text-slate-200">
                            {project.name || "Unnamed Project"}
                          </p>

                          <p className="mt-1 text-xs text-orange-500">
                            {project.id}
                          </p>
                        </div>
                      </button>
                    </td>

                    {/* Customer */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-200">
                          {project.customer
                            ? String(project.customer).charAt(0).toUpperCase()
                            : "C"}
                        </div>

                        <span className="whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">
                          {project.customer || "-"}
                        </span>
                      </div>
                    </td>

                    {/* Date */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(project.date)}
                        </span>

                        <label className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-slate-700">
                          <FiCalendar size={17} />

                          <input
                            type="date"
                            value={getDateInputValue(project.date)}
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

                    {/* Due Date */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap text-sm font-medium text-orange-600 dark:text-orange-400">
                          {formatDate(project.dueDate)}
                        </span>

                        <label className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-orange-400 transition hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10">
                          <FiCalendar size={17} />

                          <input
                            type="date"
                            value={getDateInputValue(project.dueDate)}
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

                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {project.amount ?? "-"}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          project.status,
                        )}`}
                      >
                        {project.status || "Unknown"}
                      </span>
                    </td>

                    {/* Action */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="Edit project"
                          onClick={() => handleEditProject(project)}
                          className="rounded-lg p-2 text-yellow-600 transition hover:bg-yellow-100 hover:text-yellow-700 dark:hover:bg-yellow-500/10"
                        >
                          <FaEdit size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete project"
                          onClick={() => handleDeleteClick(project)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-500/10"
                        >
                          <MdDelete size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =====================================================
              MOBILE PROJECT CARDS
          ====================================================== */}

          <div className="space-y-3 p-3 sm:p-4 md:hidden">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition dark:border-slate-600 dark:bg-slate-800"
              >
                {/* Project Header */}

                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleViewProject(project)}
                    className="flex min-w-0 items-center gap-3 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                      <FiFileText size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {project.name || "Unnamed Project"}
                      </p>

                      <p className="mt-1 text-xs text-orange-500">
                        {project.id}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    aria-label="Project actions"
                    onClick={() => handleEditProject(project)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <FiMoreVertical size={18} />
                  </button>
                </div>

                {/* Divider */}

                <div className="my-4 border-t border-slate-100 dark:border-slate-700" />

                {/* Project Information */}

                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  {/* Customer */}

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Customer
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                      {project.customer || "-"}
                    </p>
                  </div>

                  {/* Amount */}

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Amount
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                      {project.amount ?? "-"}
                    </p>
                  </div>

                  {/* Date */}

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Date
                    </p>

                    <div className="mt-1 flex min-w-0 items-center gap-1">
                      <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                        {formatDate(project.date)}
                      </span>

                      <label className="relative flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-slate-700">
                        <FiCalendar size={16} />

                        <input
                          type="date"
                          value={getDateInputValue(project.date)}
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

                  {/* Due Date */}

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Due Date
                    </p>

                    <div className="mt-1 flex min-w-0 items-center gap-1">
                      <span className="truncate text-sm font-medium text-orange-600 dark:text-orange-400">
                        {formatDate(project.dueDate)}
                      </span>

                      <label className="relative flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-orange-400 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10">
                        <FiCalendar size={16} />

                        <input
                          type="date"
                          value={getDateInputValue(project.dueDate)}
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
                </div>

                {/* Status */}

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                  <span className="text-xs font-medium text-slate-400">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${getStatusStyle(
                      project.status,
                    )}`}
                  >
                    {project.status || "Unknown"}
                  </span>
                </div>

                {/* Mobile Actions */}

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditProject(project)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-yellow-600 transition hover:bg-yellow-50 dark:border-slate-600 dark:hover:bg-yellow-500/10"
                  >
                    <FaEdit size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(project)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-slate-600 dark:hover:bg-red-500/10"
                  >
                    <MdDelete size={17} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* =====================================================
              EMPTY STATE
          ====================================================== */}

          {filteredProjects.length === 0 && (
            <div className="px-5 py-12 text-center sm:py-16">
              <FiFileText
                size={35}
                className="mx-auto text-slate-300 dark:text-slate-600"
              />

              <h3 className="mt-3 font-semibold text-slate-700 dark:text-slate-200">
                No projects found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {projects.length === 0
                  ? "You have not created any projects yet."
                  : "Try changing your search or status filter."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        itemName={
          selectedProject
            ? `${selectedProject.name || "Project"} • ${selectedProject.id}`
            : ""
        }
        loading={deleteLoading}
      />
    </div>
  );
};

export default AllProject;
