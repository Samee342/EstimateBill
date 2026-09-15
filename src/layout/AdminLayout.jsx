import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
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
  const theme = useSelector((state) => state.theme.theme);

  const [sideBarOpen, setSideBarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-700">
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8 dark:bg-slate-800">
        {/* Left - Search */}
        <div className="flex items-center gap-3">
          <div className="flex dark:bg-slate-600 ml-60 h-11 w-72 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 md:w-80 lg:w-96">
            <FiSearch size={19} className="shrink-0 text-slate-400" />

            <input
              type="text"
              placeholder="Search projects, customers..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Mobile Menu */}
          <button className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 lg:hidden">
            <FiMenu size={21} />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Dark Mode */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 sm:block"
          >
            {theme === "dark" ? <FiSun size={19} /> : <FiMoon size={19} />}
          </button>

          {/* Notification */}
          <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50">
            <FiBell size={19} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500"></span>
          </button>

          {/* Profile */}
          <div className="hidden items-center gap-2 border-l border-slate-200 pl-4 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
              A
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">Admin</p>

              <p className="text-[11px] text-slate-400">Administrator</p>
            </div>

            <FiChevronDown size={15} className="ml-1 text-slate-400" />
          </div>
        </div>
      </header>

      <Sidebar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />

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
