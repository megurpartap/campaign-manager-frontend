import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";
import { CampaignType } from "@/components/Tables/CampaignTable/Columns";

export const useGetCampaignsAdmin = (
  adAccountId: string | null | undefined,
  facebookId: string | null | undefined
) => {
  return useQuery({
    queryKey: ["campaignsAdmin", adAccountId],
    queryFn: async () => {
      const response = await axios.get(
        `${conf.API_URL}/fb/getFbCampaignsAdmin?adAccountId=${adAccountId}&facebookId=${facebookId}`,
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
    staleTime: 1000 * 60 * 5,
    enabled: !!adAccountId && !!facebookId,
  });
};
