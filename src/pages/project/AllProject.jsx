import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiMoreVertical,
  FiCalendar,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiPrinter,
  FiLoader,
} from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteModal from "../../modal/DeleteModal";
import { getProjects, deleteProject, getItems } from "../../api/project";
import toast from "react-hot-toast";

const AllProject = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --------------------------------------------------
  // NORMALIZE API RESPONSE
  // --------------------------------------------------

  const normalizeList = useCallback((response) => {
    const data = response?.data?.data ?? response?.data ?? response;

    console.log("========== PROJECT API RESPONSE ==========");
    console.log("Full API response:", response);
    console.log("Extracted response body:", data);

    let orders = [];

    if (Array.isArray(data)) {
      orders = data;
    } else if (Array.isArray(data?.orders)) {
      orders = data.orders;
    } else if (Array.isArray(data?.results)) {
      orders = data.results;
    } else if (Array.isArray(data?.projects)) {
      orders = data.projects;
    } else if (Array.isArray(data?.data)) {
      orders = data.data;
    } else if (Array.isArray(data?.current_order)) {
      orders = data.current_order;
    }

    console.log("Number of orders:", orders.length);

    console.table(
      orders.map((order) => ({
        id: order.id,
        slip_no: order.slip_no,
        project_name: order.project_name,
        work_stage: order.work_stage,
        work_status: order.work_status,
        status: order.status,
        total_amount: order.total_amount,
        balance: order.balance,
        paid_amount: order.paid_amount,
      })),
    );

    console.log("==========================================");

    return orders;
  }, []);

  const normalizeItems = useCallback((response) => {
    const data = response?.data?.data ?? response?.data ?? response;

    let list = [];

    if (Array.isArray(data)) {
      list = data;
    } else if (Array.isArray(data?.results)) {
      list = data.results;
    } else if (Array.isArray(data?.items)) {
      list = data.items;
    } else if (Array.isArray(data?.data)) {
      list = data.data;
    }

    return list;
  }, []);

  // --------------------------------------------------
  // NORMALIZE STATUS
  // --------------------------------------------------

  const normalizeStatus = useCallback((status) => {
    if (status === null || status === undefined || status === "") {
      return "";
    }

    const value = String(status)
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");

    if (["complete", "completed", "done"].includes(value)) {
      return "completed";
    }

    if (["print", "printed"].includes(value)) {
      return "printed";
    }

    if (["pending", "waiting"].includes(value)) {
      return "pending";
    }

    if (["inprogress", "in_progress", "processing"].includes(value)) {
      return "in_progress";
    }

    return value;
  }, []);

  const formatStatus = useCallback(
    (status) => {
      const value = normalizeStatus(status);

      if (!value) return "Pending";

      return value
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    [normalizeStatus],
  );

  // --------------------------------------------------
  // DERIVE ORDER STATUS FROM ITS SLIP ITEMS
  // --------------------------------------------------

  const getItemStatusesForOrder = useCallback(
    (orderId) => {
      if (orderId == null) return null;

      const related = items.filter(
        (it) => String(it.order ?? it.order_id) === String(orderId),
      );

      if (related.length === 0) return null;

      const allStages = related.flatMap((it) => [
        it.designing_status,
        it.printing_status,
        it.binding_status,
      ]);

      const total = allStages.length;
      const completed = allStages.filter((s) => s === "completed").length;
      const inProgress = allStages.filter((s) => s === "in_progress").length;

      if (total > 0 && completed === total) return "completed";
      if (completed > 0 || inProgress > 0) return "printed";
      return "pending";
    },
    [items],
  );

  useEffect(() => {
    console.log("=== STATUS DEBUG v2 ===");
    console.log("items loaded:", items.length);

    console.log("--- RAW ITEMS ---");
    items.forEach((it) => {
      console.log({
        id: it.id,
        order_raw: it.order,
        order_type: typeof it.order,
        order_id: it.order_id,
        designing_status: it.designing_status,
        printing_status: it.printing_status,
        binding_status: it.binding_status,
      });
    });

    console.log("--- ORDERS ---");
    projects.forEach((p) => {
      console.log({
        slip_no: p.slip_no,
        order_id: p.id,
        derived: getItemStatusesForOrder(p.id),
        raw_work_stage: p.work_stage,
      });
    });
  }, [items, projects, getItemStatusesForOrder]);
  // --------------------------------------------------
  // READ PROJECT STATUS
  // --------------------------------------------------

  const readProjectStatus = useCallback(
    (project) => {
      const derived = getItemStatusesForOrder(project?.id);

      if (derived) return normalizeStatus(derived);

      return normalizeStatus(
        project?.work_stage ??
          project?.current_order?.work_stage ??
          project?.work_status ??
          project?.current_order?.work_status ??
          project?.workStatus ??
          project?.current_order?.workStatus ??
          project?.status ??
          project?.current_order?.status,
      );
    },
    [getItemStatusesForOrder, normalizeStatus],
  );

  const getProjectStatus = useCallback(
    (project) => {
      return formatStatus(readProjectStatus(project) || "pending");
    },
    [formatStatus, readProjectStatus],
  );

  // --------------------------------------------------
  // PROJECT NAME
  // --------------------------------------------------

  const getProjectName = useCallback((project) => {
    return (
      project?.project_name ||
      project?.name ||
      `Project #${project?.slip_no ?? "-"}`
    );
  }, []);

  // --------------------------------------------------
  // CUSTOMER NAME
  // --------------------------------------------------

  const getCustomerName = useCallback((project) => {
    return (
      project?.customer_details?.name ||
      project?.customer?.name ||
      project?.customer_name ||
      "No customer"
    );
  }, []);

  // --------------------------------------------------
  // TOTAL AMOUNT
  // --------------------------------------------------

  const getTotalAmount = useCallback((project) => {
    const value =
      project?.total_amount ??
      project?.current_order?.total_amount ??
      project?.order?.total_amount ??
      project?.grand_total ??
      project?.amount ??
      project?.current_order?.amount;

    if (value === null || value === undefined || value === "") {
      return 0;
    }

    const amount = Number(value);

    return Number.isFinite(amount) ? amount : 0;
  }, []);

  // --------------------------------------------------
  // PENDING AMOUNT
  // --------------------------------------------------

  const getPendingAmount = useCallback(
    (project) => {
      const balance =
        project?.balance ??
        project?.current_order?.balance ??
        project?.order?.balance ??
        project?.pending_amount ??
        project?.current_order?.pending_amount;

      if (balance !== null && balance !== undefined && balance !== "") {
        const numericBalance = Number(balance);

        return Number.isFinite(numericBalance)
          ? Math.max(0, numericBalance)
          : 0;
      }

      const total = getTotalAmount(project);

      const paidValue =
        project?.paid_amount ??
        project?.current_order?.paid_amount ??
        project?.order?.paid_amount ??
        0;

      const paidAmount = Number(paidValue) || 0;

      return Math.max(0, total - paidAmount);
    },
    [getTotalAmount],
  );

  const formatAmount = (amount) => {
    return `Rs. ${(Number(amount) || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // --------------------------------------------------
  // FETCH PROJECTS + ITEMS
  // --------------------------------------------------

  const fetchProjects = useCallback(async () => {
    const response = await getProjects();
    const orders = normalizeList(response);

    setProjects(orders);

    return orders;
  }, [normalizeList]);

  const fetchItems = useCallback(async () => {
    try {
      const response = await getItems();
      const list = normalizeItems(response);
      setItems(list);
      return list;
    } catch (error) {
      // Items are used only for deriving the correct order status.
      // If this call fails, we still want the list to render.
      console.warn("Could not load slip items for status derivation:", error);
      setItems([]);
      return [];
    }
  }, [normalizeItems]);

  // --------------------------------------------------
  // INITIAL PAGE LOAD
  // --------------------------------------------------

  const loadPageData = useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all([fetchProjects(), fetchItems()]);
    } catch (error) {
      console.error("Failed to load projects:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });

      toast.error("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, [fetchProjects, fetchItems]);

  // Refetch on every navigation to /projects.
  useEffect(() => {
    loadPageData();
  }, [loadPageData, location.key]);

  // --------------------------------------------------
  // STATUS STYLING
  // --------------------------------------------------

  const getStatusStyle = (status) => {
    const normalized = normalizeStatus(status);

    switch (normalized) {
      case "completed":
        return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      case "printed":
        return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

      case "pending":
        return "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

      case "in_progress":
        return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";

      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  // --------------------------------------------------
  // EDIT PROJECT
  // --------------------------------------------------

  const handleEditProject = (project) => {
    if (!project?.id) {
      toast.error("Unable to edit this project: project ID is missing.");
      return;
    }

    navigate(`/projects/create-project?edit=${project.id}`);
  };

  // --------------------------------------------------
  // DELETE PROJECT
  // --------------------------------------------------

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    if (deleteLoading) return;

    setDeleteModalOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject?.id || deleteLoading) return;

    try {
      setDeleteLoading(true);

      await deleteProject(selectedProject.id);

      setProjects((previous) =>
        previous.filter(
          (project) => String(project.id) !== String(selectedProject.id),
        ),
      );

      setDeleteModalOpen(false);
      setSelectedProject(null);

      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Delete project error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to delete project. Please try again.";

      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // --------------------------------------------------
  // DATE HELPERS
  // --------------------------------------------------

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

    const monthIndex = Number(month) - 1;

    if (monthIndex < 0 || monthIndex > 11) return "-";

    return `${day} ${months[monthIndex]} ${year}`;
  };

  const getDateInputValue = (date) => {
    if (!date) return "";
    return String(date).split("T")[0];
  };

  const updateProjectDate = (projectId, field, newDate) => {
    setProjects((previous) =>
      previous.map((project) =>
        String(project.id) === String(projectId)
          ? { ...project, [field]: newDate }
          : project,
      ),
    );
  };

  // --------------------------------------------------
  // SEARCH AND FILTER
  // --------------------------------------------------

  const filteredProjects = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return projects.filter((project) => {
      const projectName = getProjectName(project).toLowerCase();
      const customerName = getCustomerName(project).toLowerCase();
      const projectId = String(project?.id ?? "").toLowerCase();
      const slipNo = String(project?.slip_no ?? "").toLowerCase();
      const projectStatus = getProjectStatus(project).toLowerCase();

      const matchesSearch =
        projectName.includes(searchValue) ||
        customerName.includes(searchValue) ||
        projectId.includes(searchValue) ||
        slipNo.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || projectStatus === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [
    projects,
    search,
    statusFilter,
    getProjectName,
    getCustomerName,
    getProjectStatus,
  ]);

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------

  const totalProjects = projects.length;

  const pendingProjects = projects.filter(
    (project) => getProjectStatus(project) === "Pending",
  ).length;

  const printedProjects = projects.filter(
    (project) => getProjectStatus(project) === "Printed",
  ).length;

  const completedProjects = projects.filter(
    (project) => getProjectStatus(project) === "Completed",
  ).length;

  const totalAmount = projects.reduce(
    (total, project) => total + getTotalAmount(project),
    0,
  );

  const pendingAmount = projects.reduce(
    (total, project) => total + getPendingAmount(project),
    0,
  );

  // --------------------------------------------------
  // PROJECT TITLE
  // --------------------------------------------------

  const ProjectTitle = ({ project }) => (
    <button
      type="button"
      onClick={() => navigate(`/projects/${project.id}`)}
      className="flex min-w-0 items-center gap-3 text-left"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
        <FiFileText size={18} />
      </div>

      <div className="min-w-0">
        <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800 transition hover:text-orange-500 dark:text-slate-200">
          {getProjectName(project)}
        </p>

        <p className="mt-1 text-xs text-orange-500">
          Slip #{project.slip_no ?? "-"}
        </p>
      </div>
    </button>
  );

  // --------------------------------------------------
  // DATE FIELD
  // --------------------------------------------------

  const DateField = ({ project, field, labelColor = "default" }) => (
    <div className="flex items-center gap-2">
      <span
        className={`whitespace-nowrap text-sm ${
          labelColor === "orange"
            ? "font-medium text-orange-600 dark:text-orange-400"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {formatDate(project[field])}
      </span>

      <label
        className={`relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition ${
          labelColor === "orange"
            ? "text-orange-400 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10"
            : "text-slate-400 hover:bg-slate-100 hover:text-orange-500 dark:hover:bg-slate-700"
        }`}
        title={`Change ${field === "slip_date" ? "project date" : "due date"}`}
      >
        <FiCalendar size={17} />

        <input
          type="date"
          value={getDateInputValue(project[field])}
          onChange={(event) =>
            updateProjectDate(project.id, field, event.target.value)
          }
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fa] text-slate-800 dark:bg-slate-700 dark:text-slate-200">
      {/* HEADER */}
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

      <main className="p-4 sm:p-5 md:p-6">
        {/* SUMMARY CARDS */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {[
            {
              label: "Total Projects",
              value: totalProjects,
              icon: <FiFileText size={19} />,
              iconClass: "bg-orange-50 text-orange-500 dark:bg-orange-500/10",
            },
            {
              label: "Pending",
              value: pendingProjects,
              icon: <FiClock size={19} />,
              iconClass: "bg-orange-50 text-orange-500 dark:bg-orange-500/10",
            },
            {
              label: "Printed",
              value: printedProjects,
              icon: <FiPrinter size={19} />,
              iconClass: "bg-blue-50 text-blue-500 dark:bg-blue-500/10",
            },
            {
              label: "Completed",
              value: completedProjects,
              icon: <FiCheckCircle size={19} />,
              iconClass: "bg-green-50 text-green-500 dark:bg-green-500/10",
            },
            {
              label: "Total Amount",
              value: formatAmount(totalAmount),
              icon: <FiFileText size={19} />,
              iconClass: "bg-purple-50 text-purple-500 dark:bg-purple-500/10",
            },
            {
              label: "Pending Amount",
              value: formatAmount(pendingAmount),
              icon: <FiClock size={19} />,
              iconClass: "bg-orange-50 text-orange-500 dark:bg-orange-500/10",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    {item.label}
                  </p>

                  <h3 className="mt-1 break-words text-xl font-bold text-slate-900 dark:text-slate-200 sm:mt-2 sm:text-2xl">
                    {item.value}
                  </h3>
                </div>

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 sm:rounded-xl ${item.iconClass}`}
                >
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH AND FILTER */}
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
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-orange-500/10"
              />
            </div>

            <div className="flex w-full items-center gap-2 lg:w-auto">
              <span className="shrink-0 text-sm text-slate-500 dark:text-slate-400">
                Status:
              </span>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
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

        {/* PROJECT LIST */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl">
          <div className="border-b border-slate-200 p-4 dark:border-slate-600 sm:p-6">
            <h3 className="font-bold text-slate-900 dark:text-white">
              All Projects
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {loading
                ? "Loading projects..."
                : `${filteredProjects.length} projects found`}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
              <FiLoader className="animate-spin" size={18} />
              Loading projects...
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-left dark:border-slate-700">
                      {[
                        "Project",
                        "Customer",
                        "Date",
                        "Due Date",
                        "Total Amount",
                        "Pending Amount",
                        "Work Status",
                        "Action",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-4 text-xs font-semibold uppercase text-slate-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProjects.map((project) => {
                      const status = getProjectStatus(project);

                      return (
                        <tr
                          key={project.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700"
                        >
                          <td className="px-6 py-4">
                            <ProjectTitle project={project} />
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-200">
                                {getCustomerName(project)
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <span className="whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">
                                {getCustomerName(project)}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <DateField project={project} field="slip_date" />
                          </td>

                          <td className="px-6 py-4">
                            <DateField
                              project={project}
                              field="delivery_date"
                              labelColor="orange"
                            />
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {formatAmount(getTotalAmount(project))}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                              {formatAmount(getPendingAmount(project))}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(status)}`}
                            >
                              {status}
                            </span>
                          </td>

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
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="space-y-3 p-3 sm:p-4 md:hidden">
                {filteredProjects.map((project) => {
                  const status = getProjectStatus(project);

                  return (
                    <div
                      key={project.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition dark:border-slate-600 dark:bg-slate-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <ProjectTitle project={project} />

                        <button
                          type="button"
                          aria-label="Edit project"
                          title="Edit project"
                          onClick={() => handleEditProject(project)}
                          className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <FiMoreVertical size={18} />
                        </button>
                      </div>

                      <div className="my-4 border-t border-slate-100 dark:border-slate-700" />

                      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Customer
                          </p>

                          <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                            {getCustomerName(project)}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Total Amount
                          </p>

                          <p className="mt-1 break-words text-sm font-bold text-slate-800 dark:text-slate-100">
                            {formatAmount(getTotalAmount(project))}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Pending Amount
                          </p>

                          <p className="mt-1 break-words text-sm font-bold text-orange-600 dark:text-orange-400">
                            {formatAmount(getPendingAmount(project))}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Date
                          </p>

                          <DateField project={project} field="slip_date" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Due Date
                          </p>

                          <DateField
                            project={project}
                            field="delivery_date"
                            labelColor="orange"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                        <span className="text-xs font-medium text-slate-400">
                          Status
                        </span>

                        <span
                          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${getStatusStyle(status)}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditProject(project)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-yellow-600 transition hover:bg-yellow-50 dark:border-slate-600 dark:hover:bg-yellow-500/10"
                        >
                          <FaEdit size={14} />
                          Edit Project
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
                  );
                })}
              </div>

              {/* EMPTY STATE */}
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
            </>
          )}
        </div>
      </main>

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        itemName={
          selectedProject
            ? `${getProjectName(selectedProject)} • Slip #${selectedProject.slip_no ?? "-"}`
            : ""
        }
        loading={deleteLoading}
      />
    </div>
  );
};

export default AllProject;
