import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";
import { columns } from "@/components/Tables/AdminUserTable/Columns";
import { AdminUserDataTable } from "@/components/Tables/AdminUserTable/AdminUserDataTable";
import { toast } from "sonner";
import { useGetUsers } from "@/hooks/useGetUsers";

const User = () => {
  const {
    data: Users,
    isLoading: UsersLoading,
    isError: UsersError,
    error: UsersErrorData,
  } = useGetUsers();

  if (UsersError) {
    toast.error("Failed to fetch Users", {
      // @ts-ignore
      description: UsersErrorData.response.data.message || "An error occurred",
    });
  }

  return (
    <>
      <Topbar currentPage="user" />
      <div className="justify-end flex mt-3">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="container mx-auto pt-5">
        {UsersLoading && <p>Loading...</p>}
        {!UsersLoading && (
          <AdminUserDataTable columns={columns} data={Users || []} />
        )}
      </div>
    </>
  );
};

export default User;
