import { useEffect, useState } from "react";
import {
  FaThLarge,
  FaFolder,
  FaCog,
  FaChartBar,
  FaUsers,
  FaChevronDown,
  FaChevronRight,
  FaBell,
  FaPlus,
} from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.jpeg";

const Sidebar = ({ sideBarOpen, setSideBarOpen }) => {
  const location = useLocation();

  const [reportOpen, setReportOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);

  const isReportSection = location.pathname.startsWith("/reports");
  const isProjectSection = location.pathname.startsWith("/projects");
  const isCustomerSection = location.pathname.startsWith("/customers");

  useEffect(() => {
    if (isProjectSection && sideBarOpen) {
      setProjectOpen(true);
    }

    if (isCustomerSection && sideBarOpen) {
      setCustomerOpen(true);
    }

    if (isReportSection && sideBarOpen) {
      setReportOpen(true);
    }
  }, [isProjectSection, isCustomerSection, isReportSection, sideBarOpen]);

  // Close dropdowns when sidebar collapses
  useEffect(() => {
    if (!sideBarOpen) {
      setProjectOpen(false);
      setCustomerOpen(false);
      setReportOpen(false);
    }
  }, [sideBarOpen]);

  // Main navigation style
  const mainNavClass = ({ isActive }) =>
    `group relative flex items-center rounded-xl transition-all duration-200 ${
      sideBarOpen ? "gap-3 px-3 py-2.5" : "justify-center px-2 py-3"
    } ${
      isActive
        ? "bg-orange-500 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

  // Sub navigation style
  const subNavClass = ({ isActive }) =>
    `flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
      isActive
        ? "bg-orange-50 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
    }`;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col overflow-visible border-r shadow-sm transition-all duration-300
        bg-white border-slate-200
        dark:bg-slate-900 dark:border-slate-800
        ${sideBarOpen ? "w-64" : "w-[76px]"}
      `}
    >
      {/* =====================================================
          HEADER / LOGO
      ====================================================== */}
      <div
        className={`relative flex h-20 shrink-0 items-center border-b
          border-slate-100 dark:border-slate-800
          ${sideBarOpen ? "justify-between px-5" : "justify-center px-2"}
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center ${
            sideBarOpen ? "gap-3" : "justify-center"
          }`}
        >
          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              overflow-hidden rounded-xl border
              border-slate-200 bg-slate-50
              dark:border-slate-700 dark:bg-slate-800
            "
          >
            <img
              src={Logo}
              alt="PrintTech"
              className="h-full w-full object-contain"
            />
          </div>

          {sideBarOpen && (
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                PrintTech
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Printing System
              </p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        {sideBarOpen && (
          <button
            type="button"
            onClick={() => setSideBarOpen(false)}
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              text-slate-400 transition
              hover:bg-slate-100 hover:text-slate-700
              dark:hover:bg-slate-800 dark:hover:text-slate-200
            "
            aria-label="Collapse sidebar"
          >
            <IoIosArrowBack className="text-lg" />
          </button>
        )}

        {/* Expand Button */}
        {!sideBarOpen && (
          <button
            type="button"
            onClick={() => setSideBarOpen(true)}
            className="
              absolute -right-3 top-6 z-50 flex h-7 w-7
              items-center justify-center rounded-full border
              border-slate-200 bg-white text-slate-500 shadow-sm
              transition hover:border-orange-300 hover:text-orange-600
              dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400
              dark:hover:border-orange-500 dark:hover:text-orange-400
            "
            aria-label="Expand sidebar"
          >
            <IoIosArrowForward className="text-sm" />
          </button>
        )}
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className="flex-1 overflow-visible px-3 py-5">
        {/* =====================================================
            DASHBOARD
        ====================================================== */}
        <NavLink
          to="/dashboard"
          end
          className={mainNavClass}
          title={!sideBarOpen ? "Dashboard" : ""}
        >
          <FaThLarge className="shrink-0 text-sm" />

          {sideBarOpen && <span className="font-medium">Dashboard</span>}
        </NavLink>

        {/* =====================================================
            PROJECTS
        ====================================================== */}
        <div className="group relative mt-1">
          <button
            type="button"
            onClick={() => {
              if (!sideBarOpen) {
                setSideBarOpen(true);
                setProjectOpen(true);
                return;
              }

              setProjectOpen((prev) => !prev);
            }}
            className={`flex w-full items-center rounded-xl transition-all duration-200 ${
              sideBarOpen
                ? "justify-between px-3 py-2.5"
                : "justify-center px-2 py-3"
            } ${
              isProjectSection
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
            title={!sideBarOpen ? "Projects" : ""}
          >
            <div
              className={`flex items-center ${
                sideBarOpen ? "gap-3" : "justify-center"
              }`}
            >
              <FaFolder className="shrink-0 text-sm" />

              {sideBarOpen && <span className="font-medium">Projects</span>}
            </div>

            {sideBarOpen &&
              (projectOpen ? (
                <FaChevronDown className="text-[10px]" />
              ) : (
                <FaChevronRight className="text-[10px]" />
              ))}
          </button>

          {/* Collapsed Project Menu */}
          {!sideBarOpen && (
            <div className="pointer-events-none absolute left-[68px] top-0 z-[999] hidden w-48 group-hover:pointer-events-auto group-hover:block">
              <div className="absolute -left-3 top-0 h-full w-3" />

              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Projects
                  </p>
                </div>

                <div className="mt-1">
                  <NavLink
                    to="/projects"
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`
                    }
                  >
                    All Projects
                  </NavLink>

                  <NavLink
                    to="/projects/create-project"
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`
                    }
                  >
                    <FaPlus className="text-[9px]" />
                    Create Project
                  </NavLink>
                </div>
              </div>
            </div>
          )}

          {/* Expanded Project Menu */}
          {sideBarOpen && projectOpen && (
            <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 pl-2 dark:border-slate-700">
              <NavLink to="/projects" end className={subNavClass}>
                All Projects
              </NavLink>

              <NavLink to="/projects/create-project" className={subNavClass}>
                <FaPlus className="mr-2 text-[9px]" />
                Create Project
              </NavLink>
            </div>
          )}
        </div>

        {/* =====================================================
            CUSTOMERS
        ====================================================== */}
        <div className="group relative mt-1">
          <button
            type="button"
            onClick={() => {
              if (!sideBarOpen) {
                setSideBarOpen(true);
                setCustomerOpen(true);
                return;
              }

              setCustomerOpen((prev) => !prev);
            }}
            className={`flex w-full items-center rounded-xl transition-all duration-200 ${
              sideBarOpen
                ? "justify-between px-3 py-2.5"
                : "justify-center px-2 py-3"
            } ${
              isCustomerSection
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
            title={!sideBarOpen ? "Customers" : ""}
          >
            <div
              className={`flex items-center ${
                sideBarOpen ? "gap-3" : "justify-center"
              }`}
            >
              <FaUsers className="shrink-0 text-sm" />

              {sideBarOpen && <span className="font-medium">Customers</span>}
            </div>

            {sideBarOpen &&
              (customerOpen ? (
                <FaChevronDown className="text-[10px]" />
              ) : (
                <FaChevronRight className="text-[10px]" />
              ))}
          </button>

          {/* Collapsed Customer Menu */}
          {!sideBarOpen && (
            <div className="pointer-events-none absolute left-[68px] top-0 z-[999] hidden w-48 group-hover:pointer-events-auto group-hover:block">
              <div className="absolute -left-3 top-0 h-full w-3" />

              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Customers
                  </p>
                </div>

                <div className="mt-1">
                  <NavLink
                    to="/customers"
                    end
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`
                    }
                  >
                    All Customers
                  </NavLink>

                  <NavLink
                    to="/customers/add"
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`
                    }
                  >
                    <FaPlus className="text-[9px]" />
                    Add Customer
                  </NavLink>
                </div>
              </div>
            </div>
          )}

          {/* Expanded Customer Menu */}
          {sideBarOpen && customerOpen && (
            <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 pl-2 dark:border-slate-700">
              <NavLink to="/customers" end className={subNavClass}>
                All Customers
              </NavLink>

              <NavLink to="/customers/add" className={subNavClass}>
                <FaPlus className="mr-2 text-[9px]" />
                Add Customer
              </NavLink>
            </div>
          )}
        </div>

        {/* =====================================================
            REPORTS
        ====================================================== */}
        <div className="group relative mt-1">
          <button
            type="button"
            onClick={() => {
              if (!sideBarOpen) {
                setSideBarOpen(true);
                setReportOpen(true);
                return;
              }

              setReportOpen((prev) => !prev);
            }}
            className={`flex w-full items-center rounded-xl transition-all duration-200 ${
              sideBarOpen
                ? "justify-between px-3 py-2.5"
                : "justify-center px-2 py-3"
            } ${
              isReportSection
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
            title={!sideBarOpen ? "Reports" : ""}
          >
            <div
              className={`flex items-center ${
                sideBarOpen ? "gap-3" : "justify-center"
              }`}
            >
              <FaChartBar className="shrink-0 text-sm" />

              {sideBarOpen && <span className="font-medium">Reports</span>}
            </div>

            {sideBarOpen &&
              (reportOpen ? (
                <FaChevronDown className="text-[10px]" />
              ) : (
                <FaChevronRight className="text-[10px]" />
              ))}
          </button>

          {/* Collapsed Reports Menu */}
          {!sideBarOpen && (
            <div className="pointer-events-none absolute left-[68px] top-0 z-[999] hidden w-48 group-hover:pointer-events-auto group-hover:block">
              <div className="absolute -left-3 top-0 h-full w-3" />

              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Reports
                  </p>
                </div>

                <div className="mt-1">
                  <NavLink
                    to="/reports/sales"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`
                    }
                  >
                    Sales Report
                  </NavLink>

                  <NavLink
                    to="/reports/customers"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`
                    }
                  >
                    Customer Report
                  </NavLink>

                  <NavLink
                    to="/reports/payments"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`
                    }
                  >
                    Payment Report
                  </NavLink>
                </div>
              </div>
            </div>
          )}

          {/* Expanded Reports Menu */}
          {sideBarOpen && reportOpen && (
            <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 pl-2 dark:border-slate-700">
              <NavLink to="/reports/sales" className={subNavClass}>
                Sales Report
              </NavLink>

              <NavLink to="/reports/customers" className={subNavClass}>
                Customer Report
              </NavLink>

              <NavLink to="/reports/payments" className={subNavClass}>
                Payment Report
              </NavLink>
            </div>
          )}
        </div>

        {/* =====================================================
            NOTIFICATIONS
        ====================================================== */}
        <NavLink
          to="/notifications"
          className={mainNavClass}
          title={!sideBarOpen ? "Notifications" : ""}
        >
          <div className="relative">
            <FaBell className="shrink-0 text-sm" />

            <span className="absolute -right-1.5 -top-1.5 h-2 w-2 rounded-full border-2 border-white bg-orange-500 dark:border-slate-900" />
          </div>

          {sideBarOpen && (
            <div className="flex flex-1 items-center justify-between">
              <span className="font-medium">Notifications</span>
            </div>
          )}
        </NavLink>

        {/* =====================================================
            SETTINGS
        ====================================================== */}
        <NavLink
          to="/settings"
          className={mainNavClass}
          title={!sideBarOpen ? "Settings" : ""}
        >
          <FaCog className="shrink-0 text-sm" />

          {sideBarOpen && <span className="font-medium">Settings</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
