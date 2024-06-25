import { ColumnDef } from "@tanstack/react-table";

export type UserType = {
  id: string;
  role: "ADMIN" | "USER";
  fullName: string;
  username: string;
};

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "id",
    header: "User ID",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ cell }) => {
      return <span>{cell.getValue() === "USER" ? "EMPLOYEE" : "ADMIN"}</span>;
    },
  },
];
