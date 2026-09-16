
import React, { useState } from "react";
import {
  FiAlertTriangle,
  FiTrash2,
  FiRefreshCcw,
  FiDatabase,
  FiBell,
  FiSettings,
  FiX,
} from "react-icons/fi";

const ResetCleanup = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState("");

  const [message, setMessage] = useState("");

  // ========================================
  // SHOW CONFIRMATION
  // ========================================

  const askConfirmation = (type) => {
    setAction(type);
    setShowConfirm(true);
  };

  // ========================================
  // CLEAR NOTIFICATIONS
  // ========================================

  const clearNotifications = () => {
    localStorage.removeItem("printing_press_notifications");

    setMessage("All notifications have been cleared.");
    setShowConfirm(false);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // ========================================
  // RESET STUDIO SETTINGS
  // ========================================

  const resetSettings = () => {
    localStorage.removeItem("printing_press_studio_settings");

    setMessage("Studio settings have been reset.");
    setShowConfirm(false);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // ========================================
  // CLEAR PROJECT DATA
  // ========================================

  const clearProjects = () => {
    localStorage.removeItem("printing_press_projects");

    setMessage("Project data has been cleared.");
    setShowConfirm(false);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // ========================================
  // CLEAR CUSTOMER DATA
  // ========================================

  const clearCustomers = () => {
    localStorage.removeItem("printing_press_customers");

    setMessage("Customer data has been cleared.");
    setShowConfirm(false);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // ========================================
  // RESET EVERYTHING
  // ========================================

  const resetEverything = () => {
    localStorage.clear();

    setMessage("All local application data has been reset.");
    setShowConfirm(false);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // ========================================
  // CONFIRM ACTION
  // ========================================

  const confirmAction = () => {
    switch (action) {
      case "notifications":
        clearNotifications();
        break;

      case "settings":
        resetSettings();
        break;

      case "projects":
        clearProjects();
        break;

      case "customers":
        clearCustomers();
        break;

      case "everything":
        resetEverything();
        break;

      default:
        setShowConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-5 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <FiRefreshCcw size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Reset & CleanUp
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage local application data and cleanup actions.
              </p>
            </div>

          </div>

        </div>


        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}


        {/* WARNING */}

        <div className="mb-6 flex gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

          <FiAlertTriangle
            className="mt-0.5 shrink-0 text-yellow-600"
            size={20}
          />

          <div>
            <h3 className="font-semibold text-yellow-800">
              Be careful before resetting data
            </h3>

            <p className="mt-1 text-sm leading-6 text-yellow-700">
              These actions remove data stored in your browser's localStorage.
              Deleted local data cannot be recovered from this page.
            </p>
          </div>

        </div>


        {/* ========================================
            CLEANUP OPTIONS
        ======================================== */}

        <div className="space-y-4">


          {/* NOTIFICATIONS */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <FiBell size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Clear Notifications
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Remove all saved notifications from this browser.
                  </p>
                </div>

              </div>

              <button
                onClick={() => askConfirmation("notifications")}
                className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Clear Notifications
              </button>

            </div>

          </div>


          {/* SETTINGS */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <FiSettings size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Reset Studio Settings
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Restore studio settings back to their default values.
                  </p>
                </div>

              </div>

              <button
                onClick={() => askConfirmation("settings")}
                className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Reset Settings
              </button>

            </div>

          </div>


          {/* PROJECTS */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <FiDatabase size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Clear Project Data
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Remove project data saved in localStorage.
                  </p>
                </div>

              </div>

              <button
                onClick={() => askConfirmation("projects")}
                className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Clear Projects
              </button>

            </div>

          </div>


          {/* CUSTOMERS */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <FiDatabase size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Clear Customer Data
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Remove customer data saved in localStorage.
                  </p>
                </div>

              </div>

              <button
                onClick={() => askConfirmation("customers")}
                className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Clear Customers
              </button>

            </div>

          </div>


          {/* EVERYTHING */}

          <div className="rounded-xl border border-red-200 bg-white p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <FiTrash2 size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-red-700">
                    Reset Everything
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Permanently remove all application data stored in this browser.
                  </p>
                </div>

              </div>

              <button
                onClick={() => askConfirmation("everything")}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Reset Everything
              </button>

            </div>

          </div>

        </div>


        {/* ========================================
            CONFIRMATION MODAL
        ======================================== */}

        {showConfirm && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <FiAlertTriangle size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-800">
                      Confirm Action
                    </h2>

                    <p className="text-xs text-slate-500">
                      This action cannot be undone.
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => setShowConfirm(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FiX size={18} />
                </button>

              </div>

              <p className="mt-5 text-sm leading-6 text-slate-600">
                Are you sure you want to continue? The selected local data
                will be permanently removed from this browser.
              </p>

              <div className="mt-6 flex justify-end gap-3">

                <button
                  onClick={() => setShowConfirm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmAction}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Yes, Continue
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ResetCleanup;

