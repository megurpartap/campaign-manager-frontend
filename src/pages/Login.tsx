import { useEffect } from "react";
// import { fbLogin } from "@/utils/FacebookSDK";
import axios from "axios";
import conf from "@/config/index.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SignInForm from "@/components/Forms/SignInForm";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/features/user/userSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const rt = localStorage.getItem("exampleRefreshToken");
    if (rt && rt !== String(null)) {
      axios
        .get(`${conf.API_URL}/users/getUserLoginStatus`, {
          headers: {
            Authorization: `Bearer ${rt}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            toast.success("User Already Logged In");
            dispatch(setUserData(response.data.data.user));
            navigate("/dashboard/home");
          }
        });
    }
  }, []);

  // function login() {
  //   console.log("reached log in button");
  //   fbLogin().then((response: any) => {
  //     console.log(response);
  //     if (response.status === "connected") {
  //       console.log("Person is connected");
  //       localStorage.setItem("fbUserId", response.authResponse.userID);
  //       axios
  //         .post(
  //           `${conf.API_URL}/users/login`,
  //           {
  //             accessToken: response.authResponse.accessToken,
  //             userId: response.authResponse.userID,
  //           },
  //           {
  //             withCredentials: true,
  //           }
  //         )
  //         .then((response) => {
  //           if (response.data.success) {
  //             localStorage.setItem(
  //               "exampleRefreshToken",
  //               response.data.data.refreshToken
  //             );
  //             toast.success("Login Successful", {
  //               description: "You have successfully logged in",
  //             });
  //             navigate("/dashboard/home");
  //           }
  //         })
  //         .catch((error) => {
  //           console.log(error.response.data.message);
  //           toast.error("Login Failed", {
  //             description: `Login failed. Please try again. Error: ${
  //               error.response.data.message || ""
  //             }`,
  //           });
  //         });
  //     } else {
  //       // something
  //       toast.error("Login Failed", {
  //         description: "Login failed. Please try again",
  //       });
  //     }
  //   });
  // }

  return (
    <div className=" w-screen h-screen grid place-content-center">
      <h1 className="text-lg font-semibold md:text-3xl mb-3 text-center">
        Arb Drive
      </h1>
      <SignInForm />
    </div>
  );
}

export default Login;
