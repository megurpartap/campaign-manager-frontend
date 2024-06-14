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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [currentAdAccount, setCurrentAdAccount] = useState<string>("");
  const [adAccounts, setAdAccounts] = useState([]);
  const [data, setData] = useState<CampaignType[]>([]);

  useEffect(() => {
    async function fetchAdAccounts() {
      try {
        const response = await axios.get(`${conf.API_URL}/fb/getAdAccounts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        });
        setAdAccounts(response.data.data.data);
        setCurrentAdAccount(response.data.data.data[0].id);
      } catch (error: any) {
        console.error(error.message);
      }
    }
    fetchAdAccounts();
  }, []);

  useEffect(() => {
    if (!currentAdAccount) return;
    getCampaignData(currentAdAccount).then((responseData) => {
      setData(responseData.data);
    });
  }, [currentAdAccount]);
  return (
    <>
      <Topbar currentPage="campaign" />
      <div className="justify-between flex mt-3 px-8">
        <div className="flex items-center gap-2">
          <Select onValueChange={(e) => setCurrentAdAccount(e)}>
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select An Ad Account" />
            </SelectTrigger>
            <SelectContent className="max-h-96">
              {adAccounts &&
                adAccounts.map((adAccount: any) => (
                  <SelectItem key={adAccount.id} value={adAccount.id}>
                    {adAccount.name}
                    <span className="text-sm text-gray-400 ml-3">
                      ({adAccount.id.slice(4)})
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
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
