import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiFileText,
  FiMapPin,
  FiPrinter,
  FiTrash2,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import { FaMoneyBillWave } from "react-icons/fa";
import { getProjects, deleteProject, getItems } from "../../api/project";

// ======================================================
// HELPERS
// ======================================================

const getRecords = (response) => {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.slip_items)) return data.slip_items;
  if (Array.isArray(data?.data)) return data.data;

  if (Array.isArray(data?.data?.results)) return data.data.results;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data?.slip_items)) {
    return data.data.slip_items;
  }

  return [];
};

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(String(date)) ? `${date}T00:00:00` : date,
  );

  if (Number.isNaN(parsedDate.getTime())) return String(date);

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPaymentStatus = (paid, balance) => {
  if (balance <= 0 && paid > 0) return "Paid";
  if (paid > 0) return "Partial";
  return "Pending";
};

const getStatusStyle = (status) => {
  const value = String(status || "").toLowerCase();

  if (["completed", "delivered", "finished"].includes(value)) {
    return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
  }

  if (["printed", "printing"].includes(value)) {
    return "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
  }

  return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
};
const getStaffName = (staff, details) => {
  // Prefer the staff details returned by the API.
  const person =
    details || (typeof staff === "object" && staff !== null ? staff : null);

  if (person) {
    return (
      person.full_name ||
      person.name ||
      person.username ||
      [person.first_name, person.last_name].filter(Boolean).join(" ") ||
      (person.id ? `Staff #${person.id}` : "Not assigned")
    );
  }

  if (staff === null || staff === undefined || staff === "") {
    return "Not assigned";
  }

  return `Staff #${staff}`;
};

const getOrderId = (item) => {
  const order = item?.order;

  if (order && typeof order === "object") {
    return order.id ?? order.uuid ?? order.pk ?? "";
  }

  return order ?? "";
};

const normalizeItem = (item) => ({
  ...item,

  item_description:
    item.item_description ||
    item.description ||
    item.name ||
    item.item_name ||
    "",

  quantity: item.quantity ?? item.qty ?? 0,

  paper_type: item.paper_type || item.paperType || "",

  maso: item.maso || item.ink || item.color || "",

  subtotal:
    item.subtotal ??
    item.total ??
    item.total_amount ??
    item.amount ??
    Number(item.quantity ?? item.qty ?? 0) * Number(item.rate ?? 0),
});

const getProjectDetails = (project, fetchedItems = []) => {
  const totalAmount = Number(project.total_amount ?? 0);
  const paidAmount = Number(project.paid_amount ?? 0);

  const balance =
    project.balance !== undefined && project.balance !== null
      ? Number(project.balance)
      : Math.max(totalAmount - paidAmount, 0);

  const customer = project.customer_details || {};

  // Prefer items returned by the separate items API.
  // Fall back to nested items from the project response.
  const nestedItems = Array.isArray(project.slip_items)
    ? project.slip_items
    : Array.isArray(project.items)
      ? project.items
      : [];

  const rawItems = fetchedItems.length > 0 ? fetchedItems : nestedItems;

  return {
    ...project,

    name: project.project_name || "Untitled Project",

    estimateNo: `EST-${project.slip_no ?? "-"}`,

    customer: {
      name:
        customer.name ||
        project.customer_name ||
        "Customer information unavailable",

      phone: customer.contact_no || customer.phone || project.contact_no || "-",

      address: customer.address || project.customer_address || "-",

      pan:
        customer.pan_no ||
        customer.pan ||
        project.pan_no ||
        project.customer_pan ||
        "-",
    },

    date: project.slip_date || project.created_at || "",

    dueDate: project.delivery_date || "",

    priority: project.priority || "normal",

    status: project.work_stage || "pending",

    totalAmount,

    advance: paidAmount,

    remaining: Math.max(balance, 0),

    paymentStatus: getPaymentStatus(paidAmount, balance),

    items: rawItems.map(normalizeItem),

    description:
      project.print_details_full || project.description || project.notes || "",
  };
};

// ======================================================
// SMALL COMPONENTS
// ======================================================

const InfoItem = ({ label, value }) => (
  <div>
    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
      {label}
    </p>

    <p className="break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
      {value || "-"}
    </p>
  </div>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="mb-5 flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
      <Icon size={17} />
    </div>

    <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
      {title}
    </h2>
  </div>
);

// ======================================================
// PAGE
// ======================================================

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        // Load project records.
        const projectsResponse = await getProjects();
        const records = getRecords(projectsResponse);

        console.log("Projects API response:", projectsResponse);

        const found = records.find(
          (item) =>
            String(item.id).toLowerCase() === String(id).toLowerCase() ||
            String(item.slip_no) === String(id),
        );

        if (!active) return;

        if (!found) {
          setProject(null);
          return;
        }

        console.log("Selected project:", found);
        console.log("Customer details:", found.customer_details);
        console.log("Project description:", found.print_details_full);

        // Load items using your existing items API.
        let matchingItems = [];

        try {
          // Pass the project ID in case your API helper accepts an order ID.
          const itemsResponse = await getItems(found.id);

          if (!active) return;

          const allItems = getRecords(itemsResponse);

          console.log("Items API response:", itemsResponse);

          // If the endpoint returns order IDs, filter to this project.
          const itemsWithOrder = allItems.filter(
            (item) => getOrderId(item) !== "",
          );

          if (itemsWithOrder.length > 0) {
            matchingItems = itemsWithOrder.filter(
              (item) =>
                String(getOrderId(item)).toLowerCase() ===
                String(found.id).toLowerCase(),
            );
          } else {
            // Some item endpoints may already return only this order's items.
            matchingItems = allItems;
          }

          console.log("Items matched to project:", matchingItems);
        } catch (itemsError) {
          console.error("Failed to fetch project items:", itemsError);

          // Use nested items if the separate endpoint fails.
          matchingItems = [];
        }

        if (!active) return;

        const normalizedProject = getProjectDetails(found, matchingItems);

        setProject(normalizedProject);
      } catch (err) {
        if (!active) return;

        console.error("Failed to fetch project details:", err);

        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Unable to load project details. Please try again.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProject();

    return () => {
      active = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!project?.id || deleting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteProject(project.id);

      navigate("/projects", {
        replace: true,
        state: {
          message: "Project deleted successfully.",
        },
      });
    } catch (err) {
      console.error("Failed to delete project:", err);

      window.alert(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to delete project. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-slate-900">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Could Not Load Project
            </h1>

            <p className="mt-3 text-sm text-red-500">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // NOT FOUND
  // ====================================================

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-500 dark:text-slate-400"
          >
            <FiArrowLeft size={17} />
            Back to Projects
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <FiFileText size={28} className="mx-auto mb-4 text-orange-500" />

            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Project Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No project was found with ID {id}.
            </p>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const customerName = project.customer.name;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* TOP BAR */}

        <div className="mb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <FiFileText size={22} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {project.name}
                  </h1>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(project.status)}`}
                  >
                    {String(project.status).replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span>Slip #{project.slip_no ?? "-"}</span>

                  <span className="text-slate-300 dark:text-slate-700">•</span>

                  <span>{project.estimateNo}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20 sm:w-auto"
              >
                <FiTrash2 size={16} />
                {deleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Amount
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(project.totalAmount)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Advance Paid
            </p>

            <p className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(project.advance)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Remaining
            </p>

            <p className="mt-2 text-xl font-bold text-orange-500">
              {formatCurrency(project.remaining)}
            </p>
          </div>
        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* CUSTOMER INFORMATION */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiUser} title="Customer Information" />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoItem label="Customer Name" value={customerName} />

                <InfoItem label="Phone" value={project.customer.phone} />

                <InfoItem label="Address" value={project.customer.address} />

                <InfoItem label="PAN / VAT" value={project.customer.pan} />
              </div>

              {project.customer.address !== "-" && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                    <FiMapPin size={14} />
                    {project.customer.address}
                  </div>
                </div>
              )}
            </section>

            {/* PROJECT INFORMATION */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiCalendar} title="Project Information" />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <InfoItem label="Estimate No." value={project.estimateNo} />

                <InfoItem
                  label="Project Date"
                  value={formatDate(project.date)}
                />

                <InfoItem
                  label="Due Date"
                  value={formatDate(project.dueDate)}
                />

                <InfoItem label="Priority" value={project.priority} />

                <InfoItem
                  label="Work Stage"
                  value={String(project.status).replaceAll("_", " ")}
                />

                <InfoItem label="Payment" value={project.paymentStatus} />
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {project.description ||
                    "No description available for this project."}
                </p>
              </div>
            </section>
            {/* PRINTING ITEMS */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiPrinter} title="Printing Items" />

              {project.items.length > 0 ? (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Item Details
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {project.items.length} printing{" "}
                        {project.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <span className="rounded-md bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      {project.items.length} Items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {project.items.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-orange-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/40"
                      >
                        {/* Item Header */}
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                            <FiPrinter size={17} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="break-words text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {item.item_description || "-"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {item.work_type || "Printing"}
                            </p>
                          </div>
                        </div>

                        {/* Item Information Grid */}
                        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                          <div>
                            <p className="text-xs text-slate-400">Quantity</p>
                            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                              {item.quantity ?? "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">Size</p>
                            <p className="mt-1 break-words text-sm font-medium text-slate-700 dark:text-slate-200">
                              {item.size || "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">Paper Type</p>
                            <p className="mt-1 break-words text-sm font-medium text-slate-700 dark:text-slate-200">
                              {item.paper_type || "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">Ink / Maso</p>
                            <p className="mt-1 break-words text-sm font-medium text-slate-700 dark:text-slate-200">
                              {item.maso || "-"}
                            </p>
                          </div>

                          {item.band_type && (
                            <div className="col-span-2">
                              <p className="text-xs text-slate-400">
                                Band Type
                              </p>
                              <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                                {item.band_type}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Item Total */}
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                          <span className="text-xs font-medium text-slate-500">
                            Item Total
                          </span>

                          <span className="text-base font-bold text-orange-600 dark:text-orange-400">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center dark:border-slate-700">
                  <FiFileText
                    className="mx-auto mb-2 text-slate-400"
                    size={23}
                  />

                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    No printing items were returned for this project.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Check the items API response and the item's order ID.
                  </p>
                </div>
              )}
            </section>
            {/* STAFF ASSIGNMENTS */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiUsers} title="Staff Assignments" />

              {project.items.length > 0 ? (
                <div className="space-y-5">
                  {project.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"
                    >
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {item.item_description ||
                            `Printing Item ${index + 1}`}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {item.work_type || "Printing work"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <InfoItem
                          label="Designer"
                          value={getStaffName(
                            item.Designing_person ?? item.designing_person,
                            item.designing_person_details,
                          )}
                        />

                        <InfoItem
                          label="Printer"
                          value={getStaffName(
                            item.printing_person ?? item.Printing_person,
                            item.printing_person_details,
                          )}
                        />

                        <InfoItem
                          label="Binding"
                          value={getStaffName(
                            item.binding_person ?? item.Binding_person,
                            item.binding_person_details,
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Staff assignments will appear here when the printing items are
                  available.
                </p>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR */}

          <div className="space-y-6">
            {/* PAYMENT SUMMARY */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FaMoneyBillWave} title="Payment Summary" />

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Total Amount
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(project.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Advance
                  </span>

                  <span className="text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(project.advance)}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Remaining
                    </span>

                    <span className="text-right text-base font-bold text-orange-500">
                      {formatCurrency(project.remaining)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Payment Status</p>

                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {project.paymentStatus}
                </p>
              </div>
            </section>

            {/* IMPORTANT DATES */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiCalendar} title="Important Dates" />

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Project Date</p>

                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {formatDate(project.date)}
                    </p>
                  </div>

                  <FiCalendar className="shrink-0 text-slate-400" />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Delivery Date</p>

                    <p className="mt-1 text-sm font-semibold text-orange-500">
                      {formatDate(project.dueDate)}
                    </p>
                  </div>

                  <FiClock className="shrink-0 text-orange-500" />
                </div>
              </div>
            </section>

            {/* CUSTOMER QUICK INFO */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiUser} title="Customer" />

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 font-bold text-orange-500 dark:bg-orange-500/10">
                  {customerName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                    {customerName}
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    {project.customer.phone !== "-"
                      ? project.customer.phone
                      : "Phone unavailable"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/customers")}
                className="mt-5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-500 dark:border-slate-700 dark:text-slate-300"
              >
                View Customers
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
