import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiBriefcase,
  FiCheckSquare,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiUsers,
  FiUser,
} from "react-icons/fi";
import { useState } from "react";
import { getCurrentUser, logoutUser } from "../utils/auth";
import Logo from "../assets/Logo.png";

const StaffLayout = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Current logged-in user
  const user = getCurrentUser();

  // Logout
  const handleLogout = () => {
    logoutUser();

    navigate("/login", {
      replace: true,
    });
  };

  // Navigation items
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
      name: "My Profile",
      path: "/staff/profile",
      icon: FiUser,
    },
  ];

  // Sidebar navigation class
  const navClass = ({ isActive }) =>
    `group flex items-center rounded-xl transition-all duration-200 ${
      sidebarOpen ? "gap-3 px-3 py-3" : "justify-center px-2 py-3"
    } ${
      isActive
        ? "bg-orange-500 text-white shadow-sm shadow-orange-200 dark:shadow-none"
        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400"
    }`;

  // User initial
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="flex min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* =================================================
            LOGO
        ================================================== */}

        <div
          className={`flex h-20 shrink-0 items-center border-b border-slate-100 dark:border-slate-800 ${
            sidebarOpen ? "justify-between px-4" : "justify-center px-3"
          }`}
        >
          {sidebarOpen ? (
            <div className="flex min-w-0 items-center gap-3">
              {/* Logo */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50 dark:bg-orange-500/10">
                <img
                  src={Logo}
                  alt="PrintTech"
                  className="h-9 w-9 object-contain"
                />
              </div>

              {/* Brand */}
              <div className="min-w-0">
                <h1 className="text-[18px] font-bold leading-none tracking-tight text-slate-900 dark:text-white">
                  Print<span className="text-orange-500">Tech</span>
                </h1>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Staff Panel
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed */
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl  shadow-sm">
              <img
                src={Logo}
                alt="PrintTech"
                className="h-8 w-8 object-contain"
              />
            </div>
          )}

          {/* Sidebar Toggle */}
          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="Collapse sidebar"
            >
              <FiChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* =================================================
            OPEN SIDEBAR BUTTON
        ================================================== */}
        {!sidebarOpen && (
          <div className="flex justify-center border-b border-slate-100 py-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-slate-800"
              title="Open sidebar"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}
        {/* =================================================
            NAVIGATION
        ================================================== */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
          {sidebarOpen && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
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
        {/* =================================================
            USER + LOGOUT
        ================================================== */}
        <div className="shrink-0 border-t border-slate-100 p-3 dark:border-slate-800">
          {/* Logout */}
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

      {/* =====================================================
          MAIN AREA
      ====================================================== */}
      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* =================================================
            TOP HEADER
        ================================================== */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8 dark:border-slate-800 dark:bg-slate-900/95">
          {/* Left */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-orange-500">
              Staff Workspace
            </p>
          </div>

          {/* Right User */}
          <div className="flex items-center gap-3">
            {/* User details */}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {user?.name || "Staff"}
              </p>

              <p className="text-xs capitalize text-slate-400">
                {user?.role || "staff"}
              </p>
            </div>

            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600 ring-4 ring-orange-50 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/5">
              {userInitial}
            </div>
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================== */}
        <main className="min-w-0 flex-1 p-4 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
