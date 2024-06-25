import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import conf from "@/config";
// import { useToast } from "../ui/use-toast";
import { toast } from "sonner";

const UserForm = () => {
  const formSchema = z.object({
    fullName: z.string({ required_error: "Full Name is Required" }),
    userRole: z
      .enum(["USER", "ADMIN"], {
        message: "Invalid user type",
      })
      .default("USER"),
    username: z
      .string({ required_error: "UserName is Required" })
      .min(2, { message: "Invalid Username" }),
    password: z
      .string({ required_error: "Password is Required" })
      .min(6, { message: "Minimum 6 Character Required for Password" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      userRole: "USER",
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    toast("Creating User...");
    try {
      const response = await axios.post(
        `${
          data.userRole === "USER"
            ? conf.API_URL + "/users/createEmployee"
            : conf.API_URL + "/users/createAdmin"
        }`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        }
      );

      if (response.status === 200) {
        form.reset();
        toast.success(
          `${
            data.userRole === "USER" ? "EMPLOYEE" : "ADMIN"
          } Created Successfully`,
          {
            description: `User Name: ${response.data.data.username}`,
          }
        );
      } else {
        toast.error("Failed to create User", {
          description: response.data.error.message || "Something went wrong",
        });
      }
      console.log(response);
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error("Failed to create User", {
        description: error.response.data.message || "Something went wrong",
      });
    }
  }

  return (
    <Card className="mt-8 w-96 mx-auto ">
      <CardHeader>
        <CardTitle>Add User</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name<span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Username<span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password<span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User Type Field */}
            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    User Type <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select User Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USER">EMPLOYEE</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
