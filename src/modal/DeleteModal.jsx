import React from "react";
import { FaExclamationTriangle, FaTrash, FaTimes } from "react-icons/fa";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-900">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <FaExclamationTriangle size={13} />
            </div>

            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 transition hover:text-slate-600 disabled:opacity-50 dark:hover:text-slate-200"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-4 py-4">
          <p className="text-sm leading-5 text-slate-600 dark:text-slate-300">
            {message}
          </p>

          {itemName && (
            <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                {itemName}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaTrash size={12} />
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
