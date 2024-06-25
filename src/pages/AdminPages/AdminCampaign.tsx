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
import { useDispatch, useSelector } from "react-redux";
import {
  resetCurrentAdAccountAdminCampaignPage,
  setCurrentAdAccountAdminCampaignPage,
} from "@/store/features/campaigns/campaignSlice";
import { useGetAdminConnectedFbAccounts } from "@/hooks/useGetConnectedFbAccounts";
import { RootState } from "@/store/store";
import { setCurrentFbAccountCampaignPage } from "@/store/features/admin/facebookSlice";
import { useGetAdAccountsOfFbAccount } from "@/hooks/useGetAdAccountsOfFbAccount";
import { useGetCampaignsAdmin } from "@/hooks/useGetCampaignsAdmin";
import { Label } from "@/components/ui/label";

const AdminCampaign = () => {
  const dispatch = useDispatch();
  const currentFacebookAccount = useSelector((state: RootState) =>
    JSON.stringify(state.facebook.currentFbAccountCampaignPage)
  );

  const {
    data: fbAccountData,
    isError: fbAccountError,
    isSuccess: fbAccountSuccess,
  } = useGetAdminConnectedFbAccounts();

  if (
    fbAccountSuccess &&
    fbAccountData.length > 0 &&
    currentFacebookAccount.length === 2
  ) {
    dispatch(
      setCurrentFbAccountCampaignPage({
        facebookId: fbAccountData[0].facebookId,
        fbFullName: fbAccountData[0].fbFullName,
      })
    );
  }
  if (fbAccountError) {
    toast.error("Failed to fetch Facebook Accounts");
  }

  const currentAdAccount = useSelector(
    (state: RootState) => state.campaign.currentAdAccountAdminCampaignPage
  );

  const {
    data: adAccounts,
    isError: adAccountsError,
    isSuccess: adAccountsSuccess,
  } = useGetAdAccountsOfFbAccount(
    useSelector(
      (state: RootState) =>
        state.facebook.currentFbAccountCampaignPage.facebookId
    )
  );

  if (adAccountsSuccess && adAccounts.length > 0 && !currentAdAccount) {
    dispatch(setCurrentAdAccountAdminCampaignPage(adAccounts[0].id));
  }
  if (adAccountsError) {
    toast.error("Failed to fetch ad accounts");
  }

  const {
    data: campaigns,
    isLoading: campaignsLoading,
    isError: campaignsError,
    isSuccess: campaignsSuccess,
  } = useGetCampaignsAdmin(
    useSelector(
      (state: RootState) => state.campaign.currentAdAccountAdminCampaignPage
    ),
    useSelector(
      (state: RootState) =>
        state.facebook.currentFbAccountCampaignPage.facebookId
    )
  );

  if (campaignsError) {
    toast.error("Failed to fetch campaigns");
  }

  return (
    <>
      <Topbar currentPage="campaignAdmin" />
      <div className="justify-between flex mt-3 px-8">
        <div className="flex items-center gap-2">
          <div>
            <Label>Facebook Account</Label>
            <Select
              value={currentFacebookAccount}
              onValueChange={(e) => {
                e = JSON.parse(e);
                console.log(e);
                dispatch(setCurrentFbAccountCampaignPage(e));
                dispatch(resetCurrentAdAccountAdminCampaignPage());
              }}
            >
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder="Select A Facebook Page" />
              </SelectTrigger>
              <SelectContent className="max-h-96">
                {fbAccountData &&
                  fbAccountData.length > 0 &&
                  fbAccountData.map((fbAccount) => (
                    <SelectItem
                      key={fbAccount.id}
                      value={JSON.stringify({
                        facebookId: fbAccount.facebookId,
                        fbFullName: fbAccount.fbFullName,
                      })}
                    >
                      {fbAccount.fbFullName}
                      <span className="text-sm text-gray-400 ml-3">
                        ({fbAccount.facebookId})
                      </span>
                    </SelectItem>
                  ))}
                {fbAccountSuccess && fbAccountData.length === 0 && (
                  <SelectItem value="no fb account" disabled={true}>
                    No Facebook Accounts Connected
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          {currentFacebookAccount && (
            <div>
              <Label>Ad Account</Label>
              <Select
                value={currentAdAccount}
                onValueChange={(e) =>
                  dispatch(setCurrentAdAccountAdminCampaignPage(e))
                }
              >
                <SelectTrigger className="w-[400px]">
                  <SelectValue placeholder="Select An Ad Account" />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  {adAccountsSuccess &&
                    adAccounts.length > 0 &&
                    adAccounts.map((adAccount) => (
                      <SelectItem key={adAccount.id} value={adAccount.id}>
                        {adAccount.name}
                        <span className="text-sm text-gray-400 ml-3">
                          ({adAccount.id.slice(4)})
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
          )}
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

export default AdminCampaign;
