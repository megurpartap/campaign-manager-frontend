import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import countries from "@/constants/countries.json";
import languages from "@/constants/languages.json";
import axios from "axios";
import conf from "@/config";
import { useToast } from "../ui/use-toast";
import { get } from "http";
import { useEffect, useState } from "react";
import specialAdCategories from "@/constants/specialAdCategories.json";
import { Checkbox } from "../ui/checkbox";

interface adAccountType {
  id: string;
  name: string;
}

interface pageType {
  id: string;
  name: string;
}

interface offerType {
  id: string;
  offerName: string;
}

const CampaignForm = () => {
  const { toast } = useToast();
  const [adAccounts, setAdAccounts] = useState([]);
  const [pages, setPages] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    async function fetchAdAccounts() {
      try {
        const response = await axios.get(`${conf.API_URL}/fb/getAdAccounts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        });
        setAdAccounts(response.data.data.data);
        console.log(adAccounts);
      } catch (error: any) {
        alert("Failed to fetch Ad Accounts. Please try again later.");
        console.error(error.message);
      }
    }
    fetchAdAccounts();
  }, []);

  useEffect(() => {
    async function getPages() {
      try {
        const response = await axios.get(`${conf.API_URL}/fb/getFbPages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        });
        setPages(response.data.data.data);
        console.log(pages);
      } catch (error: any) {
        alert("Failed to fetch Pages. Please try again later.");
        console.error(error.message);
      }
    }
    getPages();
  }, []);

  useEffect(() => {
    async function getOffers() {
      try {
        const response = await axios.get(
          `${conf.API_URL}/offers/getOfferNames`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "exampleRefreshToken"
              )}`,
            },
          }
        );
        setOffers(response.data.data);
      } catch (error: any) {
        alert("Failed to fetch Offers. Please try again later.");
        console.error(error.message);
      }
    }
    getOffers();
  }, []);

  const formSchema = z.object({
    // campaign creation
    adAccountId: z.string({ required_error: "Ad Account is Required" }),
    pageId: z.string({ required_error: "Page is Required" }),
    offerId: z.string({ required_error: "Offer is Required" }),
    campaignObjective: z.enum(
      [
        "OUTCOME_APP_PROMOTION",
        "OUTCOME_AWARENESS",
        "OUTCOME_ENGAGEMENT",
        "OUTCOME_LEADS",
        "OUTCOME_SALES",
        "OUTCOME_TRAFFIC",
      ],
      {
        required_error: "Campaign Objective is Required",
        message: "Invalid Campaign Objective",
      }
    ),
    campaignStatus: z.enum(["ACTIVE", "PAUSED", "DELETED", "ARCHIIVED"], {
      required_error: "Campaign Status is Required",
      message: "Invalid Campaign Status",
    }),
    special_ad_categories: z.array(
      z.enum(["EMPLOYMENT", "HOUSING", "CREDIT", "ISSUES_ELECTIONS_POLITICS"])
    ),
    // ################################################
    // ad set creation
    adSetName: z.string({ required_error: "Ad Set Name is Required" }),
    daily_budget: z.string({ message: "Enter a number only" }).refine(
      (n) => {
        // check if the given string converted to number is NAN
        if (isNaN(Number(n))) return false;
        const decimalPLaces = n.split(".")[1];
        if (decimalPLaces === undefined) return true;
        return decimalPLaces.length <= 2;
      },
      { message: "Max precision is 2 decimal places" }
    ),
    adSetStatus: z.enum(["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"], {
      required_error: "Status is Required",
      message: "Invalid Status",
    }),
    billingEvent: z.enum(["IMPRESSIONS", "LINK_CLICKS", "POST_ENGAGEMENT"], {
      required_error: "Billing Event is Required",
      message: "Invalid Billing Event",
    }),
    bidAmount: z.string({ message: "Enter a number only" }).refine(
      (n) => {
        // check if the given string converted to number is NAN
        if (isNaN(Number(n))) return false;
        const decimalPLaces = n.split(".")[1];
        if (decimalPLaces === undefined) return true;
        return decimalPLaces.length <= 2;
      },
      { message: "Max precision is 2 decimal places" }
    ),
  });

  // const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adAccountId: undefined,
      pageId: undefined,
      offerId: undefined,
      campaignObjective: "OUTCOME_SALES",
      campaignStatus: "PAUSED",
      special_ad_categories: [],
      adSetName: undefined,
      daily_budget: undefined,
      adSetStatus: "PAUSED",
      billingEvent: "IMPRESSIONS",
      bidAmount: "1",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "Creating Campaign...",
    });
    try {
      const response = await axios.post(
        `${conf.API_URL}/campaigns/createFbCampaign`,
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
        toast({
          variant: "success",
          title: "Campaign Created Successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to create Campaign",
          description: response.data.error.message || "Something went wrong",
        });
      }
      console.log(response);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create Offer",
        description: error.message || "Something went wrong",
      });
    }
  }

  return (
    <Card className="mt-8 w-full mx-auto ">
      <CardHeader>
        <CardTitle>Create Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Ad Account Id */}
            <FormField
              control={form.control}
              name="adAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Ad Account
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ad Account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adAccounts.map((adAccount: adAccountType) => (
                        <SelectItem key={adAccount.id} value={adAccount.id}>
                          {adAccount.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Page Id */}
            <FormField
              control={form.control}
              name="pageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Page
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Page" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pages.map((page: pageType) => (
                        <SelectItem key={page.id} value={page.id}>
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Offer ID*/}
            <FormField
              control={form.control}
              name="offerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Offer
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Offer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {offers.map((offer: offerType) => (
                        <SelectItem key={offer.id} value={offer.id}>
                          {offer.offerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campaign Objective*/}
            <FormField
              control={form.control}
              name="campaignObjective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Campaign Objective
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Campaign Objective" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OUTCOME_SALES">Sales</SelectItem>
                      <SelectItem value="OUTCOME_APP_PROMOTION">
                        App Promotion
                      </SelectItem>
                      <SelectItem value="OUTCOME_AWARENESS">
                        Awareness
                      </SelectItem>
                      <SelectItem value="OUTCOME_ENGAGEMENT">
                        Engagement
                      </SelectItem>
                      <SelectItem value="OUTCOME_LEADS">Leads</SelectItem>
                      <SelectItem value="OUTCOME_TRAFFIC">Traffic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Special Ad Categories */}
            <FormField
              control={form.control}
              name="special_ad_categories"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Special Ad Categories
                    </FormLabel>
                    <FormDescription>
                      Select the items if the campaign is related to any of the
                      special ad categories. Leave empty if none.
                    </FormDescription>
                  </div>
                  {specialAdCategories.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="special_ad_categories"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  console.log(field.value);
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ##################### Ad Set Creation ##################### */}

            {/* Ad Set Name */}
            <FormField
              control={form.control}
              name="adSetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ad Set Name
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Daily Budget */}
            <FormField
              control={form.control}
              name="daily_budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Daily Budget
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Billing Event */}

            <FormField
              control={form.control}
              name="billingEvent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Billing Event
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Billing Event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IMPRESSIONS">Impressions</SelectItem>
                      <SelectItem value="LINK_CLICKS">Link Clicks</SelectItem>
                      <SelectItem value="POST_ENGAGEMENT">
                        Post Engagement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* bid amount */}
            <FormField
              control={form.control}
              name="bidAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bid Amount
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Input {...field} />
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

export default CampaignForm;
