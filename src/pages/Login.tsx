import { FaFacebook } from "react-icons/fa";
import { useEffect } from "react";
import { fbLogin, getFacebookLoginStatus } from "@/utils/FacebookSDK";
import axios from "axios";
import conf from "@/config/index.js";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    const rt = localStorage.getItem("exampleRefreshToken");
    if (rt && rt !== String(null)) {
      axios
        .get(`${conf.API_URL}/users/getLoginStatus`, {
          headers: {
            Authorization: `Bearer ${rt}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            toast({
              variant: "success",
              title: "User Already Logged In",
            });
            navigate("/dashboard/home?login=true");
          }
        });
    }
  }, []);

  function login() {
    console.log("reached log in button");
    fbLogin().then((response: any) => {
      console.log(response);
      if (response.status === "connected") {
        console.log("Person is connected");
        localStorage.setItem("fbUserId", response.authResponse.userID);
        axios
          .post(
            `${conf.API_URL}/users/login`,
            {
              accessToken: response.authResponse.accessToken,
              userId: response.authResponse.userID,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            if (response.data.success) {
              localStorage.setItem(
                "exampleRefreshToken",
                response.data.data.refreshToken
              );
              toast({
                variant: "success",
                title: "Login Successful",
                description: "You have successfully logged in",
              });
              navigate("/dashboard/home");
            }
          })
          .catch((error) => {
            console.log(error.response.data.message);
            toast({
              variant: "destructive",
              title: "Login Failed",
              description: `Login failed. Please try again. Error: ${
                error.response.data.message || ""
              }`,
            });
          });
      } else {
        // something
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Login failed. Please try again",
        });
      }
    });
  }
  return (
    <div className=" w-screen h-screen grid justify-center items-center">
      <Button onClick={login} className=" bg-facebook hover:bg-blue-700">
        Login With <FaFacebook size={"sm"} className="ml-3" />
      </Button>
    </div>
  );
}

export default Login;
