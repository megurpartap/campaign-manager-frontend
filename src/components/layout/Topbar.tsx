import { PlusCircle, Search } from "lucide-react";
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

interface TopbarProps {
  currentPage: "offer" | "campaign";
}

const currentPageObject = {
  offer: {
    title: "Offer",
    description: "This Page is only visible to the admin.",
    formComponent: <OfferForm />,
  },
  campaign: {
    title: "Campaign",
    description: "This Page is publicly visible",
    formComponent: <CampaignForm />,
  },
};

const Topbar = ({ currentPage }: TopbarProps) => {
  return (
    <>
      <div className="flex justify-between  items-center gap-3">
        <div className="relative mx-auto md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${currentPageObject[currentPage].title}s.....`}
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          ></Input>
        </div>

        {/* Sheet - Slider to open form */}
        <Sheet>
          <SheetTrigger>
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
    </>
  );
};

export default Topbar;
