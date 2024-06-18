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
import { OfferType, columns } from "@/components/Tables/OfferTable/Columns";
import { OfferDataTable } from "@/components/Tables/OfferTable/OfferDataTable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetOffers } from "@/hooks/useGetOffers";

const Offer = () => {
  const {
    data: offers,
    isLoading: offersLoading,
    isError: offersError,
  } = useGetOffers();

  if (offersError) {
    toast.error("Failed to fetch offers");
  }

  return (
    <>
      <Topbar currentPage="offer" />
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
        {offersLoading && <p>Loading...</p>}
        {!offersLoading && (
          <OfferDataTable columns={columns} data={offers || []} />
        )}
      </div>
    </>
  );
};

export default Offer;
