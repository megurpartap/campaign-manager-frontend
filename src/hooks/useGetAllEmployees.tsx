import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import conf from "@/config";

type EmployeeType = {
  id: string;
  username: string;
  fullName: string;
};

export const useGetAllEmployees = () => {
  return useQuery({
    queryKey: ["allEmployees"],
    queryFn: async () => {
      const response = await axios.get(
        `${conf.API_URL}/employees/getAllEmployees`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        }
      );
      return response.data.data as EmployeeType[];
    },
    staleTime: 1000 * 60 * 3,
  });
};
