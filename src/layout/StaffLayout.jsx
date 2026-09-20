import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  FiBarChart2,
  FiBriefcase,
  FiCheckSquare,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiUsers,
  FiUser,
  FiMoon,
  FiSun,
  FiBell,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";

import { getCurrentUser, logoutUser } from "../utils/auth";
import Logo from "../assets/Logo.png";

const StaffLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // =====================================================
  // SIDEBAR STATE
  // =====================================================

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // =====================================================
  // CURRENT USER
  // =====================================================

  const user = getCurrentUser();

  // =====================================================
  // THEME
  // =====================================================

  const theme = useSelector((state) => state.theme.theme);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logoutUser();

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // NOTIFICATION
  // =====================================================

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  // =====================================================
  // NAVIGATION ITEMS
  // =====================================================

  const navigation = [
    {
      name: "Dashboard",
      path: "/staff",
      icon: FiBarChart2,
      end: true,
    },
    {
      name: "My Tasks",
      path: "/staff/tasks",
      icon: FiCheckSquare,
    },
    {
      name: "My Orders",
      path: "/staff/orders",
      icon: FiBriefcase,
    },
    {
      name: "Customers",
      path: "/staff/customers",
      icon: FiUsers,
    },
    {
      name: "Setting",
      path: "/staff/profile",
      icon: FiUser,
    },
  ];

  // =====================================================
  // CLOSE MOBILE SIDEBAR ON ROUTE CHANGE
  // =====================================================

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // =====================================================
  // SIDEBAR NAVIGATION CLASS
  // =====================================================

  const navClass = ({ isActive }) =>
    `group flex items-center rounded-xl transition-all duration-200 ${
      sidebarOpen ? "gap-3 px-3 py-3" : "justify-center px-2 py-3"
    } ${
      isActive
        ? "bg-orange-500 text-white shadow-sm shadow-orange-200 dark:shadow-none"
        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
    }`;

  // =====================================================
  // USER INITIAL
  // =====================================================

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "S";

  // =====================================================
  // HANDLE NAVIGATION CLICK
  // =====================================================

  const handleNavigation = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebarOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-slate-950/40
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50

          flex
          h-screen
          flex-col

          border-r
          border-slate-200
          bg-white

          transition-all
          duration-300

          dark:border-slate-800
          dark:bg-slate-900

          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0

          ${sidebarOpen ? "lg:w-64" : "lg:w-20"}

          w-[280px]
          max-w-[85vw]
        `}
      >
        {/* =====================================================
            LOGO / SIDEBAR HEADER
        ====================================================== */}

        <div
          className={`
            flex
            h-20
            shrink-0
            items-center
            border-b
            border-slate-100
            dark:border-slate-800

            ${sidebarOpen ? "justify-between px-4" : "justify-center px-3"}
          `}
        >
          {/* Logo + Brand */}

          <NavLink
            to="/staff"
            end
            title="Go to Staff Dashboard"
            onClick={handleNavigation}
            className={`
              flex
              min-w-0
              items-center

              ${sidebarOpen ? "gap-3" : "justify-center"}
            `}
          >
            {/* Logo */}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50 dark:bg-orange-500/10">
              <img
                src={Logo}
                alt="PrintTech"
                className="h-9 w-9 object-contain"
              />
            </div>

            {/* Brand */}

            {sidebarOpen && (
              <div className="min-w-0">
                <h1 className="text-[18px] font-bold leading-none tracking-tight text-slate-900 dark:text-white">
                  Print
                  <span className="text-orange-500">Tech</span>
                </h1>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Staff Panel
                  </p>
                </div>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Button */}

          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="
                ml-2
                hidden
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg

                text-slate-400

                transition

                hover:bg-slate-100
                hover:text-slate-700

                dark:hover:bg-slate-800
                dark:hover:text-slate-200

                lg:flex
              "
              title="Collapse sidebar"
            >
              <FiChevronLeft size={18} />
            </button>
          )}

          {/* Mobile Close Button */}

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg

              text-slate-400

              transition

              hover:bg-slate-100
              hover:text-slate-700

              dark:hover:bg-slate-800
              dark:hover:text-slate-200

              lg:hidden
            "
            title="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* =====================================================
            DESKTOP OPEN SIDEBAR BUTTON
        ====================================================== */}

        {!sidebarOpen && (
          <div
            className="
              hidden
              justify-center
              border-b
              border-slate-100
              py-3

              dark:border-slate-800

              lg:flex
            "
          >
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg

                text-slate-400

                transition

                hover:bg-orange-50
                hover:text-orange-500

                dark:hover:bg-slate-800
              "
              title="Open sidebar"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            px-3
            py-5
          "
        >
          {/* Workspace Label */}

          {sidebarOpen && (
            <p
              className="
                mb-3
                px-3

                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-slate-400
              "
            >
              Workspace
            </p>
          )}

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={handleNavigation}
                  className={navClass}
                  title={!sidebarOpen ? item.name : ""}
                >
                  <Icon className="shrink-0" size={18} />

                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* =====================================================
            LOGOUT
        ====================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-slate-100
            p-3

            dark:border-slate-800
          "
        >
          <button
            type="button"
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : ""}
            className={`
              group
              flex
              w-full
              items-center
              rounded-xl

              text-red-500

              transition-all
              duration-200

              hover:bg-red-50
              hover:text-red-600

              dark:hover:bg-red-950/30

              ${sidebarOpen ? "gap-3 px-3 py-3" : "justify-center px-2 py-3"}
            `}
          >
            <FiLogOut className="shrink-0" size={18} />

            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div
        className={`
          flex
          min-h-screen
          min-w-0
          flex-1
          flex-col

          transition-all
          duration-300

          ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}
        `}
      >
        {/* =====================================================
            TOP HEADER
        ====================================================== */}

        <header
          className="
            sticky
            top-0
            z-30

            flex
            h-16
            items-center
            justify-between

            border-b
            border-slate-200

            bg-white/95

            px-4

            backdrop-blur

            sm:h-20
            sm:px-5
            md:px-8

            dark:border-slate-800
            dark:bg-slate-900/95
          "
        >
          {/* =================================================
              LEFT HEADER
          ================================================== */}

          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg

                text-slate-500

                transition

                hover:bg-orange-50
                hover:text-orange-500

                dark:text-slate-300
                dark:hover:bg-slate-800

                lg:hidden
              "
              title="Open menu"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>

            <div className="min-w-0">
              <p
                className="
                  truncate

                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-orange-500

                  sm:text-xs
                "
              >
                Staff Workspace
              </p>

              <p
                className="
                  mt-0.5
                  hidden
                  text-xs
                  text-slate-400

                  sm:block
                "
              >
                Manage your daily work
              </p>
            </div>
          </div>

          {/* =================================================
              RIGHT HEADER
          ================================================== */}

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}

            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="
                rounded-xl
                border
                border-slate-200
                p-2.5

                text-slate-500

                transition

                hover:bg-slate-50
                hover:text-orange-500

                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-800
                dark:hover:text-orange-400
              "
              aria-label="Toggle theme"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? <FiSun size={19} /> : <FiMoon size={19} />}
            </button>

            {/* Notifications */}

            <button
              type="button"
              onClick={handleNotificationClick}
              className="
                relative
                rounded-xl
                border
                border-slate-200
                p-2.5

                text-slate-500

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

              {/* Notification Dot */}

              <span
                className="
                  absolute
                  right-2
                  top-2

                  h-2
                  w-2

                  rounded-full
                  bg-orange-500
                "
              />
            </button>

            {/* User Details */}

            <div className="hidden text-right sm:block">
              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-800

                  dark:text-slate-100
                "
              >
                {user?.name || "Staff"}
              </p>

              <p className="text-xs capitalize text-slate-400 dark:text-slate-500">
                {user?.role || "staff"}
              </p>
            </div>

            {/* Avatar */}

            <div
              className="
                flex
                h-9
                w-9
                shrink-0

                items-center
                justify-center

                rounded-full

                bg-orange-100

                text-sm
                font-bold
                text-orange-600

                ring-4
                ring-orange-50

                dark:bg-orange-500/10
                dark:text-orange-400
                dark:ring-orange-500/5

                sm:h-10
                sm:w-10
              "
            >
              {userInitial}
            </div>
          </div>
        </header>

        {/* =====================================================
            PAGE CONTENT
        ====================================================== */}

        <main
          className="
            min-w-0
            flex-1

            p-3

            sm:p-4
            md:p-6
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
