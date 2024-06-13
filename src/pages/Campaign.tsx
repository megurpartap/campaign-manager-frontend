import Topbar from "@/components/layout/Topbar";
import { CampaignDataTable } from "@/components/Tables/CampaignTable/CampaignDataTable";
import {
  CampaignType,
  columns,
} from "@/components/Tables/CampaignTable/Columns";
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
import { useEffect, useState } from "react";
import conf from "@/config";
import axios from "axios";
import { toast } from "sonner";

async function getCampaignData(
  adAccountId: string
): Promise<{ data: CampaignType[] }> {
  try {
    const response = await axios.get(
      `${conf.API_URL}/fb/getFbCampaigns?adAccountId=${adAccountId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            "exampleRefreshToken"
          )}`,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    toast.error("Failed to fetch data", {
      description: errorMessage || "",
    });
    return {
      data: [],
    };
  }
}

const Campaign = () => {
  const [currentAdAccount, setCurrentAdAccount] = useState<string>(
    "act_831241675228825"
  );
  const [data, setData] = useState<CampaignType[]>([]);
  useEffect(() => {
    getCampaignData(currentAdAccount).then((responseData) => {
      setData(responseData.data);
    });
  }, []);
  return (
    <>
      <Topbar currentPage="campaign" />
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
        <CampaignDataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default Campaign;
