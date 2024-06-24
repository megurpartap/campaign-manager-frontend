import Topbar from "@/components/layout/Topbar";
import { CampaignDataTable } from "@/components/Tables/CampaignTable/CampaignDataTable";
import { columns } from "@/components/Tables/CampaignTable/Columns";
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
import { setCurrentAdAccount } from "@/store/features/campaigns/campaignSlice";

const Campaign = () => {
  const dispatch = useDispatch();
  const currentAdAccount = useSelector(
    (state: any) => state.campaign.currentAdAccount
  );

  const {
    data: adAccounts,
    isError: adAccountsError,
    isSuccess: adAccountsSuccess,
  } = useGetAdAccounts();

  if (adAccountsSuccess && adAccounts.length > 0 && !currentAdAccount) {
    dispatch(setCurrentAdAccount(adAccounts[0].adAccountId));
  }
  if (adAccountsError) {
    toast.error("Failed to fetch ad accounts");
  }

  const {
    data: campaigns,
    isLoading: campaignsLoading,
    isError: campaignsError,
    isSuccess: campaignsSuccess,
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
              {adAccountsSuccess &&
                adAccounts.length > 0 &&
                adAccounts.map((adAccount: any) => (
                  <SelectItem
                    key={adAccount.adAccountId}
                    value={adAccount.adAccountId}
                  >
                    {adAccount.adAccountName}
                    <span className="text-sm text-gray-400 ml-3">
                      ({adAccount.adAccountId.slice(4)})
                    </span>
                  </SelectItem>
                ))}
              {adAccountsSuccess && adAccounts.length === 0 && (
                <SelectItem value="no ad account" disabled={true}>
                  No ad accounts found
                </SelectItem>
              )}
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
        {currentAdAccount && campaignsLoading && <p>Loading...</p>}
        {adAccountsSuccess && adAccounts.length === 0 && (
          <p>No Ad Accounts Found</p>
        )}
        {currentAdAccount && campaignsSuccess && (
          <CampaignDataTable columns={columns} data={campaigns || []} />
        )}
      </div>
    </>
  );
};

export default Campaign;
