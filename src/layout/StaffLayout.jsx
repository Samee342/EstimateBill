import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  FiBarChart2,
  FiCheckSquare,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiLogOut,
  FiUsers,
  FiFolder,
  FiPlus,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import { FaRegMoneyBillAlt } from "react-icons/fa";

import { IoSettingsOutline } from "react-icons/io5";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";

import { getCurrentUser, logoutUser } from "../utils/auth";
import Logo from "../assets/Logo.png";

const StaffLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dropdown open state
  const [projectOpen, setProjectOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);

  const theme = useSelector((state) => state.theme.theme);

  // =====================================================
  // GET CURRENT LOGGED-IN STAFF
  // =====================================================

  const user = getCurrentUser();

  const staffName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "Staff Member";

  const staffRole = user?.role || user?.user_type || "Staff";

  const userInitial = staffName.trim().charAt(0).toUpperCase() || "S";

  const pressName =
    user?.tenant_details?.name || user?.company_name || "Printing Press";

  // =====================================================
  // ACTIVE SECTIONS
  // =====================================================

  const isProjectSection = location.pathname.startsWith("/staff/projects");
  const isCustomerSection = location.pathname.startsWith("/staff/customers");

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  // =====================================================
  // AUTO-OPEN ACTIVE DROPDOWN
  // =====================================================

  useEffect(() => {
    if (!sidebarOpen) return;

    if (isProjectSection) setProjectOpen(true);
    if (isCustomerSection) setCustomerOpen(true);
  }, [sidebarOpen, isProjectSection, isCustomerSection]);

  // Close dropdowns when the sidebar collapses
  useEffect(() => {
    if (!sidebarOpen) {
      setProjectOpen(false);
      setCustomerOpen(false);
    }
  }, [sidebarOpen]);

  // =====================================================
  // CLOSE MOBILE SIDEBAR WHEN ROUTE CHANGES
  // =====================================================

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // =====================================================
  // NAV STYLES
  // =====================================================

  const navClass = ({ isActive }) =>
    `group flex items-center rounded-xl transition-all duration-200 ${
      sidebarOpen ? "gap-3 px-3 py-3" : "justify-center px-2 py-3"
    } ${
      isActive
        ? "bg-orange-500 text-white shadow-sm shadow-orange-200 dark:shadow-none"
        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
    }`;

  const subNavClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
      isActive
        ? "bg-orange-50 font-medium text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
        : "text-slate-600 hover:bg-slate-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
    }`;

  const handleNavigation = () => {
    setMobileSidebarOpen(false);
  };

  // =====================================================
  // COLLAPSED FLYOUT SUBMENU
  // =====================================================

  const CollapsedSubMenu = ({ children }) => (
    <div
      className="
        absolute left-[68px] top-0 z-[9999]

        invisible opacity-0

        transition-all duration-150

        group-hover:visible
        group-hover:opacity-100

        pointer-events-none
        group-hover:pointer-events-auto
      "
    >
      {/* Invisible bridge so the mouse can travel to the flyout */}
      <div className="absolute -left-2 top-0 h-full w-2" />

      <div
        className="
          min-w-[180px] rounded-lg border
          border-slate-200 bg-white p-1.5 shadow-lg
          dark:border-slate-700 dark:bg-slate-800
        "
      >
        {children}
      </div>
    </div>
  );

  const CollapsedSubItem = ({ to, icon, children, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `
          flex items-center gap-2 whitespace-nowrap
          rounded-md px-2.5 py-2
          text-[11px] font-medium

          transition-all duration-150

          ${
            isActive
              ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
              : "text-slate-600 hover:bg-slate-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-orange-400"
          }
        `
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          border-r border-slate-200 bg-white
          transition-all duration-300
          dark:border-slate-800 dark:bg-slate-900
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${sidebarOpen ? "lg:w-64" : "lg:w-20"}
          w-[280px] max-w-[85vw]
        `}
      >
        {/* SIDEBAR HEADER */}
        <div
          className={`
            flex h-20 shrink-0 items-center
            border-b border-slate-100 dark:border-slate-800
            ${sidebarOpen ? "justify-between px-4" : "justify-center px-3"}
          `}
        >
          <NavLink
            to="/staff"
            end
            title="Go to Staff Dashboard"
            onClick={handleNavigation}
            className={`flex min-w-0 items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            }`}
          >
            <div className="flex mt-3 h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50 dark:bg-orange-500/10">
              <img
                src={Logo}
                alt="PrintTech"
                className="h-9 w-9 object-contain"
              />
            </div>

            {sidebarOpen && (
              <div className="min-w-0 mt-10 mb-5">
                <h1 className="text-[18px] font-bold leading-none tracking-tight text-slate-900 dark:text-white">
                  Print
                  <span className="text-orange-500">Tech</span>
                </h1>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {pressName}
                  </p>
                </div>
              </div>
            )}
          </NavLink>

          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="ml-2 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:flex"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <FiChevronLeft size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* EXPAND SIDEBAR BUTTON */}
        {!sidebarOpen && (
          <div className="hidden justify-center border-b border-slate-100 py-3 dark:border-slate-800 lg:flex">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-slate-800"
              title="Open sidebar"
              aria-label="Expand sidebar"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
          {sidebarOpen && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Workspace
            </p>
          )}

          <div className="space-y-1.5">
            {/* DASHBOARD */}
            <NavLink
              to="/staff"
              end
              onClick={handleNavigation}
              className={navClass}
              title={!sidebarOpen ? "Dashboard" : ""}
            >
              <FiBarChart2 className="shrink-0" size={18} />
              {sidebarOpen && (
                <span className="text-sm font-medium">Dashboard</span>
              )}
            </NavLink>

            {/* MY TASKS */}
            <NavLink
              to="/staff/tasks"
              onClick={handleNavigation}
              className={navClass}
              title={!sidebarOpen ? "My Tasks" : ""}
            >
              <FiCheckSquare className="shrink-0" size={18} />
              {sidebarOpen && (
                <span className="text-sm font-medium">My Tasks</span>
              )}
            </NavLink>

            {/* ============================= */}
            {/* PROJECTS (dropdown) */}
            {/* ============================= */}
            <div className="group relative overflow-visible">
              <button
                type="button"
                onClick={() => {
                  if (sidebarOpen) setProjectOpen((p) => !p);
                }}
                className={`
                  flex w-full items-center rounded-xl transition-all duration-200
                  ${
                    isProjectSection
                      ? "bg-orange-500 text-white shadow-sm shadow-orange-200 dark:shadow-none"
                      : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                  }
                  ${sidebarOpen ? "gap-3 px-3 py-3" : "justify-center px-2 py-3"}
                `}
                title={!sidebarOpen ? "Projects" : ""}
              >
                <FiFolder className="shrink-0" size={18} />

                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">
                      Projects
                    </span>

                    {projectOpen ? (
                      <FiChevronDown size={14} />
                    ) : (
                      <FiChevronRight size={14} />
                    )}
                  </>
                )}
              </button>

              {/* Collapsed flyout */}
              {!sidebarOpen && (
                <CollapsedSubMenu>
                  <CollapsedSubItem
                    to="/staff/projects"
                    end
                    icon={<FiFolder size={12} />}
                  >
                    All Projects
                  </CollapsedSubItem>

                  <CollapsedSubItem
                    to="/staff/projects/add"
                    icon={<FiPlus size={12} />}
                  >
                    Add Project
                  </CollapsedSubItem>
                </CollapsedSubMenu>
              )}

              {/* Expanded submenu */}
              {sidebarOpen && projectOpen && (
                <div className="mt-1 space-y-1 pl-7">
                  <NavLink
                    to="/staff/projects"
                    end
                    onClick={handleNavigation}
                    className={subNavClass}
                  >
                    <FiFolder size={14} />
                    <span>All Projects</span>
                  </NavLink>

                  <NavLink
                    to="/staff/projects/add"
                    onClick={handleNavigation}
                    className={subNavClass}
                  >
                    <FiPlus size={14} />
                    <span>Add Project</span>
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/staff/payment"
              onClick={handleNavigation}
              className={navClass}
              title={!sidebarOpen ? "payment" : ""}
            >
              <FaRegMoneyBillAlt className="shrink-0" size={18} />
              {sidebarOpen && (
                <span className="text-sm font-medium">Payment</span>
              )}
            </NavLink>

            {/* ============================= */}
            {/* CUSTOMERS (dropdown) */}
            {/* ============================= */}
            <div className="group relative overflow-visible">
              <button
                type="button"
                onClick={() => {
                  if (sidebarOpen) setCustomerOpen((p) => !p);
                }}
                className={`
                  flex w-full items-center rounded-xl transition-all duration-200
                  ${
                    isCustomerSection
                      ? "bg-orange-500 text-white shadow-sm shadow-orange-200 dark:shadow-none"
                      : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                  }
                  ${sidebarOpen ? "gap-3 px-3 py-3" : "justify-center px-2 py-3"}
                `}
                title={!sidebarOpen ? "Customers" : ""}
              >
                <FiUsers className="shrink-0" size={18} />

                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">
                      Customers
                    </span>

                    {customerOpen ? (
                      <FiChevronDown size={14} />
                    ) : (
                      <FiChevronRight size={14} />
                    )}
                  </>
                )}
              </button>

              {/* Collapsed flyout */}
              {!sidebarOpen && (
                <CollapsedSubMenu>
                  <CollapsedSubItem
                    to="/staff/customers"
                    end
                    icon={<FiUsers size={12} />}
                  >
                    All Customers
                  </CollapsedSubItem>

                  <CollapsedSubItem
                    to="/staff/customers/add"
                    icon={<FiPlus size={12} />}
                  >
                    Add Customer
                  </CollapsedSubItem>
                </CollapsedSubMenu>
              )}

              {/* Expanded submenu */}
              {sidebarOpen && customerOpen && (
                <div className="mt-1 space-y-1 pl-7">
                  <NavLink
                    to="/staff/customers"
                    end
                    onClick={handleNavigation}
                    className={subNavClass}
                  >
                    <FiUsers size={14} />
                    <span>All Customers</span>
                  </NavLink>

                  <NavLink
                    to="/staff/customers/add"
                    onClick={handleNavigation}
                    className={subNavClass}
                  >
                    <FiPlus size={14} />
                    <span>Add Customer</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* SETTING */}
            <NavLink
              to="/staff/profile"
              onClick={handleNavigation}
              className={navClass}
              title={!sidebarOpen ? "Setting" : ""}
            >
              <IoSettingsOutline className="shrink-0" size={18} />
              {sidebarOpen && (
                <span className="text-sm font-medium">Setting</span>
              )}
            </NavLink>
          </div>
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-slate-100 p-3 dark:border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : ""}
            className={`group flex w-full items-center rounded-xl text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 ${
              sidebarOpen ? "gap-3 px-3 py-3" : "justify-center px-2 py-3"
            }`}
          >
            <FiLogOut className="shrink-0" size={18} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:h-20 sm:px-5 md:px-8 dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-orange-50 hover:text-orange-500 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
              title="Open menu"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium uppercase tracking-wider text-orange-500 sm:text-xs">
                Staff Workspace
              </p>

              <p className="mt-0.5 hidden text-xs text-slate-400 sm:block">
                Welcome back, {staffName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="mr-2 rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-orange-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400 sm:mr-3"
            >
              <FaRegBell />
            </button>
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="mr-2 rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-orange-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400 sm:mr-3"
              aria-label="Toggle theme"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? <FiSun size={19} /> : <FiMoon size={19} />}
            </button>

            <div className="hidden max-w-44 text-right sm:block">
              <p
                className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100"
                title={staffName}
              >
                {staffName}
              </p>

              <p className="text-xs capitalize text-slate-400 dark:text-slate-500">
                {staffRole}
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600 ring-4 ring-orange-50 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/5 sm:h-10 sm:w-10">
              {userInitial}
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
