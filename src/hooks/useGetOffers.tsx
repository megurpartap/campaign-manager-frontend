import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";

export const useGetOffers = () => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const response = await axios.get(`${conf.API_URL}/offers/getOffers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "exampleRefreshToken"
          )}`,
        },
      });
      return response.data.data;
    },
    staleTime: 1000 * 60 * 3,
  });
};
