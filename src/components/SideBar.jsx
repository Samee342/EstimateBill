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
  FaMoneyBillWave,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Sidebar = ({ sideBarOpen, setSideBarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [reportOpen, setReportOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const isProjectSection = location.pathname.startsWith("/projects");
  const isCustomerSection = location.pathname.startsWith("/customers");
  const isTeamSection = location.pathname.startsWith("/team");
  const isReportSection = location.pathname.startsWith("/reports");
  const isSettingSection = location.pathname.startsWith("/settings");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!sideBarOpen) return;
    if (isProjectSection) setProjectOpen(true);
    if (isCustomerSection) setCustomerOpen(true);
    if (isTeamSection) setTeamOpen(true);
    if (isReportSection) setReportOpen(true);
    if (isSettingSection) setSettingOpen(true);
  }, [
    sideBarOpen,
    isProjectSection,
    isCustomerSection,
    isTeamSection,
    isReportSection,
    isSettingSection,
  ]);

  useEffect(() => {
    if (!sideBarOpen) {
      setProjectOpen(false);
      setCustomerOpen(false);
      setTeamOpen(false);
      setReportOpen(false);
      setSettingOpen(false);
    }
  }, [sideBarOpen]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") {
      setCompanyName("");
      return;
    }
    try {
      const user = JSON.parse(storedUser);
      setCompanyName(user?.company_name || "");
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      localStorage.removeItem("user");
      setCompanyName("");
    }
  }, []);

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
              ? "border-red-100 bg-white text-red-500 dark:border-red-500/20 dark:bg-slate-800 dark:text-red-400"
              : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          }
        `}
      >
        {children}
      </span>
    );
  };

  const CollapsedSubMenu = ({ children }) => {
    return (
      <div
        className="
          absolute
          left-full
          top-0
          ml-3
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
        <div className="absolute -left-3 top-0 h-full w-3" />
        <div
          className="
            min-w-[190px]
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
            text-xs
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
        h-full
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
      {/* HEADER */}
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
        <NavLink
          to="/dashboard"
          end
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
                Print<span className="text-orange-500">Tech</span>
              </h1>
              <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                {companyName || "Printing System"}
              </p>
            </div>
          )}
        </NavLink>

        {sideBarOpen && (
          <button
            type="button"
            onClick={() => setSideBarOpen(false)}
            className="
              ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
              text-slate-400 transition hover:bg-slate-100 hover:text-slate-700
              dark:hover:bg-slate-800 dark:hover:text-slate-200
            "
            title="Collapse sidebar"
          >
            <IoIosArrowBack size={18} />
          </button>
        )}
      </div>

      {/* EXPAND BUTTON */}
      {!sideBarOpen && (
        <button
          type="button"
          onClick={() => setSideBarOpen(true)}
          className="
            absolute -right-3 top-[78px] z-[60] flex h-7 w-7 items-center
            justify-center rounded-full border border-slate-200 bg-white
            text-slate-500 shadow-sm transition hover:text-orange-500
            dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300
          "
          title="Expand sidebar"
        >
          <IoIosArrowForward size={15} />
        </button>
      )}

      {/* NAV — no overflow so submenus can escape */}
      <nav className="flex-1 px-3 py-5">
        <div className="space-y-1">
          {/* DASHBOARD — single link with label */}
          <div className="group relative">
            <NavLink to="/dashboard" end className={mainNavClass}>
              <FaThLarge size={17} className="shrink-0" />
              {sideBarOpen && <span>Dashboard</span>}
            </NavLink>
            {!sideBarOpen && <CollapsedLabel>Dashboard</CollapsedLabel>}
          </div>

          {/* PROJECTS — dropdown, submenu only */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setProjectOpen((prev) => !prev);
                } else {
                  navigate("/projects");
                }
              }}
              className={`
                flex h-11 w-full items-center rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isProjectSection
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                }
                ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
              `}
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

          {/* CUSTOMERS — dropdown, submenu only */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setCustomerOpen((prev) => !prev);
                } else {
                  navigate("/customers");
                }
              }}
              className={`
                flex h-11 w-full items-center rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isCustomerSection
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                }
                ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
              `}
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

          {/* PAYMENTS — single link with label */}
          <div className="group relative">
            <NavLink to="/payments" className={mainNavClass}>
              <FaMoneyBillWave size={17} className="shrink-0" />
              {sideBarOpen && <span>Payments</span>}
            </NavLink>
            {!sideBarOpen && <CollapsedLabel>Payments</CollapsedLabel>}
          </div>

          {/* TEAM — dropdown, submenu only */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setTeamOpen((prev) => !prev);
                } else {
                  navigate("/team");
                }
              }}
              className={`
                flex h-11 w-full items-center rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isTeamSection
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                }
                ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
              `}
            >
              <FaPeopleGroup size={17} className="shrink-0" />
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

          {/* REPORTS — dropdown, submenu only */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setReportOpen((prev) => !prev);
                } else {
                  navigate("/reports/sales");
                }
              }}
              className={`
                flex h-11 w-full items-center rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isReportSection
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                }
                ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
              `}
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

          {/* NOTIFICATIONS — single link with label */}
          <div className="group relative">
            <NavLink to="/notifications" end className={mainNavClass}>
              <FaBell size={17} className="shrink-0" />
              {sideBarOpen && <span>Notifications</span>}
            </NavLink>
            {!sideBarOpen && <CollapsedLabel>Notifications</CollapsedLabel>}
          </div>

          {/* SETTINGS — dropdown, submenu only */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => {
                if (sideBarOpen) {
                  setSettingOpen((prev) => !prev);
                } else {
                  navigate("/settings/studio");
                }
              }}
              className={`
                flex h-11 w-full items-center rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isSettingSection
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
                }
                ${sideBarOpen ? "gap-3 px-4" : "justify-center px-0"}
              `}
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
        </div>
      </nav>

      {/* LOGOUT — single link with label */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-700">
        <div className="group relative">
          <button
            type="button"
            onClick={handleLogout}
            className={`
              flex h-11 w-full items-center rounded-lg text-sm font-medium
              text-red-500 transition-all duration-200 hover:bg-red-50
              dark:text-red-400 dark:hover:bg-red-500/10
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
