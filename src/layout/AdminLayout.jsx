import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/SideBar";
import { getCurrentUser } from "../utils/auth";

import {
  FiMoon,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiMenu,
  FiSun,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useSelector((state) => state.theme.theme);

  // =========================
  // CURRENT USER
  // =========================

  const user = getCurrentUser();

  // =========================
  // SIDEBAR
  // =========================

  const [sideBarOpen, setSideBarOpen] = useState(true);

  // =========================
  // NOTIFICATION
  // =========================

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          no-print fixed right-0 top-0 z-30
          flex h-20 items-center justify-between
          border-b border-slate-200
          bg-white px-5
          transition-all duration-300
          dark:border-slate-800 dark:bg-slate-900
          md:px-8
        "
        style={{
          left: sideBarOpen ? "256px" : "76px",
        }}
      >
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="flex min-w-0 flex-1 items-center gap-4">
          {/* SEARCH */}

          <div
            className="
              flex h-11 w-full max-w-xl
              items-center gap-3 rounded-xl
              border border-slate-200
              bg-slate-50 px-4
              transition
              focus-within:border-orange-400
              focus-within:bg-white
              focus-within:ring-2
              focus-within:ring-orange-100
              dark:border-slate-700
              dark:bg-slate-800
              dark:focus-within:bg-slate-800
            "
          >
            <FiSearch
              size={19}
              className="shrink-0 text-slate-400 dark:text-slate-500"
            />

            <input
              type="text"
              placeholder="Search projects, customers..."
              className="
                w-full min-w-0
                bg-transparent
                text-sm text-slate-700
                outline-none
                placeholder:text-slate-400
                dark:text-slate-200
                dark:placeholder:text-slate-500
              "
            />
          </div>

          {/* MOBILE MENU */}

          <button
            type="button"
            className="
              shrink-0 rounded-xl
              border border-slate-200
              p-2.5 text-slate-500
              hover:bg-slate-50
              dark:border-slate-700
              dark:text-slate-400
              dark:hover:bg-slate-800
              lg:hidden
            "
            aria-label="Open menu"
          >
            <FiMenu size={21} />
          </button>
        </div>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="ml-4 flex shrink-0 items-center gap-3">
          {/* =====================================================
              THEME
          ====================================================== */}

          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="
              rounded-xl border
              border-slate-200
              p-2.5 text-slate-500
              transition
              hover:bg-slate-50
              dark:border-slate-700
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <FiSun size={19} />
            ) : (
              <FiMoon size={19} />
            )}
          </button>

          {/* =====================================================
              NOTIFICATION
          ====================================================== */}

          <button
            type="button"
            onClick={handleNotificationClick}
            className="
              relative rounded-xl
              border border-slate-200
              p-2.5 text-slate-500
              transition
              hover:bg-slate-50
              hover:text-orange-500
              dark:border-slate-700
              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-orange-400
            "
            aria-label="Notifications"
            title="Notifications"
          >
            <FiBell size={19} />

            {/* Notification dot */}

            <span
              className="
                absolute right-2 top-2
                h-2 w-2 rounded-full
                bg-orange-500
              "
            />
          </button>

          {/* =====================================================
              ADMIN PROFILE
          ====================================================== */}

          <div
            className="
              hidden items-center gap-2
              border-l border-slate-200
              pl-4
              dark:border-slate-700
              md:flex
            "
          >
            {/* AVATAR */}

            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-full
                bg-orange-100
                text-sm font-bold
                text-orange-600
                dark:bg-orange-500/10
                dark:text-orange-400
              "
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            {/* USER INFO */}

            <div>
              <p
                className="
                  text-sm font-semibold
                  text-slate-700
                  dark:text-slate-200
                "
              >
                {user?.name || "Admin"}
              </p>

              <p
                className="
                  text-[11px] capitalize
                  text-slate-400
                  dark:text-slate-500
                "
              >
                {user?.role || "Administrator"}
              </p>
            </div>

            {/* DROPDOWN ICON */}

            <FiChevronDown
              size={15}
              className="
                ml-1
                text-slate-400
                dark:text-slate-500
              "
            />
          </div>
        </div>
      </header>

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <div className="no-print">
        <Sidebar
          sideBarOpen={sideBarOpen}
          setSideBarOpen={setSideBarOpen}
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className={`
          print-main
          min-h-screen
          pt-20
          transition-all duration-300
          ${sideBarOpen ? "ml-64" : "ml-[76px]"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;