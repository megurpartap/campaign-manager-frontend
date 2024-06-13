"use client";

import { ColumnDef } from "@tanstack/react-table";

export type CampaignType = {
  name: string;
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  daily_budget?: number;
  lifetime_budget?: number;
  bid_strategy: string;
  id: string;
};

export const columns: ColumnDef<CampaignType>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const textClass =
        row.original.status === "ACTIVE"
          ? "text-green-600"
          : row.original.status === "PAUSED"
          ? "text-orange-500"
          : "text-red-500";
      return (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${textClass}`}
        >
          {row.original.status}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorFn: (row) => [row.daily_budget, row.lifetime_budget],
    header: "Budget",
    cell: ({ cell }) => {
      const value = cell.getValue() as number[];
      if (value[0]) {
        return (
          <div className="gap-2 flex-column items-end justify-end">
            <p className="font-semibold text-base ">{value[0]}</p>
            <p className=" text-xs ">Daily</p>
          </div>
        );
      } else if (value[1]) {
        return (
          <div className="gap-2 flex-column items-end justify-end">
            <p className="font-semibold text-base ">{value[1]}</p>
            <p className=" text-xs ">LifeTime</p>
          </div>
        );
      } else {
        return (
          <div className="gap-2 flex-column items-end justify-end">
            <p className="font-semibold text-base ">N/A</p>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "bid_strategy",
    header: "Bid Strategy",
    cell: ({ cell }) => {
      const value = cell.getValue() as string;
      if (!value)
        return (
          <div className="gap-2 flex-column items-end justify-end">
            <p className="font-semibold text-base text-center">N/A</p>
          </div>
        );
      return (
        <div className="text-center">
          {value === "LOWEST_COST_WITHOUT_CAP" ? "High volume" : value}
        </div>
      );
    },
  },
];
