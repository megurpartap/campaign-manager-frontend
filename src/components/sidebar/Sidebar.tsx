import {
  Bell,
  Home,
  Link2,
  LogOutIcon,
  MegaphoneIcon,
  Package2,
  Settings,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { resetCurrentAdAccount } from "@/store/features/campaigns/campaignSlice";
import { resetUserData } from "@/store/features/user/userSlice";
import { RootState } from "@/store/store";

let navigationOptions = [
  {
    name: "Home",
    icon: Home,
    to: "home",
    isForAdmin: false,
  },
  {
    name: "Products",
    icon: Link2,
    to: "offer",
    isForAdmin: false,
  },
  {
    name: "Campaigns",
    icon: MegaphoneIcon,
    to: "campaign",
    isForAdmin: false,
  },
  {
    name: "Users",
    icon: User,
    to: "user",
    isForAdmin: true,
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isAdmin =
    useSelector((state: RootState) => state.user.role) === "ADMIN";

  const logout = () => {
    localStorage.removeItem("exampleRefreshToken");
    queryClient.clear();
    dispatch(resetCurrentAdAccount());
    dispatch(resetUserData());
    navigate("/");
  };
  return (
    <aside className="hidden border-r md:block ">
      <div className="flex h-full max-h-screen lg:w-[280px] md:w-[220px] flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">ARB Drive</span>
          </NavLink>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {useSelector((state: RootState) => state.user.role) === "ADMIN" &&
              navigationOptions.map((option) => (
                <NavLink
                  key={option.name}
                  to={option.to}
                  className={({ isActive }) =>
                    [
                      isActive ? "bg-muted" : "text-muted-foreground",
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    ].join(" ")
                  }
                >
                  <option.icon className="h-4 w-4" />
                  {option.name}
                </NavLink>
              ))}
            {!(
              useSelector((state: RootState) => state.user.role) === "ADMIN"
            ) &&
              navigationOptions
                .filter((option) => {
                  return option.isForAdmin !== true;
                })
                .map((option) => (
                  <NavLink
                    key={option.name}
                    to={option.to}
                    className={({ isActive }) =>
                      [
                        isActive ? "bg-muted" : "text-muted-foreground",
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                      ].join(" ")
                    }
                  >
                    <option.icon className="h-4 w-4" />
                    {option.name}
                  </NavLink>
                ))}
          </nav>
        </div>
        <div className="mt-auto p-4 text-sm font-medium">
          {isAdmin && (
            <NavLink
              to="settings"
              className={({ isActive }) =>
                [isActive ? "bg-muted" : "text-muted-foreground", ""].join(
                  " flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                )
              }
            >
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
          )}
          <div
            onClick={logout}
            className=" flex cursor-pointer items-center text-muted-foreground gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
