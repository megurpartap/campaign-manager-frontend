import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";
// import { CampaignType } from "@/components/Tables/CampaignTable/Columns";
import { AdAccountType } from "@/components/Tables/AdminAdAccountTable/Columns";

export const useGetAdAccountsOfFbAccount = (
  fbAccount: string | null | undefined
) => {
  return useQuery({
    queryKey: ["adAccountOfFbAccount", fbAccount],
    queryFn: async () => {
      const response = await axios.get(
        `${conf.API_URL}/fb/getAdAccountsOfFbAccount?facebookId=${fbAccount}`,
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
      return response.data.data.data as AdAccountType[];
    },
    meta: {
      adAccountId: fbAccount,
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!fbAccount,
  });
};
