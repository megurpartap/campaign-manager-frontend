import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";
// import { CampaignType } from "@/components/Tables/CampaignTable/Columns";
import { PageType } from "@/components/Tables/AdminPageTable/Columns";

export const useGetPagesOfFbAccount = (
  fbAccount: string | null | undefined
) => {
  return useQuery({
    queryKey: ["pageOfFbAccount", fbAccount],
    queryFn: async () => {
      const response = await axios.get(
        `${conf.API_URL}/fb/getPagesOfFbAccount?facebookId=${fbAccount}`,
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
      return response.data.data.data as PageType[];
    },
    meta: {
      pageId: fbAccount,
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!fbAccount,
  });
};
