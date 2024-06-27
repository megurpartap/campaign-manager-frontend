import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetAllEmployees } from "@/hooks/useGetAllEmployees";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";
import conf from "@/config";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const formSchema = z.object({
  employeeId: z
    .string({ required_error: "Employee is Required" })
    .min(2, { message: "Invalid Employee" }),
});

const GrantAccessButton = ({ table }: any) => {
  const currentFacebookId = useSelector(
    (state: RootState) => state.facebook.currentConnectedAccount.facebookId
  );
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
    },
  });
  const { data: AllEmployeesData, isError: AllEmployeesError } =
    useGetAllEmployees();

  if (AllEmployeesError) {
    toast.error("Failed to fetch Employees");
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const rowData = table.getFilteredSelectedRowModel().rows.map((row: any) => {
      return {
        adAccountId: row.original.id,
        adAccountName: row.original.name,
        facebookId: currentFacebookId,
      };
    });
    console.log(table.getFilteredSelectedRowModel().rows);
    try {
      const response = await axios.post(
        `${conf.API_URL}/fb/grantAdAccountAccess`,
        {
          userToGrantId: data.employeeId,
          adAccountData: rowData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Access Granted Successfully", {
          description: `Access to Ad Accounts has been granted.`,
        });
        setOpen(false);
      }
    } catch (error: any) {
      toast.error("Failed to grant access", {
        description:
          error.response.message || "Failed to grant access to Ad Account",
      });
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-7 gap-1">
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Grant {table.getFilteredSelectedRowModel().rows.length} Ad
              Accounts
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Employee</DialogTitle>
            <DialogDescription>
              Who do you want to grant access to Selected ad account(s)?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between w-full",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? AllEmployeesData!.find(
                                      (employee) => employee.id === field.value
                                    )?.fullName
                                  : "Select Employee"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-80">
                            <Command>
                              <CommandInput placeholder="Search Employee..." />
                              <CommandEmpty>No Employee Found.</CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {AllEmployeesData!.map((employee) => (
                                    <CommandItem
                                      value={employee.id}
                                      key={employee.id}
                                      onSelect={() => {
                                        form.setValue(
                                          "employeeId",
                                          employee.id
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          employee.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {employee.fullName}
                                      <span className="text-muted-foreground ml-3">
                                        - {employee.username}
                                      </span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GrantAccessButton;
