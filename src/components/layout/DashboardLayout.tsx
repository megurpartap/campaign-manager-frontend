import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { useEffect } from "react";

const DashboardLayout = () => {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <main className="p-3 bg-muted/40">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
