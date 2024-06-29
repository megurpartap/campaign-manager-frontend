import { useGetAdminConnectedFbAccounts } from "@/hooks/useGetConnectedFbAccounts";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RefreshCcw, Trash } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCurrentConnectedAccount,
  setCurrentConnectedAccount,
} from "@/store/features/admin/facebookSlice";
import axios from "axios";
import conf from "@/config";

const ConnectedFacebookAccountsList = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const currentFacebookAccount = useSelector(
    (state: any) => state.facebook.currentConnectedAccount.facebookId
  );

  const {
    data: fbAccountData,
    isError: fbAccountError,
    isSuccess: fbAccountSuccess,
    isLoading: fbAccountLoading,
  } = useGetAdminConnectedFbAccounts();

  if (fbAccountSuccess && fbAccountData.length > 0 && !currentFacebookAccount) {
    dispatch(
      setCurrentConnectedAccount({
        facebookId: fbAccountData[0].facebookId,
        fbFullName: fbAccountData[0].fbFullName,
      })
    );
  }
  if (fbAccountError) {
    toast.error("Failed to fetch Facebook Accounts");
  }

  const refetchConnectedFbAccounts = () => {
    toast("Refreshing Connected Facebook Accounts");
    queryClient
      .invalidateQueries({
        queryKey: ["connectedFacebookAccount"],
        type: "active",
      })
      .then(() => {
        toast.success("Connected Facebook Accounts Refreshed");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to refresh connected Facebook accounts");
      });
  };

  if (fbAccountError) {
    toast.error("Failed to fetch connected Facebook accounts");
    console.log(fbAccountError);
  }

  const disconnectFbAccount = async (facebookId: string) => {
    try {
      const response = await axios.delete(
        `${conf.API_URL}/fb/disconnectFbAccount?facebookId=${facebookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Facebook Account Disconnected", {
          description:
            "You have successfully disconnected the facebook account",
        });
        queryClient.invalidateQueries({
          queryKey: ["connectedFacebookAccount"],
          type: "active",
        });
        if (currentFacebookAccount === facebookId) {
          dispatch(resetCurrentConnectedAccount());
        }
      } else {
        toast.error("Could not disconnect Facebook Account", {
          description: "Some Error Occured. Please try again",
        });
      }
    } catch (error: any) {
      toast.error("Could not disconnect Facebook Account", {
        description:
          error.response.data.message || "Some Error Occured. Please try again",
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row gap-3 justify-between items-center">
        <CardTitle className=" text-xl">Connected Facebook Accounts</CardTitle>
        <RefreshCcw
          className="w-8 h-8 bg-muted p-2 rounded-full cursor-pointer"
          onClick={refetchConnectedFbAccounts}
        />
      </CardHeader>
      <CardContent className="grid gap-1">
        {fbAccountLoading && <p>Loading...</p>}
        {fbAccountSuccess && fbAccountData.length === 0 && (
          <p>No Connected Facebook Accounts. Connect to One.</p>
        )}
        {fbAccountSuccess &&
          fbAccountData.length > 0 &&
          fbAccountData.map((fbAccount) => (
            <div
              className={`flex items-center  p-2  gap-4  ${
                fbAccount.facebookId === currentFacebookAccount
                  ? "bg-muted rounded-lg"
                  : ""
              }`}
              key={fbAccount.id}
            >
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => dispatch(setCurrentConnectedAccount(fbAccount))}
              >
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {fbAccount.fbFullName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {fbAccount.fbFullName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {fbAccount.facebookId}
                  </p>
                </div>
              </div>
              <div className="ml-auto font-medium">
                <button
                  className="text-xs"
                  onClick={() => disconnectFbAccount(fbAccount.facebookId)}
                >
                  <Trash className="h-4 w-4 hover:text-destructive" />
                </button>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default ConnectedFacebookAccountsList;
