import { FaFacebook } from "react-icons/fa";
import { useEffect } from "react";
import { fbLogin, getFacebookLoginStatus } from "@/utils/FacebookSDK";
import axios from "axios";
import conf from "@/config/index.js";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function Login() {
  useEffect(() => {
    axios.get(`${conf.API_URL}/users/getLoginStatus`).then((response) => {
      console.log(response.data);
    });
  }, []);
  const navigate = useNavigate();
  const { toast } = useToast();

  function login() {
    console.log("reached log in button");
    fbLogin().then((response: any) => {
      console.log(response);
      if (response.status === "connected") {
        console.log("Person is connected");
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
              toast({
                variant: "success",
                title: "Login Successful",
                description: "You have successfully logged in",
              });
              navigate("/dashboard/home");
            }
          })
          .catch((error) => {
            console.log(error);
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
