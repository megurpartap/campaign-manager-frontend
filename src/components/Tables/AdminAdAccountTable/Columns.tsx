import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";
import GrantCell from "./Cells/GrantCell";

export type AdAccountType = {
  id: string;
  name: string;
};

export const columns: ColumnDef<AdAccountType>[] = [
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
    header: "Ad Account Name",
  },
  {
    accessorKey: "id",
    header: "Ad Account ID",
    cell: ({ cell }) => {
      const adAccountId = cell.getValue() as string;
      return <span>{adAccountId.slice(4)}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <GrantCell row={row} />,
  },
];
