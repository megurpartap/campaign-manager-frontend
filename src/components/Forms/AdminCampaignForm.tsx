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
import axios from "axios";
import conf from "@/config";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import specialAdCategories from "@/constants/specialAdCategories.json";
import callToActionTypes from "@/constants/callToActionTypes.json";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { InputTags } from "../ui/inputTags";
import MultipleSelector from "../ui/multipleSelector";
import { useGetOfferNames } from "@/hooks/useGetOfferNames";
import { useGetAdminConnectedFbAccounts } from "@/hooks/useGetConnectedFbAccounts";
import { useGetAdAccountsOfFbAccount } from "@/hooks/useGetAdAccountsOfFbAccount";
import { useGetPagesOfFbAccount } from "@/hooks/useGetPagesOfFbAccount";

interface campaignResponseObject {
  campaignId?: string;
  adSetId?: string;
  adSetName?: string;
  imageHash?: string[];
  adCreativeId?: string;
  adCreativeName?: string;
}

const callToActionEnum = callToActionTypes.types as [string, ...string[]];

const AdminCampaignForm = () => {
  const [isCurrentOfferEU, setIsCurrentOfferEU] = useState(false);
  const [campaignResponse] = useState<campaignResponseObject>({});

  const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
  });

  const formSchema = z
    .object({
      // campaign creation
      facebookId: z.string(),
      adAccountId: z.string({ required_error: "Ad Account is Required" }),
      pageId: z.string({ required_error: "Page is Required" }),
      offerId: z.string({ required_error: "Product is Required" }),
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
      adSetName: z
        .string({ required_error: "Ad Set Name is Required" })
        .optional(),
      adImage: z.instanceof(FileList),
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
      adPrimaryText: z.string().optional(),
      multipleAdPrimaryText: z.array(z.string()),
      adHeadline: z.string().optional(),
      multipleAdHeadline: z.array(z.string()),
      adDescription: z.string().optional(),
      multipleAdDescription: z.array(z.string()).optional(),
      callToAction: z.enum(callToActionEnum),
      multipleCallToAction: z.array(optionSchema),
      pixelId: z.string().optional(),
      isDynamicCreative: z.boolean(),
      beneficiaryName: z.string().optional(),
    })
    .refine((data) => data.adImage?.length > 0, {
      message: "File is required.",
      path: ["adImage"],
    })
    .refine(
      (data) =>
        (isCurrentOfferEU && data.beneficiaryName) ||
        (!isCurrentOfferEU && !data.beneficiaryName),
      {
        message:
          "Beneficiary Name is required as the product's country belong to EU.",
        path: ["beneficiaryName"],
      }
    );

  // const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facebookId: undefined,
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
      pixelId: undefined,
      isDynamicCreative: false,
      callToAction: "NO_BUTTON",
      adPrimaryText: undefined,
      adHeadline: undefined,
      adDescription: undefined,
      multipleAdPrimaryText: [],
      multipleAdHeadline: [],
      multipleAdDescription: [],
      multipleCallToAction: [],
      beneficiaryName: undefined,
    },
  });

  useEffect(() => {
    if (!isCurrentOfferEU) {
      form.setValue("beneficiaryName", undefined);
    }
  }, [isCurrentOfferEU]);

  const watchCampaignObjective = form.watch("campaignObjective");
  const watchDynamicCreative = form.watch("isDynamicCreative");
  const watchFacbookId = form.watch("facebookId");
  const fileRef = form.register("adImage");

  const {
    data: fbAccountData,
    isError: fbAccountError,
    isSuccess: fbAccountSuccess,
  } = useGetAdminConnectedFbAccounts();

  if (fbAccountError) {
    toast.error("Failed to fetch Facebook Accounts");
  }

  const {
    data: adAccountsData,
    isError: adAccountsError,
    isSuccess: adAccountsSuccess,
  } = useGetAdAccountsOfFbAccount(watchFacbookId);

  if (adAccountsError) {
    toast.error("Failed to fetch Ad Accounts");
  }

  const {
    data: pagesData,
    isError: pagesError,
    isSuccess: pagesSuccess,
  } = useGetPagesOfFbAccount(watchFacbookId);

  if (pagesError) {
    toast.error("Failed to fetch pages");
  }

  const {
    data: offersData,
    isSuccess: offersSuccess,
    isError: offersError,
  } = useGetOfferNames();

  if (offersError) {
    toast.error("Failed to fetch products");
  }

  async function getMultipleImageHash({
    uploadedFiles,
    adAccountId,
  }: {
    uploadedFiles: FileList | null;
    adAccountId: string;
  }) {
    console.log(uploadedFiles);
    if (!uploadedFiles || uploadedFiles.length == 0) {
      toast.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("adAccountId", adAccountId);
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append(`adImages`, uploadedFiles[i]);
    }
    try {
      const response = await axios.post(
        `${conf.API_URL}/fb/getMultipleImageHashAdmin`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem(
              "exampleRefreshToken"
            )}`,
          },
        }
      );
      if (response.data.success) return response.data.data.hashes;
      throw Error("Failed to upload image to Facebook");
    } catch (error: any) {
      toast.error("Failed to upload image", {
        description: error.message || "Something went wrong",
      });
      console.error(error.message);
    }
  }

  async function createCampaign(data: z.infer<typeof formSchema>) {
    // create campaign
    try {
      if (watchCampaignObjective == "OUTCOME_SALES" && !data.pixelId) {
        form.setError("pixelId", {
          message: "Pixel ID is required for Sales Campaigns",
        });
        return;
      }
      if (!data.adPrimaryText) {
        form.setError("adPrimaryText", {
          message: "Primary Text is required",
        });
        return;
      }
      if (!data.adHeadline) {
        form.setError("adHeadline", {
          message: "Headline is required",
        });
        return;
      }
      if (!data.callToAction) {
        form.setError("callToAction", {
          message: "Call to Action is required",
        });
        return;
      }
      toast("Creating Campaign...");
      const response = await axios.post(
        `${conf.API_URL}/campaigns/createFbCampaignAdmin`,
        {
          facebookId: data.facebookId,
          adAccountId: data.adAccountId,
          pageId: data.pageId,
          offerId: data.offerId,
          campaignObjective: data.campaignObjective,
          campaignStatus: data.campaignStatus,
          special_ad_categories: data.special_ad_categories,
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
        toast.success("Campaign Created Successfully");
        campaignResponse.campaignId = response.data.data.id;
        // create ad set
        toast("Creating Ad Set...");
        const adSetResponse = await axios.post(
          `${conf.API_URL}/campaigns/createFbAdSetAdmin`,
          {
            facebookId: data.facebookId,
            adAccountId: data.adAccountId,
            adSetName: data.adSetName,
            daily_budget: data.daily_budget,
            adSetStatus: data.adSetStatus,
            billingEvent: data.billingEvent,
            bidAmount: data.bidAmount,
            offerId: data.offerId,
            pageId: data.pageId,
            pixelId: data.pixelId,
            beneficiaryName: data.beneficiaryName,
            isDynamicCreative: watchDynamicCreative,
            campaignId: campaignResponse.campaignId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "exampleRefreshToken"
              )}`,
            },
          }
        );
        if (adSetResponse.status === 200) {
          toast.success("Ad Set Created Successfully");
          campaignResponse.adSetId = adSetResponse.data.data.id;
          campaignResponse.adSetName = adSetResponse.data.data.name;
          toast("Uploading Image...");
          const imageHash = await getMultipleImageHash({
            uploadedFiles: data.adImage,
            adAccountId: data.adAccountId,
          });
          if (imageHash) {
            toast.success("Image Uploaded Successfully");
            campaignResponse.imageHash = imageHash;
            // create ad
            toast("Creating AdCreative...");
            const adResponse = await axios.post(
              `${conf.API_URL}/campaigns/createFbAdCreativeAdmin`,
              {
                facebookId: data.facebookId,
                adAccountId: data.adAccountId,
                pageId: data.pageId,
                offerId: data.offerId,
                isDynamicCreative: data.isDynamicCreative,
                imageHash: campaignResponse.imageHash,
                adPrimaryText: data.adPrimaryText,
                adHeadline: data.adHeadline,
                adDescription: data.adDescription,
                callToAction: data.callToAction,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "exampleRefreshToken"
                  )}`,
                },
              }
            );
            if (adResponse.status === 200) {
              toast.success("Ad Creative Created Successfully");
              campaignResponse.adCreativeId = adResponse.data.data.id;
              campaignResponse.adCreativeName = adResponse.data.data.name;
              toast("Creating Ad...");
              const finalAdResponse = await axios.post(
                `${conf.API_URL}/campaigns/createFbAdAdmin`,
                {
                  facebookId: data.facebookId,
                  adCreativeName: campaignResponse.adCreativeName,
                  adAccountId: data.adAccountId,
                  adSetId: campaignResponse.adSetId,
                  adCreativeId: campaignResponse.adCreativeId,
                  adStatus: "PAUSED",
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "exampleRefreshToken"
                    )}`,
                  },
                }
              );
              if (finalAdResponse.status === 200) {
                toast.success("Ad Created Successfully");
              } else {
                toast.error("Failed to create Ad", {
                  description:
                    adResponse.data.error.message || "Something went wrong",
                });
              }
            } else {
              toast.error("Failed to create Ad Creative", {
                description:
                  adResponse.data.error.message || "Something went wrong",
              });
            }
          }
        } else {
          toast.error("Failed to create Ad Set", {
            description:
              adSetResponse.data.error.message || "Something went wrong",
          });
        }
      } else {
        toast.error("Failed to create Campaign", {
          description: response.data.error.message || "Something went wrong",
        });
      }
      console.log(response);
    } catch (error: any) {
      toast.error("Failed to create Campaign", {
        description: error.message || "Something went wrong",
      });
    }
  }

  async function createDynamicCampaign(data: z.infer<typeof formSchema>) {
    console.log("clicked");
    // create Dynamic campaign
    try {
      if (watchCampaignObjective == "OUTCOME_SALES" && !data.pixelId) {
        form.setError("pixelId", {
          message: "Pixel ID is required for Sales Campaigns",
        });
        return;
      }
      if (
        data.multipleAdPrimaryText.length == 0 ||
        data.multipleAdHeadline.length == 0
      ) {
        form.setError("isDynamicCreative", {
          message:
            "Atleast one value is required in Primary Text, Headline, Description and Call to Action",
        });
        return;
      }
      toast("Creating Campaign...");
      const response = await axios.post(
        `${conf.API_URL}/campaigns/createFbCampaignAdmin`,
        {
          facebookId: data.facebookId,
          adAccountId: data.adAccountId,
          pageId: data.pageId,
          offerId: data.offerId,
          campaignObjective: data.campaignObjective,
          campaignStatus: data.campaignStatus,
          special_ad_categories: data.special_ad_categories,
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
        toast.success("Campaign Created Successfully");
        campaignResponse.campaignId = response.data.data.id;
        // create ad set
        toast("Creating Ad Set...");
        const adSetResponse = await axios.post(
          `${conf.API_URL}/campaigns/createFbAdSetAdmin`,
          {
            facebookId: data.facebookId,
            adAccountId: data.adAccountId,
            adSetName: data.adSetName,
            daily_budget: data.daily_budget,
            adSetStatus: data.adSetStatus,
            billingEvent: data.billingEvent,
            bidAmount: data.bidAmount,
            beneficiaryName: data.beneficiaryName,
            offerId: data.offerId,
            pageId: data.pageId,
            pixelId: data.pixelId,
            isDynamicCreative: watchDynamicCreative,
            campaignId: campaignResponse.campaignId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "exampleRefreshToken"
              )}`,
            },
          }
        );
        if (adSetResponse.status === 200) {
          toast.success("Ad Set Created Successfully");
          campaignResponse.adSetId = adSetResponse.data.data.id;
          campaignResponse.adSetName = adSetResponse.data.data.name;
          toast("Uploading Image...");
          const imageHash = await getMultipleImageHash({
            uploadedFiles: data.adImage,
            adAccountId: data.adAccountId,
          });
          if (imageHash) {
            toast.success("Image Uploaded Successfully");
            campaignResponse.imageHash = imageHash;
            // create ad
            toast("Creating AdCreative...");
            const adResponse = await axios.post(
              `${conf.API_URL}/campaigns/createFbDynamicAdCreativeAdmin`,
              {
                facebookId: data.facebookId,
                adAccountId: data.adAccountId,
                pageId: data.pageId,
                offerId: data.offerId,
                isDynamicCreative: data.isDynamicCreative,
                imageHash: campaignResponse.imageHash,
                adPrimaryText: data.multipleAdPrimaryText,
                adHeadline: data.multipleAdHeadline,
                adDescription: data.multipleAdDescription,
                callToAction: data.multipleCallToAction,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "exampleRefreshToken"
                  )}`,
                },
              }
            );
            if (adResponse.status === 200) {
              toast.success("Ad Creative Created Successfully");
              campaignResponse.adCreativeId = adResponse.data.data.id;
              campaignResponse.adCreativeName = adResponse.data.data.name;
              toast("Creating Ad...");
              const finalAdResponse = await axios.post(
                `${conf.API_URL}/campaigns/createFbAdAdmin`,
                {
                  facebookId: data.facebookId,
                  adCreativeName: campaignResponse.adCreativeName,
                  adAccountId: data.adAccountId,
                  adSetId: campaignResponse.adSetId,
                  adCreativeId: campaignResponse.adCreativeId,
                  adStatus: "PAUSED",
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "exampleRefreshToken"
                    )}`,
                  },
                }
              );
              if (finalAdResponse.status === 200) {
                toast.success("Ad Created Successfully");
              } else {
                toast.error("Failed to create Ad", {
                  description:
                    adResponse.data.error.message || "Something went wrong",
                });
              }
            } else {
              toast.error("Failed to create Ad Creative", {
                description:
                  adResponse.data.error.message || "Something went wrong",
              });
            }
          }
        } else {
          toast.error("Failed to create Ad Set", {
            description:
              adSetResponse.data.error.message || "Something went wrong",
          });
        }
      } else {
        toast.error("Failed to create Campaign", {
          description: response.data.error.message || "Something went wrong",
        });
      }
      console.log(response);
    } catch (error: any) {
      toast.error("Failed to create Campaign", {
        description: error.message || "Something went wrong",
      });
    }
  }

  return (
    <Card className="mt-8 w-full mx-auto ">
      <CardHeader>
        <CardTitle>Create Admin Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              watchDynamicCreative ? createDynamicCampaign : createCampaign
            )}
            className="space-y-4"
          >
            {/* Facebook Account Id */}
            <FormField
              control={form.control}
              name="facebookId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Facebook Account
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Facebook Account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fbAccountSuccess &&
                        fbAccountData.length > 0 &&
                        fbAccountData.map((fbAccount) => (
                          <SelectItem
                            key={fbAccount.facebookId}
                            value={fbAccount.facebookId}
                          >
                            {fbAccount.fbFullName}
                          </SelectItem>
                        ))}
                      {fbAccountSuccess && fbAccountData.length == 0 && (
                        <SelectItem value="No Facebook Accounts Found" disabled>
                          No Facebook Accounts Found in your account. Please
                          connect to one in the Settings Menu.
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ad Account Id */}
            {watchFacbookId && (
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
                        {adAccountsSuccess &&
                          adAccountsData.length > 0 &&
                          adAccountsData.map((adAccount) => (
                            <SelectItem key={adAccount.id} value={adAccount.id}>
                              {adAccount.name}
                              {"  "}
                              <span className="text-muted-foreground">
                                ({adAccount.id.slice(4)})
                              </span>
                            </SelectItem>
                          ))}
                        {adAccountsSuccess && adAccountsData.length == 0 && (
                          <SelectItem
                            value="No Ad Accounts Found"
                            disabled={true}
                          >
                            No Ad Accounts Found in your account. Please contact
                            your admin.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Page Id */}
            {watchFacbookId && (
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
                        {pagesSuccess &&
                          pagesData.length > 0 &&
                          pagesData.map((page) => (
                            <SelectItem key={page.id} value={page.id}>
                              {page.name}
                              {"  "}
                              <span className="text-muted-foreground">
                                ({page.id.slice(4)})
                              </span>
                            </SelectItem>
                          ))}
                        {pagesSuccess && pagesData.length == 0 && (
                          <SelectItem value="No Pages Found" disabled={true}>
                            No Pages Found in your account. Please contact your
                            admin.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Offer ID*/}
            <FormField
              control={form.control}
              name="offerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Select Product
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Select
                    onValueChange={(e) => {
                      const offerParam = e.split("__");
                      setIsCurrentOfferEU(offerParam[1] === "true");
                      field.onChange(offerParam[0]);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {offersSuccess &&
                        offersData.length > 0 &&
                        offersData.map((offer) => (
                          <SelectItem
                            key={offer.id}
                            value={`${offer.id}__${offer.isEU}`}
                          >
                            <b>OF-{offer.offerSequenceId}</b>
                            <span className="ml-3">{offer.offerName}</span>
                          </SelectItem>
                        ))}
                      {offersSuccess && offersData.length == 0 && (
                        <SelectItem value="No Products Found" disabled={true}>
                          No Products Found in your account. Please contact your
                          admin.
                        </SelectItem>
                      )}
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
                                // @ts-ignore
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
                  <FormLabel>Ad Set Name</FormLabel>
                  <Input {...field} placeholder="Ad Set Name (Optional)" />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Beneficiary Name */}
            {isCurrentOfferEU && (
              <FormField
                control={form.control}
                name="beneficiaryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Beneficiary & Payer Name
                      <span className="text-destructive"> *</span>
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder="Name of the Beneficiary and Payer"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            {/* pixel Id */}
            {watchCampaignObjective == "OUTCOME_SALES" && (
              <FormField
                control={form.control}
                name="pixelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pixel ID
                      <span className="text-destructive"> *</span>
                    </FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* dynamic Creative */}
            <FormField
              control={form.control}
              name="isDynamicCreative"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="mt-2">
                    Dynamic Creative
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload Image input type file */}

            <FormField
              control={form.control}
              name="adImage"
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>
                      Upload{" "}
                      {watchDynamicCreative ? "Multiple Files" : "Single File"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        multiple={watchDynamicCreative}
                        placeholder="shadcn"
                        accept="image/*"
                        {...fileRef}
                        onChange={(e) => {
                          console.log(e.target.files);
                          if (!e.target.files || e.target.files?.length < 1)
                            return;
                          const isBig = Array.from(e.target.files).some(
                            (file) => {
                              if (file.size > 31457280) {
                                return true;
                              }
                              return false;
                            }
                          );
                          if (isBig) {
                            toast.error("File size should be less than 30MB");
                            return;
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Call To Action */}
            {!watchDynamicCreative && (
              <FormField
                control={form.control}
                name="callToAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Call To Action
                      <span className="text-destructive"> *</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Call To Action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {callToActionTypes.mapFunction.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* multiple Call To action */}
            {watchDynamicCreative && (
              <FormField
                control={form.control}
                name="multipleCallToAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Multiple Ad Call to Action(s)</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        defaultOptions={callToActionTypes.mapFunction}
                        placeholder="Select Call To Action Types"
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                          </p>
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Ad Primary Text */}
            {!watchDynamicCreative && (
              <FormField
                control={form.control}
                name="adPrimaryText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ad Primary Text
                      <span className="text-destructive"> *</span>
                    </FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* multiple Primary Text */}
            {watchDynamicCreative && (
              <FormField
                control={form.control}
                name="multipleAdPrimaryText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Multiple Ad Primary Text(s)</FormLabel>
                    <FormControl>
                      <InputTags {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Ad Headline */}
            {!watchDynamicCreative && (
              <FormField
                control={form.control}
                name="adHeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ad Headline
                      <span className="text-destructive"> *</span>
                    </FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* multiple Ad Headline */}
            {watchDynamicCreative && (
              <FormField
                control={form.control}
                name="multipleAdHeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Multiple Ad Headline(s)</FormLabel>
                    <FormControl>
                      <InputTags {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Ad Description */}
            {!watchDynamicCreative && (
              <FormField
                control={form.control}
                name="adDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Description</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* multiple Ad Descriptions */}
            {watchDynamicCreative && (
              <FormField
                control={form.control}
                name="multipleAdDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Multiple Ad Description(s)</FormLabel>
                    <FormControl>
                      <InputTags {...field} value={field.value || []} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdminCampaignForm;
