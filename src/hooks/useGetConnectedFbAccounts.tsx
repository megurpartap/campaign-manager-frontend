import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";

interface ConnectedFacebookAccount {
  facebookId: string;
  fbFullName: string;
  id: string;
}

export const useGetAdminConnectedFbAccounts = () => {
  return useQuery({
    queryKey: ["connectedFacebookAccount"],
    queryFn: async () => {
      const response = await axios.get(
        `${conf.API_URL}/admins/getAdminConnectedFbAccounts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        }
      );
      console.log(response.data.data);
      return response.data.data as ConnectedFacebookAccount[];
    },
    staleTime: 1000 * 60 * 3,
  });
};
