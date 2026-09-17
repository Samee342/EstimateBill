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
// DYNAMIC TIME FUNCTION
// ========================================

const getTimeAgo = (createdAt) => {
  const now = new Date();
  const notificationDate = new Date(createdAt);

  const difference = now - notificationDate;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (difference < 0) {
    return "Just now";
  }

  if (seconds < 60) {
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
  // GET NOTIFICATION ICON
  // ========================================

  const getIcon = (type) => {
    switch (type) {
      case "project":
        return (
          <div className="w-11 h-11 rounded-full bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <FiPackage size={20} />
          </div>
        );

      case "payment":
        return (
          <div className="w-11 h-11 rounded-full bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
            <FiDollarSign size={20} />
          </div>
        );

      case "due":
        return (
          <div className="w-11 h-11 rounded-full bg-yellow-100 dark:bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0">
            <FiClock size={20} />
          </div>
        );

      case "completed":
        return (
          <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FiCheckCircle size={20} />
          </div>
        );

      case "stock":
        return (
          <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <FiAlertCircle size={20} />
          </div>
        );

      default:
        return (
          <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
            <FiBell size={20} />
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

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-slate-900 px-4 py-5 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <FiBell size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Notifications
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Stay updated with your printing press activities
                </p>
              </div>
            </div>
          </div>

          {/* TOP ACTIONS */}

          <div className="flex items-center gap-3 flex-wrap">
            {unreadCount > 0 && (
              <span className="px-3 py-2 bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium">
                {unreadCount} Unread
              </span>
            )}

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <FiCheck size={16} />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* ========================================
            SEARCH BAR
        ======================================== */}

        <div className="mt-6">
          <div className="relative max-w-md">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full h-11 pl-10 pr-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:border-orange-400 dark:focus:border-orange-500 transition"
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

        {/* ========================================
            MAIN CONTENT
        ======================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6">
          {/* ======================================
              NOTIFICATION LIST
          ====================================== */}

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
            {/* HEADER */}

            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Recent Notifications
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1 ? "s" : ""}
                </p>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                >
                  <FiTrash2 size={15} />
                  Clear all
                </button>
              )}
            </div>

            {/* ======================================
                EMPTY STATE
            ====================================== */}

            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-5">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                  <FiBell
                    size={28}
                    className="text-slate-400 dark:text-slate-500"
                  />
                </div>

                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  No notifications found
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-center">
                  You are all caught up.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group flex gap-4 p-5 border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition ${
                    notification.read
                      ? "bg-white dark:bg-slate-800"
                      : "bg-orange-50/50 dark:bg-orange-500/5"
                  }`}
                >
                  {/* ICON */}

                  {getIcon(notification.type)}

                  {/* DETAILS */}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm sm:text-base ${
                              notification.read
                                ? "font-medium text-slate-700 dark:text-slate-300"
                                : "font-semibold text-slate-800 dark:text-slate-100"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                          )}
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-6">
                          {notification.message}
                        </p>
                      </div>

                      {/* TIME */}

                      <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-3 mt-3">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <FiCheck size={14} />
                          Mark as read
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
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

          {/* ======================================
              RIGHT SUMMARY
          ====================================== */}

          <div className="space-y-4">
            {/* UNREAD */}

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center">
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

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
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

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 transition-colors">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Notification Types
              </h3>

              <div className="space-y-3">
                {/* PROJECT */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    New Projects
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {
                      notifications.filter((item) => item.type === "project")
                        .length
                    }
                  </span>
                </div>

                {/* PAYMENT */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Payments
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {
                      notifications.filter((item) => item.type === "payment")
                        .length
                    }
                  </span>
                </div>

                {/* DUE */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Due Payments
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {notifications.filter((item) => item.type === "due").length}
                  </span>
                </div>

                {/* COMPLETED */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Completed
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {
                      notifications.filter((item) => item.type === "completed")
                        .length
                    }
                  </span>
                </div>

                {/* STOCK */}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Stock Alerts
                  </span>

                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {
                      notifications.filter((item) => item.type === "stock")
                        .length
                    }
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
