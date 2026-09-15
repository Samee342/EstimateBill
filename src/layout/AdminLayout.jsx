import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";

const AdminLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
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
