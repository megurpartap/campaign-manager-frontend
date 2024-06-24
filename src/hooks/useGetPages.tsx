import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";

interface Page {
  pageId: string;
  pageName: string;
}

export const useGetPages = () => {
  return useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const response = await axios.get(
        `${conf.API_URL}/employees/getEmployeePages`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        }
      );
      console.log(response.data.data);
      return response.data.data as Page[];
    },
    staleTime: 1000,
  });
};
