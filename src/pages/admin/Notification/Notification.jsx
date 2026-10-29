import React, { useEffect, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiTrash2,
  FiAlertCircle,
  FiX,
  FiSearch,
} from "react-icons/fi";

// ========================================
// LOCAL STORAGE KEY
// ========================================

const STORAGE_KEY = "printing_press_notifications";

// ========================================
// INITIAL NOTIFICATIONS
// ========================================

const initialNotifications = [
  {
    id: 1,
    type: "project",
    title: "New Project Created",
    message: "A new printing project has been created by Ram Sharma.",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Received",
    message: "Rs. 12,500 payment received from Hotel Himalayan.",
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 3,
    type: "due",
    title: "Payment Due",
    message: "Rs. 8,500 payment is pending from ABC Traders.",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 4,
    type: "completed",
    title: "Project Completed",
    message: "Business Card Printing project has been completed.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 5,
    type: "stock",
    title: "Low Stock Alert",
    message: "A4 100 GSM paper stock is running low.",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 6,
    type: "project",
    title: "New Project Created",
    message: "Wedding card printing project added by Sunrise Events.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 7,
    type: "payment",
    title: "Payment Received",
    message: "Rs. 25,000 payment received from Everest Traders.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

// ========================================
// DYNAMIC TIME
// ========================================

const getTimeAgo = (createdAt) => {
  const now = new Date();
  const notificationDate = new Date(createdAt);

  const difference = now - notificationDate;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (difference < 0 || seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  return notificationDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ========================================
// COMPONENT
// ========================================

const Notification = () => {
  // ========================================
  // LOAD NOTIFICATIONS
  // ========================================

  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem(STORAGE_KEY);

    if (savedNotifications) {
      try {
        return JSON.parse(savedNotifications);
      } catch (error) {
        console.error(
          "Failed to parse notifications from localStorage:",
          error,
        );

        return initialNotifications;
      }
    }

    return initialNotifications;
  });

  const [search, setSearch] = useState("");

  // ========================================
  // SAVE TO LOCAL STORAGE
  // ========================================

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // ========================================
  // FORCE TIME UPDATE
  // ========================================

  const [, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // ========================================
  // UNREAD COUNT
  // ========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  // ========================================
  // GET ICON
  // ========================================

  const getIcon = (type) => {
    switch (type) {
      case "project":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400 sm:h-11 sm:w-11">
            <FiPackage size={19} />
          </div>
        );

      case "payment":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400 sm:h-11 sm:w-11">
            <FiDollarSign size={19} />
          </div>
        );

      case "due":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400 sm:h-11 sm:w-11">
            <FiClock size={19} />
          </div>
        );

      case "completed":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 sm:h-11 sm:w-11">
            <FiCheckCircle size={19} />
          </div>
        );

      case "stock":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400 sm:h-11 sm:w-11">
            <FiAlertCircle size={19} />
          </div>
        );

      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 sm:h-11 sm:w-11">
            <FiBell size={19} />
          </div>
        );
    }
  };

  // ========================================
  // MARK ONE AS READ
  // ========================================

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification,
      ),
    );
  };

  // ========================================
  // MARK ALL AS READ
  // ========================================

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  // ========================================
  // DELETE ONE
  // ========================================

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  // ========================================
  // CLEAR ALL
  // ========================================

  const clearAll = () => {
    setNotifications([]);
  };

  // ========================================
  // SEARCH
  // ========================================

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(search.toLowerCase()) ||
      notification.message.toLowerCase().includes(search.toLowerCase()),
  );

  // ========================================
  // NOTIFICATION TYPE COUNTS
  // ========================================

  const projectCount = notifications.filter(
    (item) => item.type === "project",
  ).length;

  const paymentCount = notifications.filter(
    (item) => item.type === "payment",
  ).length;

  const dueCount = notifications.filter((item) => item.type === "due").length;

  const completedCount = notifications.filter(
    (item) => item.type === "completed",
  ).length;

  const stockCount = notifications.filter(
    (item) => item.type === "stock",
  ).length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fa] px-4 py-5 transition-colors duration-200 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* TITLE */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400 sm:h-11 sm:w-11">
              <FiBell size={21} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
                Notifications
              </h1>

              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Stay updated with your printing press activities
              </p>
            </div>
          </div>

          {/* TOP ACTIONS */}

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
            {unreadCount > 0 && (
              <span className="rounded-lg bg-orange-100 px-3 py-2 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-400 sm:text-sm">
                {unreadCount} Unread
              </span>
            )}

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:flex-none sm:px-4 sm:text-sm"
              >
                <FiCheck size={16} />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="mt-5 sm:mt-6">
          <div className="relative w-full sm:max-w-md">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-orange-500"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <FiX size={17} />
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            MOBILE SUMMARY
            Notification Types appears FIRST on mobile
        ====================================================== */}

        <div className="mt-5 space-y-3 lg:hidden">
          {/* NOTIFICATION TYPES */}

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                  Notification Types
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Activity breakdown
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                <FiBell size={17} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {/* Projects */}

              <div className="rounded-lg bg-orange-50 px-3 py-3 dark:bg-orange-500/10">
                <p className="text-[11px] text-orange-600 dark:text-orange-400">
                  Projects
                </p>

                <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                  {projectCount}
                </p>
              </div>

              {/* Payments */}

              <div className="rounded-lg bg-green-50 px-3 py-3 dark:bg-green-500/10">
                <p className="text-[11px] text-green-600 dark:text-green-400">
                  Payments
                </p>

                <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                  {paymentCount}
                </p>
              </div>

              {/* Due */}

              <div className="rounded-lg bg-yellow-50 px-3 py-3 dark:bg-yellow-500/10">
                <p className="text-[11px] text-yellow-600 dark:text-yellow-400">
                  Due
                </p>

                <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                  {dueCount}
                </p>
              </div>

              {/* Completed */}

              <div className="rounded-lg bg-blue-50 px-3 py-3 dark:bg-blue-500/10">
                <p className="text-[11px] text-blue-600 dark:text-blue-400">
                  Completed
                </p>

                <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-100">
                  {completedCount}
                </p>
              </div>

              {/* Stock */}

              <div className="rounded-lg bg-red-50 px-3 py-3 dark:bg-red-500/10">
                <p className="text-[11px] text-red-600 dark:text-red-400">
                  Stock Alerts
                </p>

                <p className="mt-1 text-lg font-bold text-red-600 dark:text-red-400">
                  {stockCount}
                </p>
              </div>
            </div>
          </div>

          {/* SMALL SUMMARY ROW */}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                  <FiBell size={17} />
                </div>

                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Unread
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {unreadCount}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                  <FiPackage size={17} />
                </div>

                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Total
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {notifications.length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-6 lg:mt-6 lg:grid-cols-[1fr_300px]">
          {/* ==================================================
              NOTIFICATION LIST
          ================================================== */}

          <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800">
            {/* HEADER */}

            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-700 sm:px-5">
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Recent Notifications
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1 ? "s" : ""}
                </p>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-red-500 transition hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 sm:text-sm"
                >
                  <FiTrash2 size={15} />
                  <span className="hidden xs:inline sm:inline">Clear all</span>
                </button>
              )}
            </div>

            {/* EMPTY STATE */}

            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-16 sm:py-20">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <FiBell
                    size={28}
                    className="text-slate-400 dark:text-slate-500"
                  />
                </div>

                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  No notifications found
                </h3>

                <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
                  You are all caught up.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 border-b border-slate-100 p-4 transition last:border-b-0 dark:border-slate-700 sm:gap-4 sm:p-5 ${
                    notification.read
                      ? "bg-white dark:bg-slate-800"
                      : "bg-orange-50/50 dark:bg-orange-500/5"
                  }`}
                >
                  {/* ICON */}

                  {getIcon(notification.type)}

                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <div className="min-w-0">
                        <div className="flex items-start gap-2">
                          <h3
                            className={`min-w-0 text-sm sm:text-base ${
                              notification.read
                                ? "font-medium text-slate-700 dark:text-slate-300"
                                : "font-semibold text-slate-800 dark:text-slate-100"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {!notification.read && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm sm:leading-6">
                          {notification.message}
                        </p>
                      </div>

                      {/* TIME */}

                      <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500 sm:text-xs">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400"
                        >
                          <FiCheck size={14} />
                          Mark as read
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-500 dark:text-red-400"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ==================================================
              DESKTOP RIGHT SUMMARY
          ================================================== */}

          <div className="hidden space-y-4 lg:block">
            {/* UNREAD */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                  <FiBell size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Unread Notifications
                  </p>

                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {unreadCount}
                  </h3>
                </div>
              </div>
            </div>

            {/* TOTAL */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                  <FiPackage size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total Notifications
                  </p>

                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {notifications.length}
                  </h3>
                </div>
              </div>
            </div>

            {/* NOTIFICATION TYPES */}

            <div className="rounded-xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">
                Notification Types
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    New Projects
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {projectCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Payments
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {paymentCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Due Payments
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {dueCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Completed
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {completedCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Stock Alerts
                  </span>

                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {stockCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
