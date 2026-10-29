import React, { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiFolder,
  FiUsers,
  FiFileText,
  FiBell,
  FiRefreshCw,
  FiChevronDown,
  FiDatabase,
  FiShield,
  FiInfo,
  FiCheck,
} from "react-icons/fi";

import api from "../../../api/api";

// ======================================================
// TOAST
// ======================================================

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed right-5 top-5 z-[200] w-[calc(100%-40px)] max-w-sm">
      <div
        className={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-xl dark:bg-slate-900 ${
          isError
            ? "border-red-200 dark:border-red-900"
            : "border-emerald-200 dark:border-emerald-900"
        }`}
      >
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            isError
              ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          }`}
        >
          {isError ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {isError ? "Something went wrong" : "Operation completed"}
          </p>

          <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
          aria-label="Close notification"
        >
          <FiX size={17} />
        </button>
      </div>
    </div>
  );
};

// ======================================================
// CLEANUP CONFIGURATION
// ======================================================

const cleanupItems = [
  {
    id: "projects",
    title: "Projects",
    subtitle: "Print jobs and project management",
    description:
      "Remove project records and their associated printing job information.",
    icon: FiFolder,
    color: "orange",
    endpoint: "/projectsapi/projects/clear/",
    countLabel: "Total projects",
    buttonLabel: "Clear all projects",

    details: [
      {
        title: "Project information",
        description:
          "Project names, delivery dates, priority, and work status.",
      },
      {
        title: "Printing job details",
        description:
          "Printing specifications, quantities, paper types, and work details.",
      },
      {
        title: "Customer relationships",
        description:
          "Project references connected to customers, subject to backend deletion rules.",
      },
      {
        title: "Project metadata",
        description:
          "Creation details, assigned work, and other related project information.",
      },
    ],

    warning:
      "Removing projects may affect related estimates, invoices, or work assignments depending on your backend relationships.",
  },

  {
    id: "customers",
    title: "Customers",
    subtitle: "Customer records and contact information",
    description:
      "Remove customer records stored in your printing press account.",
    icon: FiUsers,
    color: "purple",
    endpoint: "/customerapi/customers/clear/",
    countLabel: "Total customers",
    buttonLabel: "Clear all customers",

    details: [
      {
        title: "Customer profiles",
        description:
          "Customer names, contact numbers, addresses, and other profile information.",
      },
      {
        title: "Business information",
        description: "PAN numbers and other customer business details.",
      },
      {
        title: "Customer history",
        description:
          "Customer relationships and references associated with printing projects.",
      },
      {
        title: "Contact information",
        description:
          "Saved customer contact details used throughout the application.",
      },
    ],

    warning:
      "Removing customers may affect existing project and invoice relationships. Check your backend's deletion rules before proceeding.",
  },

  {
    id: "invoices",
    title: "Invoices & Estimates",
    subtitle: "Billing records and financial documents",
    description:
      "Remove invoice and estimate records from your billing system.",
    icon: FiFileText,
    color: "amber",
    endpoint: "/invoicesapi/invoices/clear/",
    countLabel: "Total invoices",
    buttonLabel: "Clear all invoices",

    details: [
      {
        title: "Invoice records",
        description: "Invoice numbers, billing dates, and invoice information.",
      },
      {
        title: "Estimate records",
        description:
          "Estimate documents and their associated billing information.",
      },
      {
        title: "Payment information",
        description:
          "Advance payments, payment status, and billing relationships if included in the backend operation.",
      },
      {
        title: "Financial references",
        description: "References between invoices, projects, and customers.",
      },
    ],

    warning:
      "Deleting financial records can affect payment history, outstanding balances, and reporting. Verify your backend behavior before clearing.",
  },

  {
    id: "notifications",
    title: "Notifications",
    subtitle: "System alerts and activity notifications",
    description: "Remove notification records generated by the application.",
    icon: FiBell,
    color: "rose",
    endpoint: "/notificationsapi/notifications/clear/",
    countLabel: "Total notifications",
    buttonLabel: "Clear all notifications",

    details: [
      {
        title: "System notifications",
        description: "Application-generated alerts and system messages.",
      },
      {
        title: "Activity notifications",
        description: "Notifications related to project and account activities.",
      },
      {
        title: "Read notifications",
        description: "Previously viewed notifications stored in the system.",
      },
      {
        title: "Unread notifications",
        description: "Notifications that have not yet been viewed.",
      },
    ],

    warning:
      "Only notification records should be affected by this operation, according to the configured backend endpoint.",
  },
];

// ======================================================
// CLEANUP CARD
// ======================================================

const CleanupCard = ({ item, count, expanded, onToggle, loading, onClear }) => {
  const Icon = item.icon;

  const isLoadingCount = count === null;
  const isZero = count === 0;

  const colors = {
    orange: {
      icon: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
      badge:
        "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-900/50",
    },

    purple: {
      icon: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
      badge:
        "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-900/50",
    },

    amber: {
      icon: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
      badge:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-900/50",
    },

    rose: {
      icon: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
      badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-900/50",
    },
  };

  const theme = colors[item.color];

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-colors dark:bg-slate-900 ${
        expanded ? theme.border : "border-slate-200 dark:border-slate-800"
      }`}
    >
      {/* Card Header */}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 sm:p-6"
      >
        {/* Icon */}

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}
        >
          <Icon size={21} />
        </div>

        {/* Main Information */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              {item.title}
            </h3>

            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${theme.badge}`}
            >
              {isLoadingCount ? "Loading" : `${count} records`}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {item.subtitle}
          </p>
        </div>

        {/* Expand Icon */}

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition dark:border-slate-700 dark:text-slate-400 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <FiChevronDown size={18} />
        </div>
      </button>

      {/* Expanded Content */}

      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-800">
          <div className="px-5 py-5 sm:px-6">
            {/* Description */}

            <div className="mb-6">
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>

            {/* Details */}

            <div className="mb-5">
              <div className="mb-3 flex items-center gap-2">
                <FiDatabase size={16} className="text-slate-400" />

                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  What will be cleared?
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {item.details.map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 dark:bg-slate-800 dark:text-emerald-400">
                      <FiCheck size={13} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {detail.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {detail.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning */}

            <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              <FiInfo
                size={17}
                className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
              />

              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Important information
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400">
                  {item.warning}
                </p>
              </div>
            </div>

            {/* Bottom Action */}

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <FiShield size={15} />

                <span>
                  {isZero
                    ? "No records available to clear."
                    : "This operation cannot be undone."}
                </span>
              </div>

              <button
                type="button"
                onClick={onClear}
                disabled={loading || isZero || isLoadingCount}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:active:scale-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
              >
                {loading ? (
                  <>
                    <FiRefreshCw size={15} className="animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={15} />

                    {isZero ? "Nothing to clear" : item.buttonLabel}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const ResetCleanup = () => {
  const [toast, setToast] = useState(null);

  const [counts, setCounts] = useState({
    projects: null,
    customers: null,
    invoices: null,
    notifications: null,
  });

  const [loadingCounts, setLoadingCounts] = useState(false);

  const [expandedItem, setExpandedItem] = useState("projects");

  const [pendingAction, setPendingAction] = useState(null);

  const [loadingAction, setLoadingAction] = useState(null);

  // ====================================================
  // TOAST
  // ====================================================

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // ====================================================
  // LOAD COUNTS
  // ====================================================

  const loadCounts = async () => {
    setLoadingCounts(true);

    try {
      const results = await Promise.allSettled([
        api.get("/projectsapi/projects/"),
        api.get("/customerapi/customers/"),
        api.get("/invoicesapi/invoices/"),
        api.get("/notificationsapi/notifications/"),
      ]);

      const countOf = (result) => {
        if (result.status !== "fulfilled") {
          return 0;
        }

        const data = result.value.data;

        if (Array.isArray(data)) {
          return data.length;
        }

        if (Array.isArray(data?.results)) {
          return data.results.length;
        }

        return 0;
      };

      setCounts({
        projects: countOf(results[0]),
        customers: countOf(results[1]),
        invoices: countOf(results[2]),
        notifications: countOf(results[3]),
      });
    } catch (error) {
      console.error("Failed to load counts:", error);

      showToast("error", "Unable to load data counts. Please try again.");
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  // ====================================================
  // EXPAND / COLLAPSE
  // ====================================================

  const toggleItem = (id) => {
    setExpandedItem((current) => (current === id ? null : id));
  };

  // ====================================================
  // CONFIRMATION
  // ====================================================

  const askConfirm = (action) => {
    setPendingAction(action);
  };

  const cancelConfirm = () => {
    if (loadingAction) return;

    setPendingAction(null);
  };

  // ====================================================
  // CLEAR DATA
  // ====================================================

  const clearData = async (item) => {
    const response = await api.delete(item.endpoint);

    setCounts((current) => ({
      ...current,
      [item.id]: 0,
    }));

    showToast(
      "success",
      response?.data?.detail ||
        `All ${item.title.toLowerCase()} cleared successfully.`,
    );
  };

  // ====================================================
  // RUN ACTION
  // ====================================================

  const runAction = async () => {
    if (!pendingAction) return;

    const item = cleanupItems.find((item) => item.id === pendingAction);

    if (!item) return;

    setLoadingAction(item.id);

    try {
      await clearData(item);
    } catch (error) {
      console.error("Clear failed:", error);

      showToast(
        "error",
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to clear data.",
      );
    } finally {
      setLoadingAction(null);
      setPendingAction(null);
    }
  };

  // ====================================================
  // CONFIRMATION META
  // ====================================================

  const selectedItem = cleanupItems.find((item) => item.id === pendingAction);

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-6 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="mx-auto max-w-5xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                <FiDatabase size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Data Cleanup
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage and remove data from your workspace.
                </p>
              </div>
            </div>

            <button
              onClick={loadCounts}
              disabled={loadingCounts || loadingAction !== null}
              className="flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FiRefreshCw
                size={15}
                className={loadingCounts ? "animate-spin" : ""}
              />

              {loadingCounts ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Summary */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <FiDatabase size={14} />
                Data categories
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
                {cleanupItems.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Available cleanup sections
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <FiFolder size={14} />
                Total records
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
                {Object.values(counts).some((value) => value === null)
                  ? "..."
                  : Object.values(counts).reduce(
                      (total, value) => total + value,
                      0,
                    )}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Across the displayed categories
              </p>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50/60 p-4 dark:border-red-900/40 dark:bg-red-950/20">
              <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400">
                <FiAlertTriangle size={14} />
                Important
              </div>

              <p className="mt-2 text-sm font-semibold text-red-700 dark:text-red-300">
                Permanent deletion
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600/80 dark:text-red-400/80">
                These actions cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            SECTION TITLE
        ================================================= */}

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Data categories
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Expand a section to review the data before clearing.
            </p>
          </div>

          <span className="text-xs text-slate-400">
            {cleanupItems.length} categories
          </span>
        </div>

        {/* =================================================
            CLEANUP SECTIONS
        ================================================= */}

        <div className="space-y-4">
          {cleanupItems.map((item) => (
            <CleanupCard
              key={item.id}
              item={item}
              count={counts[item.id]}
              expanded={expandedItem === item.id}
              onToggle={() => toggleItem(item.id)}
              loading={loadingAction === item.id}
              onClear={() => askConfirm(item.id)}
            />
          ))}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <FiShield size={17} className="mt-0.5 shrink-0 text-slate-400" />

          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Data management information
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Cleanup operations are performed through your backend API. The
              actual records affected depend on the configured deletion logic
              and database relationships.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          CONFIRMATION MODAL
      ================================================= */}

      {pendingAction && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm dark:bg-black/70">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            {/* Modal Header */}

            <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <FiTrash2 size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    Clear all {selectedItem.title.toLowerCase()}?
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Confirm this destructive action
                  </p>
                </div>
              </div>

              <button
                onClick={cancelConfirm}
                disabled={loadingAction !== null}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close confirmation"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}

            <div className="p-5">
              <div className="rounded-xl border border-red-100 bg-red-50/70 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">
                    Records to be cleared
                  </span>

                  <span className="text-lg font-bold text-red-700 dark:text-red-300">
                    {counts[pendingAction] ?? 0}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                You are about to permanently delete{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {counts[pendingAction] ?? 0}{" "}
                  {selectedItem.title.toLowerCase()}
                </span>
                .
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {selectedItem.warning}
              </p>

              <div className="mt-5 flex items-start gap-2">
                <FiAlertTriangle
                  size={15}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <p className="text-xs leading-5 text-red-600 dark:text-red-400">
                  This operation cannot be undone. Please verify your selection
                  before continuing.
                </p>
              </div>
            </div>

            {/* Modal Footer */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:justify-end">
              <button
                onClick={cancelConfirm}
                disabled={loadingAction !== null}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={runAction}
                disabled={loadingAction !== null}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingAction !== null ? (
                  <>
                    <FiRefreshCw size={15} className="animate-spin" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={15} />
                    Yes, clear permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetCleanup;
