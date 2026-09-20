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

import Logo from "../assets/Logo.png";

const Sidebar = ({ sideBarOpen, setSideBarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // DROPDOWN STATES
  // =====================================================

  const [reportOpen, setReportOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);

  // =====================================================
  // ACTIVE SECTIONS
  // =====================================================

  const isProjectSection = location.pathname.startsWith("/projects");

  const isCustomerSection = location.pathname.startsWith("/customers");

  const isTeamSection = location.pathname.startsWith("/team");

  const isReportSection = location.pathname.startsWith("/reports");

  const isSettingSection = location.pathname.startsWith("/settings");

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // AUTOMATICALLY OPEN ACTIVE SECTION
  // =====================================================

  useEffect(() => {
    if (!sideBarOpen) return;

    if (isProjectSection) {
      setProjectOpen(true);
    }

    if (isCustomerSection) {
      setCustomerOpen(true);
    }

    if (isTeamSection) {
      setTeamOpen(true);
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
    isTeamSection,
    isReportSection,
    isSettingSection,
  ]);

  // =====================================================
  // CLOSE DROPDOWNS WHEN SIDEBAR COLLAPSES
  // =====================================================

  useEffect(() => {
    if (!sideBarOpen) {
      setProjectOpen(false);
      setCustomerOpen(false);
      setTeamOpen(false);
      setReportOpen(false);
      setSettingOpen(false);
    }
  }, [sideBarOpen]);

  // =====================================================
  // MAIN NAVIGATION CLASS
  // =====================================================

  const mainNavClass = ({ isActive }) =>
    `
      flex
      h-11
      items-center
      rounded-lg
      text-sm
      font-medium
      transition-all
      duration-200

      ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}

      ${
        isActive
          ? "bg-orange-500 text-white"
          : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
      }
    `;

  // =====================================================
  // SUB NAVIGATION CLASS
  // =====================================================

  const subNavClass = ({ isActive }) =>
    `
      flex
      items-center
      gap-3
      rounded-lg
      px-4
      py-2.5
      text-sm
      transition-all
      duration-200

      ${
        isActive
          ? "bg-orange-50 font-medium text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
          : "text-slate-600 hover:bg-slate-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
      }
    `;

  // =====================================================
  // COLLAPSED NORMAL LABEL
  // =====================================================

  const CollapsedLabel = ({ children, danger = false }) => {
    return (
      <span
        className={`
          pointer-events-none

          absolute
          left-1/2
          top-full
          z-[9999]

          mt-1
          -translate-x-1/2

          whitespace-nowrap

          rounded-md
          border

          px-2.5
          py-1

          text-[11px]
          font-medium

          opacity-0

          shadow-lg

          transition-opacity
          duration-150

          group-hover:opacity-100

          ${
            danger
              ? `
                border-red-100
                bg-white
                text-red-500
                dark:border-red-500/20
                dark:bg-slate-800
                dark:text-red-400
              `
              : `
                border-slate-200
                bg-white
                text-slate-700
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-200
              `
          }
        `}
      >
        {children}
      </span>
    );
  };

  // =====================================================
  // COLLAPSED SUBMENU
  // =====================================================

  const CollapsedSubMenu = ({ children }) => {
    return (
      <div
        className="
          absolute
          left-[68px]
          top-0
          z-[9999]

          invisible
          opacity-0

          transition-all
          duration-150

          group-hover:visible
          group-hover:opacity-100

          pointer-events-none
          group-hover:pointer-events-auto
        "
      >
        {/* Invisible bridge */}
        <div className="absolute -left-2 top-0 h-full w-2" />

        {/* Actual submenu */}
        <div
          className="
            min-w-[170px]

            rounded-lg
            border
            border-slate-200
            bg-white

            p-1.5

            shadow-lg

            dark:border-slate-700
            dark:bg-slate-800
          "
        >
          {children}
        </div>
      </div>
    );
  };

  // =====================================================
  // COLLAPSED SUBMENU ITEM
  // =====================================================

  const CollapsedSubItem = ({ to, icon, children, end = false }) => {
    return (
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `
            flex
            items-center
            gap-2

            whitespace-nowrap

            rounded-md

            px-2.5
            py-2

            text-[11px]
            font-medium

            transition-all
            duration-150

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
  };

  return (
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
        shadow-sm

        transition-all
        duration-300

        dark:border-slate-700
        dark:bg-slate-900

        ${sideBarOpen ? "w-64" : "w-[76px]"}
      `}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className={`
          flex
          h-[72px]
          shrink-0
          items-center

          border-b
          border-slate-200
          dark:border-slate-700

          ${sideBarOpen ? "justify-between px-4" : "justify-center"}
        `}
      >
        {/* LOGO + BRAND */}

        <NavLink
          to="/dashboard"
          end
          title="Go to Admin Dashboard"
          className={`
            flex
            min-w-0
            items-center
            rounded-lg
            transition-opacity
            hover:opacity-80

            ${sideBarOpen ? "gap-3" : "justify-center"}
          `}
        >
          <img
            src={Logo}
            alt="PrintTech"
            className="h-10 w-10 shrink-0 rounded-lg object-contain"
          />

          {sideBarOpen && (
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900 dark:text-white">
                Print
                <span className="text-orange-500">Tech</span>
              </h1>

              <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                Printing System
              </p>
            </div>
          )}
        </NavLink>

        {/* COLLAPSE BUTTON */}

        {sideBarOpen && (
          <button
            type="button"
            onClick={() => setSideBarOpen(false)}
            className="
              ml-2
              flex
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
            "
            title="Collapse sidebar"
          >
            <IoIosArrowBack size={18} />
          </button>
        )}
      </div>

      {/* =====================================================
          EXPAND BUTTON
      ====================================================== */}

      {!sideBarOpen && (
        <button
          type="button"
          onClick={() => setSideBarOpen(true)}
          className="
            absolute
            -right-3
            top-[78px]
            z-[60]

            flex
            h-7
            w-7
            items-center
            justify-center

            rounded-full

            border
            border-slate-200

            bg-white

            text-slate-500

            shadow-sm

            transition

            hover:text-orange-500

            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-300
          "
          title="Expand sidebar"
        >
          <IoIosArrowForward size={15} />
        </button>
      )}

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav className="flex-1 overflow-visible px-3 py-5">
        <div className="space-y-1 overflow-visible">
          {/* =================================================
              DASHBOARD
          ================================================= */}

          <div className="group relative overflow-visible">
            <NavLink
              to="/dashboard"
              end
              className={mainNavClass}
              title={!sideBarOpen ? "Dashboard" : ""}
            >
              <FaThLarge size={17} className="shrink-0" />

              {sideBarOpen && <span>Dashboard</span>}
            </NavLink>

            {!sideBarOpen && <CollapsedLabel>Dashboard</CollapsedLabel>}
          </div>

          {/* =================================================
              PROJECTS
          ================================================= */}

          <div className="group relative overflow-visible">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setProjectOpen((prev) => !prev);
                }
              }}
              className={`
                flex
                h-11
                w-full
                items-center
                rounded-lg

                text-sm
                font-medium

                transition-all
                duration-200

                ${
                  isProjectSection
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                }

                ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
              `}
              title={!sideBarOpen ? "Projects" : ""}
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

            {/* COLLAPSED PROJECTS */}

            {!sideBarOpen && (
              <CollapsedSubMenu>
                <CollapsedSubItem
                  to="/projects"
                  end
                  icon={<FaFolder size={12} />}
                >
                  All Projects
                </CollapsedSubItem>

                <CollapsedSubItem
                  to="/projects/create-project"
                  icon={<FaPlus size={12} />}
                >
                  Create Project
                </CollapsedSubItem>
              </CollapsedSubMenu>
            )}

            {/* EXPANDED PROJECTS */}

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

          {/* =================================================
              CUSTOMERS
          ================================================= */}

          <div className="group relative overflow-visible">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setCustomerOpen((prev) => !prev);
                }
              }}
              className={`
                flex
                h-11
                w-full
                items-center
                rounded-lg

                text-sm
                font-medium

                transition-all
                duration-200

                ${
                  isCustomerSection
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                }

                ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
              `}
              title={!sideBarOpen ? "Customers" : ""}
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

            {/* COLLAPSED CUSTOMERS */}

            {!sideBarOpen && (
              <CollapsedSubMenu>
                <CollapsedSubItem
                  to="/customers"
                  end
                  icon={<FaUsers size={12} />}
                >
                  All Customers
                </CollapsedSubItem>

                <CollapsedSubItem
                  to="/customers/add"
                  icon={<FaPlus size={12} />}
                >
                  Add Customer
                </CollapsedSubItem>
              </CollapsedSubMenu>
            )}

            {/* EXPANDED CUSTOMERS */}

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

          {/* =================================================
              TEAM
          ================================================= */}

          <div className="group relative overflow-visible">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setTeamOpen((prev) => !prev);
                }
              }}
              className={`
                flex
                h-11
                w-full
                items-center
                rounded-lg

                text-sm
                font-medium

                transition-all
                duration-200

                ${
                  isTeamSection
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                }

                ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
              `}
              title={!sideBarOpen ? "Team" : ""}
            >
              <FaUsers size={17} className="shrink-0" />

              {sideBarOpen && (
                <>
                  <span className="flex-1 text-left">Team</span>

                  {teamOpen ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  )}
                </>
              )}
            </button>

            {/* COLLAPSED TEAM */}

            {!sideBarOpen && (
              <CollapsedSubMenu>
                <CollapsedSubItem to="/team" end icon={<FaUsers size={12} />}>
                  All Team
                </CollapsedSubItem>

                <CollapsedSubItem to="/team/add" icon={<FaPlus size={12} />}>
                  Add Team Member
                </CollapsedSubItem>
              </CollapsedSubMenu>
            )}

            {/* EXPANDED TEAM */}

            {sideBarOpen && teamOpen && (
              <div className="mt-1 space-y-1 pl-7">
                <NavLink to="/team" end className={subNavClass}>
                  <FaUsers size={14} />

                  <span>All Team</span>
                </NavLink>

                <NavLink to="/team/add" className={subNavClass}>
                  <FaPlus size={14} />

                  <span>Add Team Member</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* =================================================
              REPORTS
          ================================================= */}

          <div className="group relative overflow-visible">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setReportOpen((prev) => !prev);
                }
              }}
              className={`
                flex
                h-11
                w-full
                items-center
                rounded-lg

                text-sm
                font-medium

                transition-all
                duration-200

                ${
                  isReportSection
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                }

                ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
              `}
              title={!sideBarOpen ? "Reports" : ""}
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

            {/* COLLAPSED REPORTS */}

            {!sideBarOpen && (
              <CollapsedSubMenu>
                <CollapsedSubItem
                  to="/reports/sales"
                  icon={<FaChartBar size={12} />}
                >
                  Sales Report
                </CollapsedSubItem>

                <CollapsedSubItem
                  to="/reports/customers"
                  icon={<FaUsers size={12} />}
                >
                  Customer Report
                </CollapsedSubItem>

                <CollapsedSubItem
                  to="/reports/payments"
                  icon={<FaSlidersH size={12} />}
                >
                  Payment Report
                </CollapsedSubItem>
              </CollapsedSubMenu>
            )}

            {/* EXPANDED REPORTS */}

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

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="group relative overflow-visible">
            <NavLink
              to="/notifications"
              end
              className={mainNavClass}
              title={!sideBarOpen ? "Notifications" : ""}
            >
              <FaBell size={17} className="shrink-0" />

              {sideBarOpen && <span>Notifications</span>}
            </NavLink>

            {!sideBarOpen && <CollapsedLabel>Notifications</CollapsedLabel>}
          </div>

          {/* =================================================
              SETTINGS
          ================================================= */}

          <div className="group relative overflow-visible">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setSettingOpen((prev) => !prev);
                }
              }}
              className={`
                flex
                h-11
                w-full
                items-center
                rounded-lg

                text-sm
                font-medium

                transition-all
                duration-200

                ${
                  isSettingSection
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                }

                ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
              `}
              title={!sideBarOpen ? "Settings" : ""}
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

            {/* COLLAPSED SETTINGS */}

            {!sideBarOpen && (
              <CollapsedSubMenu>
                <CollapsedSubItem
                  to="/settings/studio"
                  icon={<FaCog size={12} />}
                >
                  Studio Settings
                </CollapsedSubItem>

                <CollapsedSubItem
                  to="/settings/reset-cleanup"
                  icon={<FaBroom size={12} />}
                >
                  Reset & Cleanup
                </CollapsedSubItem>
              </CollapsedSubMenu>
            )}

            {/* EXPANDED SETTINGS */}

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

          {/* =================================================
              TRASH
          ================================================= */}

          <div className="group relative overflow-visible">
            <NavLink
              to="/trash"
              className={mainNavClass}
              title={!sideBarOpen ? "Trash" : ""}
            >
              <FaRegTrashAlt size={17} className="shrink-0" />

              {sideBarOpen && <span>Trash</span>}
            </NavLink>

            {!sideBarOpen && <CollapsedLabel>Trash</CollapsedLabel>}
          </div>
        </div>
      </nav>

      {/* =====================================================
          LOGOUT
      ====================================================== */}

      <div
        className="
          border-t
          border-slate-200
          p-3

          dark:border-slate-700
        "
      >
        <div className="group relative overflow-visible">
          <button
            type="button"
            onClick={handleLogout}
            title={!sideBarOpen ? "Logout" : ""}
            className={`
              flex
              h-11
              w-full
              items-center

              rounded-lg

              text-sm
              font-medium

              text-red-500

              transition-all
              duration-200

              hover:bg-red-50

              dark:text-red-400
              dark:hover:bg-red-500/10

              ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
            `}
          >
            <FaSignOutAlt size={17} className="shrink-0" />

            {sideBarOpen && <span>Logout</span>}
          </button>

          {!sideBarOpen && <CollapsedLabel danger>Logout</CollapsedLabel>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
