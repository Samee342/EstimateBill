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
  }, [isProjectSection, isCustomerSection, sideBarOpen]);

  // =========================================
  // CLOSE DROPDOWNS WHEN SIDEBAR COLLAPSES
  // =========================================
  useEffect(() => {
    if (!sideBarOpen) {
      setProjectOpen(false);
      setCustomerOpen(false);
    }
  }, [sideBarOpen]);

  // =========================================
  // MAIN NAVIGATION STYLE
  // =========================================
  const mainNavClass = ({ isActive }) =>
    `group relative flex items-center rounded-xl transition-all duration-200 ${
      sideBarOpen ? "gap-3 px-3 py-2.5" : "justify-center px-2 py-3"
    } ${
      isActive
        ? "bg-orange-500 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
    }`;

  // =========================================
  // SUB NAVIGATION STYLE
  // =========================================
  const subNavClass = ({ isActive }) =>
    `flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
      isActive
        ? "bg-orange-50 font-semibold text-orange-600"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
    }`;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col overflow-visible border-r border-slate-200 bg-white shadow-sm transition-all duration-300 ${
        sideBarOpen ? "w-64" : "w-[76px]"
      }`}
    >
      {/* =====================================================
          HEADER / LOGO
      ====================================================== */}
      <div
        className={`relative flex h-20 shrink-0 items-center border-b border-slate-100 ${
          sideBarOpen ? "justify-between px-5" : "justify-center px-2"
        }`}
      >
        {/* Logo */}
        <div
          className={`flex items-center ${
            sideBarOpen ? "gap-3" : "justify-center"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img
              src={Logo}
              alt="PrintTech"
              className="h-full w-full object-contain"
            />
          </div>

          {sideBarOpen && (
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-slate-900">
                PrintTech
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Printing System
              </p>
            </div>
          )}
        </div>

        {/* =========================================
            COLLAPSE BUTTON
        ========================================== */}
        {sideBarOpen && (
          <button
            type="button"
            onClick={() => setSideBarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Collapse sidebar"
          >
            <IoIosArrowBack className="text-lg" />
          </button>
        )}

        {/* =========================================
            EXPAND BUTTON
        ========================================== */}
        {!sideBarOpen && (
          <button
            type="button"
            onClick={() => setSideBarOpen(true)}
            className="absolute -right-3 top-6 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
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
        {/* =========================================
            DASHBOARD
        ========================================== */}
        <NavLink
          to="/"
          end
          className={mainNavClass}
          title={!sideBarOpen ? "Dashboard" : ""}
        >
          <FaThLarge className="shrink-0 text-sm" />

          {sideBarOpen && <span className="font-medium">Dashboard</span>}
        </NavLink>

        {/* ===================================================
            PROJECTS
        ==================================================== */}
        <div className="relative group mt-1">
          {/* Project Button */}
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
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
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

          {/* =========================================
              COLLAPSED PROJECT HOVER MENU
          ========================================== */}
          {!sideBarOpen && (
            <div className="pointer-events-none absolute left-[68px] top-0 z-[999] hidden w-48 group-hover:pointer-events-auto group-hover:block">
              {/* Invisible bridge */}
              <div className="absolute -left-3 top-0 h-full w-3" />

              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">
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
                          ? "bg-orange-50 font-semibold text-orange-600"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                          ? "bg-orange-50 font-semibold text-orange-600"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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

          {/* =========================================
              EXPANDED PROJECT SUBMENU
          ========================================== */}
          {sideBarOpen && projectOpen && (
            <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 pl-2">
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

        {/* ===================================================
            CUSTOMERS
        ==================================================== */}
        <div className="relative group mt-1">
          {/* Customer Button */}
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
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
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

          {/* =========================================
              COLLAPSED CUSTOMER HOVER MENU
          ========================================== */}
          {!sideBarOpen && (
            <div className="pointer-events-none absolute left-[68px] top-0 z-[999] hidden w-48 group-hover:pointer-events-auto group-hover:block">
              {/* Invisible bridge */}
              <div className="absolute -left-3 top-0 h-full w-3" />

              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">
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
                          ? "bg-orange-50 font-semibold text-orange-600"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                          ? "bg-orange-50 font-semibold text-orange-600"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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

          {/* =========================================
              EXPANDED CUSTOMER SUBMENU
          ========================================== */}
          {sideBarOpen && customerOpen && (
            <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 pl-2">
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

        {/* =========================================
            REPORTS
        ========================================== */}
        <div className="relative group mt-1">
          {/* Reports Button */}
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
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
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

          {/* =========================================
      COLLAPSED REPORT HOVER MENU
  ========================================== */}
          {!sideBarOpen && (
            <div className="pointer-events-none absolute left-[68px] top-0 z-[999] hidden w-48 group-hover:pointer-events-auto group-hover:block">
              {/* Invisible bridge */}
              <div className="absolute -left-3 top-0 h-full w-3" />

              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Reports
                  </p>
                </div>

                <div className="mt-1">
                  {/* Sales Report */}
                  <NavLink
                    to="/reports/sales"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    Sales Report
                  </NavLink>

                  {/* Customer Report */}
                  <NavLink
                    to="/reports/customers"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    Customer Report
                  </NavLink>

                  {/* Payment Report */}
                  <NavLink
                    to="/reports/payments"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-orange-50 font-semibold text-orange-600"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    Payment Report
                  </NavLink>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
      EXPANDED REPORT SUBMENU
  ========================================== */}
          {sideBarOpen && reportOpen && (
            <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 pl-2">
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
        {/* =========================================
            NOTIFICATIONS
        ========================================== */}
        <NavLink
          to="/notifications"
          className={mainNavClass}
          title={!sideBarOpen ? "Notifications" : ""}
        >
          <div className="relative">
            <FaBell className="shrink-0 text-sm" />

            {/* Notification Indicator */}
            <span className="absolute -right-1.5 -top-1.5 h-2 w-2 rounded-full border-2 border-white bg-orange-500" />
          </div>

          {sideBarOpen && (
            <div className="flex flex-1 items-center justify-between">
              <span className="font-medium">Notifications</span>
            </div>
          )}
        </NavLink>

        {/* =========================================
            SETTINGS
        ========================================== */}
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
