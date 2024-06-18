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
import { useGetAdAccounts } from "@/hooks/useGetAdAccounts";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAdAccount } from "@/components/store/features/campaigns/campaignSlice";

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
  const dispatch = useDispatch();
  const currentAdAccount = useSelector((state: any) => state.currentAdAccount);

  const {
    data: adAccounts,
    isLoading: adAccountsLoading,
    isError: adAccountsError,
    isSuccess: adAccountsSuccess,
  } = useGetAdAccounts();

  useEffect(() => {
    if (adAccountsSuccess && !currentAdAccount && adAccounts.length > 0) {
      dispatch(setCurrentAdAccount(adAccounts[0].id));
    }
  }, [adAccountsSuccess, adAccounts, currentAdAccount, dispatch]);
  // if (adAccountsSuccess && !currentAdAccount && adAccounts.length > 0) {
  //   dispatch(setCurrentAdAccount(adAccounts[0].id));
  // }
  if (adAccountsError) {
    toast.error("Failed to fetch ad accounts");
  }

  const {
    data: campaigns,
    isLoading: campaignsLoading,
    isError: campaignsError,
  } = useGetCampaigns(currentAdAccount);

  if (campaignsError) {
    toast.error("Failed to fetch campaigns");
  }

  return (
    <>
      <Topbar currentPage="campaign" />
      <div className="justify-between flex mt-3 px-8">
        <div className="flex items-center gap-2">
          <Select
            value={currentAdAccount}
            onValueChange={(e) => dispatch(setCurrentAdAccount(e))}
          >
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
        {(campaignsLoading || !currentAdAccount) && <p>Loading...</p>}
        {!campaignsLoading && currentAdAccount && (
          <CampaignDataTable columns={columns} data={campaigns || []} />
        )}
      </div>
    </>
  );
};

export default Campaign;
