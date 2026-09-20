import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  FiSettings,
  FiLogOut,
  FiMoon,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiMenu,
  FiSun,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";

import Sidebar from "../components/SideBar";
import { getCurrentUser, logoutUser } from "../utils/auth";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================
  // PROFILE DROPDOWN
  // =========================

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // =========================
  // THEME
  // =========================

  const theme = useSelector((state) => state.theme.theme);

  // =========================
  // CURRENT USER
  // =========================

  const user = getCurrentUser();

  // =========================
  // SIDEBAR
  // =========================

  const [sideBarOpen, setSideBarOpen] = useState(true);

  // =========================
  // MOBILE SIDEBAR
  // =========================

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // =========================
  // CLOSE PROFILE WHEN CLICKING OUTSIDE
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // CLOSE MOBILE SIDEBAR
  // =========================

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  // =========================
  // OPEN MOBILE SIDEBAR
  // =========================

  const handleMobileMenu = () => {
    setMobileSidebarOpen(true);
  };

  // =========================
  // NOTIFICATIONS
  // =========================

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logoutUser();
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          no-print
          fixed
          right-0
          top-0
          z-40
          flex
          h-20
          items-center
          justify-between
          border-b
          border-slate-200
          bg-white
          px-4
          transition-all
          duration-300
          dark:border-slate-800
          dark:bg-slate-900
          sm:px-5
          md:px-8
          lg:left-auto
        "
        style={{
          left:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? sideBarOpen
                ? "256px"
                : "76px"
              : "0px",
        }}
      >
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={handleMobileMenu}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              border
              border-slate-200
              text-slate-600
              transition
              hover:bg-slate-50
              dark:border-slate-700
              dark:text-slate-300
              dark:hover:bg-slate-800
              lg:hidden
            "
            aria-label="Open sidebar"
          >
            <FiMenu size={21} />
          </button>

          {/* SEARCH */}

          <div
            className="
              flex
              h-10
              w-full
              max-w-xl
              items-center
              gap-3
              border
              border-slate-200
              bg-slate-50
              px-3
              transition
              focus-within:border-orange-400
              focus-within:bg-white
              focus-within:ring-2
              focus-within:ring-orange-100
              dark:border-slate-700
              dark:bg-slate-800
              dark:focus-within:bg-slate-800
              sm:h-11
              sm:px-4
            "
          >
            <FiSearch
              size={18}
              className="
                shrink-0
                text-slate-400
                dark:text-slate-500
              "
            />

            <input
              type="text"
              placeholder="Search projects, customers..."
              className="
                w-full
                min-w-0
                bg-transparent
                text-sm
                text-slate-700
                outline-none
                placeholder:text-slate-400
                dark:text-slate-200
                dark:placeholder:text-slate-500
              "
            />
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="ml-2 flex shrink-0 items-center gap-2 sm:ml-4 sm:gap-3">
          {/* =====================================================
              THEME
          ====================================================== */}

          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              text-slate-500
              transition
              hover:bg-slate-100
              dark:text-slate-300
              dark:hover:bg-slate-700
              sm:h-11
              sm:w-11
            "
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={19} /> : <FiMoon size={19} />}
          </button>

          {/* =====================================================
              NOTIFICATION
          ====================================================== */}

          <button
            type="button"
            onClick={handleNotificationClick}
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-orange-500
              dark:text-slate-300
              dark:hover:bg-slate-700
              dark:hover:text-orange-400
              sm:h-11
              sm:w-11
            "
            aria-label="Notifications"
            title="Notifications"
          >
            <FiBell size={18} />

            {/* Notification dot */}

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

          {/* =====================================================
              USER PROFILE
          ====================================================== */}

          <div
            ref={profileRef}
            className="
              relative
              hidden
              md:block
            "
          >
            {/* PROFILE BUTTON */}

            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className={`
                flex
                items-center
                gap-2.5
                rounded-lg
                px-2
                py-1.5
                transition-all
                duration-200
                hover:bg-slate-50
                dark:hover:bg-slate-800
                ${profileOpen ? "bg-slate-50 dark:bg-slate-800" : ""}
              `}
            >
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
                  dark:bg-orange-500/10
                  dark:text-orange-400
                "
              >
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>

              {/* User Info */}

              <div className="hidden text-left lg:block">
                <p
                  className="
                    max-w-[130px]
                    truncate
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  {user?.name || "Admin"}
                </p>

                <p
                  className="
                    text-[11px]
                    capitalize
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  {user?.role || "Administrator"}
                </p>
              </div>

              {/* Arrow */}

              <FiChevronDown
                size={15}
                className={`
                  ml-1
                  text-slate-400
                  transition-transform
                  duration-200
                  dark:text-slate-500
                  ${profileOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================== */}

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  z-50
                  w-56
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  shadow-xl
                  shadow-slate-900/10
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:shadow-black/30
                "
              >
                {/* USER INFO */}

                <div
                  className="
                    border-b
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    dark:border-slate-800
                    dark:bg-slate-800/50
                  "
                >
                  <div className="flex items-center gap-3">
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
                        dark:bg-orange-500/10
                        dark:text-orange-400
                      "
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-slate-800
                          dark:text-white
                        "
                      >
                        {user?.name || "Admin"}
                      </p>

                      <p
                        className="
                          truncate
                          text-xs
                          text-slate-400
                          dark:text-slate-500
                        "
                      >
                        {user?.role || "Administrator"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MENU */}

                <div className="p-1.5">
                  {/* SETTINGS */}

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/settings/studio");
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      font-medium
                      text-slate-600
                      transition-colors
                      hover:bg-slate-100
                      hover:text-slate-900
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                      dark:hover:text-white
                    "
                  >
                    <FiSettings
                      size={17}
                      className="
                        text-slate-400
                        dark:text-slate-500
                      "
                    />

                    <span>Settings</span>
                  </button>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      font-medium
                      text-red-500
                      transition-colors
                      hover:bg-red-50
                      dark:text-red-400
                      dark:hover:bg-red-500/10
                    "
                  >
                    <FiLogOut size={17} />

                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <div className="no-print hidden lg:block">
        <Sidebar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
      </div>

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ====================================================== */}

      {mobileSidebarOpen && (
        <div
          className="
            no-print
            fixed
            inset-0
            z-50
            bg-black/40
            lg:hidden
          "
          onClick={closeMobileSidebar}
        >
          {/* MOBILE SIDEBAR */}

          <div
            className="
              h-full
              w-[270px]
              bg-white
              shadow-2xl
              dark:bg-slate-900
            "
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar sideBarOpen={true} setSideBarOpen={closeMobileSidebar} />
          </div>
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className={`
          print-main
          min-h-screen
          pt-20
          transition-all
          duration-300
          ${sideBarOpen ? "lg:ml-64" : "lg:ml-[76px]"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
