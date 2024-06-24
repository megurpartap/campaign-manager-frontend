import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { columns as adAccountColumns } from "@/components/Tables/AdminAdAccountTable/Columns";
import { columns as pageColumns } from "@/components/Tables/AdminPageTable/Columns";
import { AdminAdAccountDataTable } from "../Tables/AdminAdAccountTable/AdminAdAccountDataTable";
import { useGetAdAccountsOfFbAccount } from "@/hooks/useGetAdAccountsOfFbAccount";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { AdminPageDataTable } from "../Tables/AdminPageTable/AdminPageDataTable";
import { useGetPagesOfFbAccount } from "@/hooks/useGetPagesOfFbAccount";

const AdAccountsAndPagesTabs = () => {
  const currentFacebookAccount = useSelector(
    (state: any) => state.facebook.currentConnectedAccount
  );
  const {
    data: adAccountsData,
    isError: adAccountsError,
    isSuccess: adAccountsSuccess,
  } = useGetAdAccountsOfFbAccount(currentFacebookAccount.facebookId);

  const {
    data: pagesData,
    isError: pagesError,
    isSuccess: pagesSuccess,
  } = useGetPagesOfFbAccount(currentFacebookAccount.facebookId);

  // if (adAccountsLoading) return <div>Loading...</div>;
  if (adAccountsError) {
    toast.error("Failed to fetch ad accounts of Facebook account");
  }

  if (pagesError) {
    toast.error("Failed to fetch pages of Facebook account");
  }

  return (
    <Tabs defaultValue="adAccounts">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="adAccounts">Ad Accounts</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="adAccounts">
        <Card>
          <CardHeader>
            {currentFacebookAccount.facebookId && (
              <CardTitle className="text-base">
                Ad Accounts Associated With{" "}
                {currentFacebookAccount.fbFullName || "Facebook Account"}
                <span className=" text-muted-foreground ml-2">
                  {`(${currentFacebookAccount.facebookId})`}
                </span>
              </CardTitle>
            )}
            {!currentFacebookAccount.facebookId && (
              <CardTitle className="text-base">
                No Facebook Account Selected Yet
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            {adAccountsSuccess && adAccountsData.length === 0 && (
              <p>No Ad Accounts Available for Selected Facebook Account</p>
            )}
            {adAccountsSuccess && adAccountsData.length > 0 && (
              <AdminAdAccountDataTable
                columns={adAccountColumns}
                data={adAccountsData}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="pages">
        <Card>
          <CardHeader>
            {currentFacebookAccount.facebookId && (
              <CardTitle className="text-base">
                Pages Associated With{" "}
                {currentFacebookAccount.fbFullName || "Facebook Account"}
                <span className=" text-muted-foreground ml-2">
                  {`(${currentFacebookAccount.facebookId})`}
                </span>
              </CardTitle>
            )}
            {!currentFacebookAccount.facebookId && (
              <CardTitle className="text-base">
                No Facebook Account Selected Yet
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            {adAccountsSuccess && adAccountsData.length === 0 && (
              <p>No Pages Available for Selected Facebook Account</p>
            )}
            {pagesSuccess && pagesData.length > 0 && (
              <AdminPageDataTable columns={pageColumns} data={pagesData} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdAccountsAndPagesTabs;
