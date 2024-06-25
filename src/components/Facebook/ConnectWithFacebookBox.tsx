import { FaFacebook } from "react-icons/fa";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { fbLogin } from "@/utils/FacebookSDK";
import axios from "axios";
import conf from "@/config";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ConnectWithFacebookBox = () => {
  const queryClient = useQueryClient();
  function login() {
    console.log("reached log in button");
    fbLogin().then((response: any) => {
      console.log(response);
      if (response.status === "connected") {
        console.log("Person is connected");
        axios
          .post(
            `${conf.API_URL}/fb/connectFbAccount`,
            {
              access_token: response.authResponse.accessToken,
              facebookId: response.authResponse.userID,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "exampleRefreshToken"
                )}`,
              },
            }
          )
          .then((response) => {
            if (response.data.success) {
              queryClient.invalidateQueries({
                queryKey: ["connectedFacebookAccount"],
                type: "active",
              });
              toast.success("Login Successful", {
                description: "You have successfully logged in",
              });
            }
          })
          .catch((error) => {
            console.log(error.response.data.message);
            toast.error("Login Failed", {
              description: `Login failed. Please try again. Error: ${
                error.response.data.message || ""
              }`,
            });
          });
      } else {
        // something
        toast.error("Login Failed", {
          description: "Login failed. Please try again",
        });
      }
    });
  }
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Connect With facebook</CardTitle>
        <CardDescription className="  leading-relaxed">
          Connect with Facebook to fetch your ad accounts and campaigns.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          className=" bg-facebook hover:bg-blue-700 text-white"
          onClick={() => login()}
        >
          Connect With Facebook <FaFacebook size={"sm"} className="ml-3 " />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectWithFacebookBox;
