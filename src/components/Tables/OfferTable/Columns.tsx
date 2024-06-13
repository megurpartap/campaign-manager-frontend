"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OfferType = {
  id: string;
  offerSequenceId: number;
  offerName: string;
  offerURL: string;
  languages: string;
  country: string;
  offerType: "DIRECT" | "ADVERTORIAL";
};

export const columns: ColumnDef<OfferType>[] = [
  {
    accessorKey: "offerSequenceId",
    header: "ID",
    cell: ({ row }) => {
      return (
        <span className="font-medium">OF{row.original.offerSequenceId}</span>
      );
    },
  },
  {
    accessorKey: "offerName",
    header: "Offer Name",
  },
  {
    accessorKey: "offerURL",
    header: "Offer URL",
    cell: ({ row }) => {
      return (
        <a
          href={row.original.offerURL}
          target="_blank"
          rel="noopener noreferrer"
          className=" font-medium underline"
        >
          {row.original.offerURL}
        </a>
      );
    },
  },
  {
    accessorKey: "languages",
    header: "Language",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "offerType",
    header: "Offer Type",
  },
];
