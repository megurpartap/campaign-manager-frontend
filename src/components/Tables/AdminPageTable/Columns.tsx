import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";
import GrantCell from "./Cells/GrantCell";

export type PageType = {
  id: string;
  name: string;
};

export const columns: ColumnDef<PageType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Page Name",
  },
  {
    accessorKey: "id",
    header: "Page ID",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <GrantCell row={row} />,
  },
];
