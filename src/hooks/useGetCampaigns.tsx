import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";
import { CampaignType } from "@/components/Tables/CampaignTable/Columns";

export const useGetCampaigns = (adAccountId: string) => {
  return useQuery({
    queryKey: ["campaigns", adAccountId],
    queryFn: async () => {
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
      return response.data.data.data as CampaignType[];
    },
    meta: {
      adAccountId: adAccountId,
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!adAccountId,
  });
};
