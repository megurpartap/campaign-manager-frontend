import { PlusCircle, RefreshCwIcon, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import OfferForm from "../Forms/OfferForm";
import CampaignForm from "../Forms/CampaignForm";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UserForm from "../Forms/UserForm";

interface TopbarProps {
  currentPage: "offer" | "campaign" | "user";
}

const currentPageObject = {
  offer: {
    title: "Product",
    description: "This Page is only visible to the admin.",
    formComponent: <OfferForm />,
    refetch: [["offers"]],
  },
  campaign: {
    title: "Campaign",
    description: "This Page is publicly visible",
    formComponent: <CampaignForm />,
    refetch: [["campaigns"], ["adAccounts"]],
  },
  user: {
    title: "User",
    description: "This Page is only visible to the admin.",
    formComponent: <UserForm />,
    refetch: [["users"]],
  },
};

const Topbar = ({ currentPage }: TopbarProps) => {
  const queryClient = useQueryClient();
  const handleRefetch = async () => {
    await Promise.all(
      currentPageObject[currentPage].refetch.map((key) => {
        toast(`Refreshing ${key[0]}`);
        return queryClient
          .refetchQueries(
            {
              queryKey: key,
              type: "active",
            },
            {
              throwOnError: true,
            }
          )
          .then(() => {
            toast.success(`${key[0]} Refreshed`);
          })
          .catch((error) => {
            console.log(error);
            toast.error(`Cannot Refresh ${key[0]}`);
          });
      })
    ).catch((error) => {
      console.log(error);
      toast.error(
        `Some Error Occures while refreshing ${currentPageObject[currentPage].title}s`
      );
    });

    // queryClient
    //   .refetchQueries(
    //     {
    //       queryKey: currentPageObject[currentPage].refetch,
    //       type: "active",
    //     },
    //     {
    //       throwOnError: true,
    //     }
    //   )
    //   .then(() => {
    //     toast.success(`${currentPageObject[currentPage].title}s Refreshed`);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toast.error(`Cannot Refresh ${currentPageObject[currentPage].title}s`);
    //   });
  };
  return (
    <>
      <div className="flex justify-between  px-8  items-center gap-3">
        <div className="relative grow ">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${currentPageObject[currentPage].title}s.....`}
            className="w-full rounded-lg bg-background pl-8 "
          ></Input>
        </div>
        <div className=" flex gap-3">
          {/* Sheet - Slider to open form */}
          <Button className="h-10 gap-1" onClick={handleRefetch}>
            <RefreshCwIcon className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="h-10 gap-1">
                <PlusCircle className="h-5 w-5 mr-2" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {`Add ${currentPageObject[currentPage].title}`}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent className=" max-w-sm sm:max-w-4xl overflow-y-scroll">
              <SheetHeader>
                <SheetTitle>
                  {`Add ${currentPageObject[currentPage].title}`}
                </SheetTitle>
                <SheetDescription>
                  {currentPageObject[currentPage].description}
                </SheetDescription>
              </SheetHeader>
              {currentPageObject[currentPage].formComponent}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default Topbar;
