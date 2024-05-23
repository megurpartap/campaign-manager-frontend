import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { useEffect } from "react";
import axios from "axios";
import conf from "@/config";
import { useToast } from "@/components/ui/use-toast";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    const rt = localStorage.getItem("exampleRefreshToken");
    if (rt && rt !== String(null)) {
      axios
        .get(`${conf.API_URL}/users/getLoginStatus`, {
          headers: {
            Authorization: `Bearer ${rt}`,
          },
        })
        .then((response) => {
          if (!response.data.success) {
            toast({
              variant: "destructive",
              title: "Session Expired",
              description: "Please login again",
            });
            navigate("/");
          }
        });
    } else {
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Please login again",
      });
      navigate("/");
    }
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
