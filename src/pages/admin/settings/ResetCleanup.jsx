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
  FiRefreshCw,
  FiDatabase,
  FiShield,
} from "react-icons/fi";

import api from "../../../api/api";
import { getProjects, getPaymentStatus } from "../../../api/project";
import { getCustomer } from "../../../api/customer";
import { resetDataByAdmin } from "../../../api/admin";

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
// DATA CATEGORIES
// ======================================================

const dataCategories = [
  {
    id: "customers",
    title: "Customers",
    subtitle: "Profiles, contacts & business details",
    icon: FiUsers,
    color: "purple",
    countKey: "customers",
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Print jobs and project records",
    icon: FiFolder,
    color: "orange",
    countKey: "projects",
  },
  {
    id: "invoices",
    title: "Invoices & Estimates",
    subtitle: "Billing records and financial documents",
    icon: FiFileText,
    color: "amber",
    countKey: "invoices",
  },
];

const colorTheme = {
  orange: {
    icon: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    badge:
      "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    ring: "ring-orange-100 dark:ring-orange-900/30",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
    badge:
      "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
    ring: "ring-purple-100 dark:ring-purple-900/30",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    ring: "ring-amber-100 dark:ring-amber-900/30",
  },
};

// ======================================================
// WHAT GETS RESET LIST ROW
// ======================================================

const CategoryRow = ({ item, count }) => {
  const Icon = item.icon;
  const theme = colorTheme[item.color];

  const isLoading = count === null;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 transition hover:border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${theme.icon} ${theme.ring}`}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {item.title}
          </h3>

          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${theme.badge}`}
          >
            {isLoading ? "Loading" : `${count} records`}
          </span>
        </div>

        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {item.subtitle}
        </p>
      </div>
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
  });

  const [loadingCounts, setLoadingCounts] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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
        getProjects(), // /orderslipapi/orderslips/
        getCustomer(), // from api/customer
        getPaymentStatus(), // /orderslipapi/invoices
      ]);

      // ── DIAGNOSTIC LOGGING ──
      results.forEach((r, i) => {
        const label = ["projects", "customers", "invoices"][i];

        if (r.status === "fulfilled") {
          console.log(`[${label}] raw response =`, r.value);
          console.log(`[${label}] response.data =`, r.value?.data);
          console.log(`[${label}] response.data.data =`, r.value?.data?.data);
        } else {
          console.warn(
            `[${label}] FAILED`,
            r.reason?.response?.status,
            r.reason?.config?.url,
            r.reason?.message,
          );
        }
      });
      // ── END DIAGNOSTIC ──

      const countOf = (result) => {
        if (result.status !== "fulfilled") return 0;

        // The imported helpers already return response.data,
        // so the shape here is whatever the backend wraps it in.
        const raw = result.value;
        const data = raw?.data ?? raw;

        if (Array.isArray(data)) return data.length;
        if (Array.isArray(data?.results)) return data.results.length;
        if (Array.isArray(data?.orders)) return data.orders.length;
        if (Array.isArray(data?.orderslips)) return data.orderslips.length;
        if (Array.isArray(data?.projects)) return data.projects.length;
        if (Array.isArray(data?.customers)) return data.customers.length;
        if (Array.isArray(data?.customer_list))
          return data.customer_list.length;
        if (Array.isArray(data?.items)) return data.items.length;
        if (Array.isArray(data?.records)) return data.records.length;
        if (Array.isArray(data?.invoices)) return data.invoices.length;
        if (typeof data?.count === "number") return data.count;

        return 0;
      };

      const nextCounts = {
        projects: countOf(results[0]),
        customers: countOf(results[1]),
        invoices: countOf(results[2]),
      };

      console.log("[loadCounts] final counts =", nextCounts);

      setCounts(nextCounts);
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
  // TOTALS
  // ====================================================

  const totalRecords = Object.values(counts).some((v) => v === null)
    ? null
    : Object.values(counts).reduce((total, value) => total + value, 0);

  const allEmpty = totalRecords === 0;

  // ====================================================
  // RESET EVERYTHING
  // ====================================================

  const runReset = async () => {
    setIsResetting(true);

    try {
      const response = await resetDataByAdmin();

      setCounts({
        projects: 0,
        customers: 0,
        invoices: 0,
      });

      showToast(
        "success",
        response?.data?.detail ||
          response?.data?.message ||
          "All data has been reset successfully.",
      );

      setConfirmOpen(false);
    } catch (error) {
      console.error("Reset failed:", error);

      showToast(
        "error",
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to reset data. Please try again.",
      );
    } finally {
      setIsResetting(false);
    }
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-6 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                <FiDatabase size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Reset all data
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Wipe every record from your workspace in one action.
                </p>
              </div>
            </div>

            <button
              onClick={loadCounts}
              disabled={loadingCounts || isResetting}
              className="flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FiRefreshCw
                size={15}
                className={loadingCounts ? "animate-spin" : ""}
              />

              {loadingCounts ? "Refreshing..." : "Refresh counts"}
            </button>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <FiFolder size={14} />
                Total records to reset
              </div>

              <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
                {totalRecords === null ? "..." : totalRecords}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Across customers, projects and invoices
              </p>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50/60 p-4 dark:border-red-900/40 dark:bg-red-950/20">
              <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400">
                <FiAlertTriangle size={14} />
                Danger zone
              </div>

              <p className="mt-2 text-sm font-semibold text-red-700 dark:text-red-300">
                Permanent deletion
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600/80 dark:text-red-400/80">
                This action cannot be undone once confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* WHAT WILL BE RESET */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            What will be reset
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Every record from the categories below will be permanently removed.
          </p>
        </div>

        <div className="space-y-3">
          {dataCategories.map((item) => (
            <CategoryRow
              key={item.id}
              item={item}
              count={counts[item.countKey]}
            />
          ))}
        </div>

        {/* RESET BUTTON PANEL */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-red-200 bg-white dark:border-red-900/50 dark:bg-slate-900">
          <div className="flex items-start gap-3 border-b border-red-100 bg-red-50/60 p-5 dark:border-red-900/40 dark:bg-red-950/20">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <FiTrash2 size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                Reset everything
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600/80 dark:text-red-400/80">
                Clicking the button below will permanently delete all customers,
                projects and invoices from your database.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <FiShield size={15} />

              <span>
                {allEmpty
                  ? "There is nothing left to reset."
                  : "This operation cannot be undone."}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={isResetting || allEmpty || totalRecords === null}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:active:scale-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
            >
              <FiTrash2 size={15} />
              Reset everything
            </button>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <FiShield size={17} className="mt-0.5 shrink-0 text-slate-400" />

          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              How this works
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              A single reset call is sent to the backend. Which exact records
              are removed is determined by the deletion logic configured on the
              server.
            </p>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm dark:bg-black/70">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <FiTrash2 size={20} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    Reset all data?
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    This will clear every record in your workspace.
                  </p>
                </div>
              </div>

              <button
                onClick={() => !isResetting && setConfirmOpen(false)}
                disabled={isResetting}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close confirmation"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl border border-red-100 bg-red-50/70 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">
                    Total records to be cleared
                  </span>

                  <span className="text-lg font-bold text-red-700 dark:text-red-300">
                    {totalRecords ?? 0}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {dataCategories.map((item) => {
                  const Icon = item.icon;
                  const theme = colorTheme[item.color];

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-md ${theme.icon}`}
                        >
                          <Icon size={13} />
                        </span>

                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                          {item.title}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {counts[item.countKey] ?? 0}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex items-start gap-2">
                <FiAlertTriangle
                  size={15}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <p className="text-xs leading-5 text-red-600 dark:text-red-400">
                  This operation cannot be undone. Please verify before
                  continuing.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={isResetting}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={runReset}
                disabled={isResetting}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResetting ? (
                  <>
                    <FiRefreshCw size={15} className="animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={15} />
                    Yes, reset everything
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
