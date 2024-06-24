import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";

interface OfferName {
  offerName: string;
  isEU: boolean;
  offerSequenceId: number;
  id: string;
}

export const useGetOfferNames = () => {
  return useQuery({
    queryKey: ["offerNames"],
    queryFn: async () => {
      const response = await axios.get(`${conf.API_URL}/offers/getOfferNames`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "exampleRefreshToken"
          )}`,
        },
      });
      console.log(response.data.data);
      return response.data.data as OfferName[];
    },
    staleTime: 1000 * 60 * 3,
  });
};
