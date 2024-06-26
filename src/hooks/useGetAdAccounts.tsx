import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";

interface AdAccount {
  adAccountId: string;
  adAccountName: string;
}

export const useGetAdAccounts = () => {
  return useQuery({
    queryKey: ["adAccounts"],
    queryFn: async () => {
      const response = await axios.get(
        `${conf.API_URL}/employees/getEmployeeAdAccounts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        }
      );
      console.log(response.data.data);
      return response.data.data as AdAccount[];
    },
    staleTime: 1000 * 60 * 3,
  });
};
