import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get(`${conf.API_URL}/admins/getAllUsers`, {
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
