import {
  Bell,
  Home,
  Link2,
  LogOutIcon,
  MegaphoneIcon,
  Package2,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";

const Sidebar = () => {
  return (
    <aside className="hidden border-r md:block ">
      <div className="flex h-full max-h-screen flex-col gap-2 fixed">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Campaign Manager</span>
          </NavLink>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink
              to="home"
              className={({ isActive }) =>
                [isActive ? "bg-muted" : "text-muted-foreground", ""].join(
                  " flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                )
              }
            >
              <Home className="h-4 w-4" />
              Home
            </NavLink>
            <NavLink
              to="offer"
              className={({ isActive }) =>
                [isActive ? "bg-muted" : "text-muted-foreground", ""].join(
                  " flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                )
              }
            >
              <Link2 className="h-4 w-4" />
              Offers
            </NavLink>
            <NavLink
              to="campaign"
              className={({ isActive }) =>
                [isActive ? "bg-muted" : "text-muted-foreground", ""].join(
                  " flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                )
              }
            >
              <MegaphoneIcon className="h-4 w-4" />
              Campaigns
            </NavLink>
          </nav>
        </div>
        <div className="mt-auto p-4">
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
          <NavLink
            to="#"
            className=" flex items-center text-muted-foreground gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
