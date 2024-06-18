import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";

interface AdAccount {
  id: string;
  name: string;
}

export const useGetAdAccounts = () => {
  return useQuery({
    queryKey: ["adAccounts"],
    queryFn: async () => {
      const response = await axios.get(`${conf.API_URL}/fb/getAdAccounts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "exampleRefreshToken"
          )}`,
        },
      });
      return response.data.data.data as AdAccount[];
    },
    staleTime: 1000 * 60 * 3,
  });
};
