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
import conf from "@/config";
import axios from "axios";
import { toast } from "sonner";

async function getOfferData(): Promise<OfferType[]> {
  try {
    const response = await axios.get(`${conf.API_URL}/offers/getOffers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("exampleRefreshToken")}`,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    toast.error("Failed to fetch data", {
      description: errorMessage || "",
    });
    return [];
  }
}

const Offer = () => {
  const [data, setData] = useState<OfferType[]>([]);
  useEffect(() => {
    getOfferData().then((data) => {
      setData(data);
    });
  }, []);
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
        <OfferDataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default Offer;
