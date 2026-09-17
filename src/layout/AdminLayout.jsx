import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/SideBar";

import { getCurrentUser, logoutUser } from "../utils/auth";

import {
  FiMoon,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiMenu,
  FiSun,
  FiLogOut,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useSelector((state) => state.theme.theme);

  // Get logged-in user
  const user = getCurrentUser();

  const [sideBarOpen, setSideBarOpen] = useState(true);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logoutUser();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-700">
      {/* =========================
          HEADER
      ========================== */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8 dark:bg-slate-800">
        {/* =========================
            LEFT SIDE
        ========================== */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="ml-60 flex h-11 w-72 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 dark:bg-slate-600 md:w-80 lg:w-96">
            <FiSearch
              size={19}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search projects, customers..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Mobile Menu */}
          <button
            type="button"
            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 lg:hidden"
          >
            <FiMenu size={21} />
          </button>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================== */}
        <div className="flex items-center gap-3">
          {/* =========================
              DARK MODE
          ========================== */}
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 sm:block"
          >
            {theme === "dark" ? (
              <FiSun size={19} />
            ) : (
              <FiMoon size={19} />
            )}
          </button>

          {/* =========================
              NOTIFICATION
          ========================== */}
          <button
            type="button"
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
          >
            <FiBell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500"></span>
          </button>

          {/* =========================
              USER PROFILE
          ========================== */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            {/* User Info */}
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-700">
                {user?.name || "Admin"}
              </p>

              <p className="text-[11px] capitalize text-slate-400">
                {user?.role || "Administrator"}
              </p>
            </div>

            {/* Dropdown Icon */}
            <FiChevronDown
              size={15}
              className="hidden text-slate-400 md:block"
            />

            {/* =========================
                LOGOUT BUTTON
            ========================== */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <FiLogOut size={17} />

              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================
          SIDEBAR
      ========================== */}
      <Sidebar
        sideBarOpen={sideBarOpen}
        setSideBarOpen={setSideBarOpen}
      />

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          sideBarOpen ? "ml-64" : "ml-[76px]"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;