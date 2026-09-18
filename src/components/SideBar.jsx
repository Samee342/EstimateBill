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
  FaSlidersH,
  FaBroom,
  FaSignOutAlt,
  FaRegTrashAlt,
} from "react-icons/fa";

import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

import Logo from "../assets/Logo.jpeg";

const Sidebar = ({ sideBarOpen, setSideBarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [reportOpen, setReportOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);

  const isProjectSection = location.pathname.startsWith("/projects");
  const isCustomerSection = location.pathname.startsWith("/customers");
  const isReportSection = location.pathname.startsWith("/reports");
  const isSettingSection = location.pathname.startsWith("/settings");

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    navigate("/login", {
      replace: true,
    });
  };

  // Automatically open the active section
  useEffect(() => {
    if (!sideBarOpen) return;

    if (isProjectSection) {
      setProjectOpen(true);
    }

    if (isCustomerSection) {
      setCustomerOpen(true);
    }

    if (isReportSection) {
      setReportOpen(true);
    }

    if (isSettingSection) {
      setSettingOpen(true);
    }
  }, [
    sideBarOpen,
    isProjectSection,
    isCustomerSection,
    isReportSection,
    isSettingSection,
  ]);

  // Close dropdowns when sidebar is collapsed
  useEffect(() => {
    if (!sideBarOpen) {
      setProjectOpen(false);
      setCustomerOpen(false);
      setReportOpen(false);
      setSettingOpen(false);
    }
  }, [sideBarOpen]);

  const mainNavClass = ({ isActive }) =>
    `group flex items-center ${
      sideBarOpen ? "gap-3 px-4" : "justify-center px-0"
    } h-11 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-orange-500 text-white"
        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
    }`;

  const subNavClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 ${
      isActive
        ? "bg-orange-50 font-medium text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
        : "text-slate-600 hover:bg-slate-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
    }`;

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 ${
        sideBarOpen ? "w-64" : "w-[76px]"
      }`}
    >
      {/* ================= HEADER ================= */}
      <div
        className={`flex h-[72px] shrink-0 items-center border-b border-slate-200 dark:border-slate-700 ${
          sideBarOpen ? "justify-between px-4" : "justify-center"
        }`}
      >
        {sideBarOpen && (
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={Logo}
              alt="PrintTech"
              className="h-10 w-10 rounded-lg object-cover"
            />

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900 dark:text-white">
                PrintTech
              </h1>

              <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                Printing System
              </p>
            </div>
          </div>
        )}

        {!sideBarOpen && (
          <img
            src={Logo}
            alt="PrintTech"
            className="h-10 w-10 rounded-lg object-cover"
          />
        )}

        {sideBarOpen && (
          <button
            type="button"
            onClick={() => setSideBarOpen(false)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            title="Collapse sidebar"
          >
            <IoIosArrowBack size={18} />
          </button>
        )}
      </div>

      {/* ================= EXPAND BUTTON ================= */}
      {!sideBarOpen && (
        <button
          type="button"
          onClick={() => setSideBarOpen(true)}
          className="absolute -right-3 top-[78px] flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          title="Expand sidebar"
        >
          <IoIosArrowForward size={15} />
        </button>
      )}

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-1">
          {/* Dashboard */}
          <NavLink to="/dashboard" className={mainNavClass}>
            <FaThLarge size={17} className="shrink-0" />

            {sideBarOpen && <span>Dashboard</span>}
          </NavLink>

          {/* ================= PROJECTS ================= */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setProjectOpen((prev) => !prev);
                }
              }}
              className={`flex h-11 w-full items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                isProjectSection
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
              } ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}`}
            >
              <FaFolder size={17} className="shrink-0" />

              {sideBarOpen && (
                <>
                  <span className="flex-1 text-left">Projects</span>

                  {projectOpen ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  )}
                </>
              )}
            </button>

            {/* Collapsed Projects Flyout */}
            {!sideBarOpen && (
              <div className="absolute left-[68px] top-0 z-[999] hidden w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-lg group-hover:block dark:border-slate-700 dark:bg-slate-900">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Projects
                </p>

                <NavLink to="/projects" className={subNavClass}>
                  <FaFolder size={14} />
                  <span>All Projects</span>
                </NavLink>

                <NavLink to="/projects/create-project" className={subNavClass}>
                  <FaPlus size={14} />
                  <span>Create Project</span>
                </NavLink>
              </div>
            )}

            {/* Expanded Projects */}
            {sideBarOpen && projectOpen && (
              <div className="mt-1 space-y-1 pl-7">
                <NavLink to="/projects" end className={subNavClass}>
                  <FaFolder size={14} />
                  <span>All Projects</span>
                </NavLink>

                <NavLink to="/projects/create-project" className={subNavClass}>
                  <FaPlus size={14} />
                  <span>Create Project</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* ================= CUSTOMERS ================= */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setCustomerOpen((prev) => !prev);
                }
              }}
              className={`flex h-11 w-full items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                isCustomerSection
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
              } ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}`}
            >
              <FaUsers size={17} className="shrink-0" />

              {sideBarOpen && (
                <>
                  <span className="flex-1 text-left">Customers</span>

                  {customerOpen ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  )}
                </>
              )}
            </button>

            {/* Collapsed Customers Flyout */}
            {!sideBarOpen && (
              <div className="absolute left-[68px] top-0 z-[999] hidden w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-lg group-hover:block dark:border-slate-700 dark:bg-slate-900">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Customers
                </p>

                <NavLink to="/customers" end className={subNavClass}>
                  <FaUsers size={14} />
                  <span>All Customers</span>
                </NavLink>

                <NavLink to="/customers/add" className={subNavClass}>
                  <FaPlus size={14} />
                  <span>Add Customer</span>
                </NavLink>
              </div>
            )}

            {/* Expanded Customers */}
            {sideBarOpen && customerOpen && (
              <div className="mt-1 space-y-1 pl-7">
                <NavLink to="/customers" end className={subNavClass}>
                  <FaUsers size={14} />
                  <span>All Customers</span>
                </NavLink>

                <NavLink to="/customers/add" className={subNavClass}>
                  <FaPlus size={14} />
                  <span>Add Customer</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* ================= REPORTS ================= */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setReportOpen((prev) => !prev);
                }
              }}
              className={`flex h-11 w-full items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                isReportSection
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
              } ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}`}
            >
              <FaChartBar size={17} className="shrink-0" />

              {sideBarOpen && (
                <>
                  <span className="flex-1 text-left">Reports</span>

                  {reportOpen ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  )}
                </>
              )}
            </button>

            {/* Collapsed Reports Flyout */}
            {!sideBarOpen && (
              <div className="absolute left-[68px] top-0 z-[999] hidden w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-lg group-hover:block dark:border-slate-700 dark:bg-slate-900">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Reports
                </p>

                <NavLink to="/reports/sales" className={subNavClass}>
                  <FaChartBar size={14} />
                  <span>Sales Report</span>
                </NavLink>

                <NavLink to="/reports/customers" className={subNavClass}>
                  <FaUsers size={14} />
                  <span>Customer Report</span>
                </NavLink>

                <NavLink to="/reports/payments" className={subNavClass}>
                  <FaSlidersH size={14} />
                  <span>Payment Report</span>
                </NavLink>
              </div>
            )}

            {/* Expanded Reports */}
            {sideBarOpen && reportOpen && (
              <div className="mt-1 space-y-1 pl-7">
                <NavLink to="/reports/sales" className={subNavClass}>
                  <FaChartBar size={14} />
                  <span>Sales Report</span>
                </NavLink>

                <NavLink to="/reports/customers" className={subNavClass}>
                  <FaUsers size={14} />
                  <span>Customer Report</span>
                </NavLink>

                <NavLink to="/reports/payments" className={subNavClass}>
                  <FaSlidersH size={14} />
                  <span>Payment Report</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* ================= NOTIFICATIONS ================= */}
          <NavLink to="/notifications" className={mainNavClass}>
            <FaBell size={17} className="shrink-0" />

            {sideBarOpen && <span>Notifications</span>}
          </NavLink>

          {/* ================= SETTINGS ================= */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setSettingOpen((prev) => !prev);
                }
              }}
              className={`flex h-11 w-full items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                isSettingSection
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
              } ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}`}
            >
              <FaCog size={17} className="shrink-0" />

              {sideBarOpen && (
                <>
                  <span className="flex-1 text-left">Settings</span>

                  {settingOpen ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  )}
                </>
              )}
            </button>

            {/* Collapsed Settings Flyout */}
            {!sideBarOpen && (
              <div className="absolute left-[68px] top-0 z-[999] hidden w-52 rounded-lg border border-slate-200 bg-white p-2 shadow-lg group-hover:block dark:border-slate-700 dark:bg-slate-900">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Settings
                </p>

                <NavLink to="/settings/studio" className={subNavClass}>
                  <FaCog size={14} />
                  <span>Studio Settings</span>
                </NavLink>

                <NavLink to="/settings/reset-cleanup" className={subNavClass}>
                  <FaBroom size={14} />
                  <span>Reset & Cleanup</span>
                </NavLink>
              </div>
            )}

            {/* Expanded Settings */}
            {sideBarOpen && settingOpen && (
              <div className="mt-1 space-y-1 pl-7">
                <NavLink to="/settings/studio" className={subNavClass}>
                  <FaCog size={14} />
                  <span>Studio Settings</span>
                </NavLink>

                <NavLink to="/settings/reset-cleanup" className={subNavClass}>
                  <FaBroom size={14} />
                  <span>Reset & Cleanup</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* ================= TRASH ================= */}
          <NavLink to="/trash" className={mainNavClass}>
            <FaRegTrashAlt size={17} className="shrink-0" />

            {sideBarOpen && <span>Trash</span>}
          </NavLink>
        </div>
      </nav>

      {/* ================= LOGOUT ================= */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-700">
        <button
          type="button"
          onClick={handleLogout}
          className={`flex h-11 w-full items-center rounded-lg text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 ${
            sideBarOpen ? "gap-3 px-4" : "justify-center px-0"
          }`}
        >
          <FaSignOutAlt size={17} className="shrink-0" />

          {sideBarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
