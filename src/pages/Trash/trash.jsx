import React, { useState } from "react";
import {
  FiTrash2,
  FiRotateCcw,
  FiSearch,
  FiAlertTriangle,
  FiFileText,
  FiX,
} from "react-icons/fi";

const TrashPage = () => {
  const [search, setSearch] = useState("");

  const [trashItems, setTrashItems] = useState([
    {
      id: 1,
      slipNumber: "EST-10241",
      customer: "Ram Sharma",
      project: "Wedding Card Printing",
      deletedDate: "Sep 15, 2026",
      amount: "Rs. 18,500",
    },
    {
      id: 2,
      slipNumber: "EST-10238",
      customer: "Sita Enterprises",
      project: "Business Card Printing",
      deletedDate: "Sep 13, 2026",
      amount: "Rs. 7,800",
    },
    {
      id: 3,
      slipNumber: "EST-10231",
      customer: "Everest Traders",
      project: "Flex Banner",
      deletedDate: "Sep 10, 2026",
      amount: "Rs. 12,400",
    },
    {
      id: 4,
      slipNumber: "EST-10225",
      customer: "Hari Prasad",
      project: "Invitation Card",
      deletedDate: "Sep 08, 2026",
      amount: "Rs. 9,200",
    },
  ]);

  const filteredItems = trashItems.filter((item) =>
    `${item.slipNumber} ${item.customer} ${item.project}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const restoreItem = (id) => {
    setTrashItems((items) => items.filter((item) => item.id !== id));

    console.log("Restored item:", id);
  };

  const deleteItem = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this item?",
    );

    if (!confirmed) return;

    setTrashItems((items) => items.filter((item) => item.id !== id));
  };

  const emptyTrash = () => {
    if (trashItems.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete everything in the trash?",
    );

    if (!confirmed) return;

    setTrashItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-6 transition-colors duration-300 dark:bg-slate-950 md:px-8">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <FiTrash2
              className="text-orange-600 dark:text-orange-500"
              size={22}
            />

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Trash
            </h1>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage deleted estimates and projects.
          </p>
        </div>

        {trashItems.length > 0 && (
          <button
            onClick={emptyTrash}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <FiTrash2 size={17} />
            Empty Trash
          </button>
        )}
      </div>

      {/* Info Alert */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 dark:border-orange-900/50 dark:bg-orange-950/30">
        <FiAlertTriangle
          size={18}
          className="mt-0.5 shrink-0 text-orange-600 dark:text-orange-500"
        />

        <div>
          <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
            Items in trash
          </p>

          <p className="mt-0.5 text-xs leading-5 text-orange-700 dark:text-orange-400">
            Deleted items can be restored or permanently removed.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 flex items-center">
        <div className="relative w-full max-w-md">
          <FiSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search deleted items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-orange-500 dark:focus:ring-orange-500/10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* Table Header */}
        <div className="hidden grid-cols-[1.1fr_1.2fr_1.5fr_1fr_1fr_auto] items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 md:grid">
          <span>Slip No.</span>
          <span>Customer</span>
          <span>Project</span>
          <span>Deleted</span>
          <span>Amount</span>
          <span className="text-right">Actions</span>
        </div>

        {filteredItems.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 px-5 py-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 md:grid-cols-[1.1fr_1.2fr_1.5fr_1fr_1fr_auto] md:items-center"
              >
                {/* Slip */}
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 md:hidden">
                    Slip No.
                  </p>

                  <div className="mt-1 flex items-center gap-2 md:mt-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-500">
                      <FiFileText size={15} />
                    </div>

                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {item.slipNumber}
                    </span>
                  </div>
                </div>

                {/* Customer */}
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 md:hidden">
                    Customer
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200 md:mt-0">
                    {item.customer}
                  </p>
                </div>

                {/* Project */}
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 md:hidden">
                    Project
                  </p>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 md:mt-0">
                    {item.project}
                  </p>
                </div>

                {/* Deleted Date */}
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 md:hidden">
                    Deleted
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 md:mt-0">
                    {item.deletedDate}
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 md:hidden">
                    Amount
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200 md:mt-0">
                    {item.amount}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:justify-end">
                  <button
                    onClick={() => restoreItem(item.id)}
                    title="Restore"
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-orange-900 dark:hover:bg-orange-950/30 dark:hover:text-orange-400"
                  >
                    <FiRotateCcw size={15} />

                    <span className="hidden lg:inline">Restore</span>
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    title="Delete permanently"
                    className="flex h-9 items-center justify-center rounded-lg border border-red-100 px-2.5 text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[360px] flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <FiTrash2 size={25} />
            </div>

            <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">
              {search ? "No items found" : "Trash is empty"}
            </h2>

            <p className="mt-1 max-w-sm text-sm text-slate-400 dark:text-slate-500">
              {search
                ? "Try searching with a different customer, project, or slip number."
                : "Deleted estimates and projects will appear here."}
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400"
              >
                <FiX size={15} />
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Count */}
      {trashItems.length > 0 && (
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          Showing {filteredItems.length} of {trashItems.length} deleted items
        </p>
      )}
    </div>
  );
};

export default TrashPage;
