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

const OfferForm = () => {
  const formSchema = z.object({
    offerURL: z
      .string({ required_error: "offerURL is Required" })
      .url({ message: "Invalid URL" }),
    offerType: z
      .enum(["DIRECT", "ADVERTORIAL"], {
        message: "Invalid offer type",
      })
      .default("DIRECT"),
    country: z
      .string({ required_error: "Country is Required" })
      .min(2, { message: "Invalid country" }),
    languages: z
      .string({ required_error: "Language is Required" })
      .min(2, { message: "Invalid languages" }),
    offerName: z.string().optional(),
  });

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offerURL: "",
      offerType: "DIRECT",
      country: "",
      languages: "",
      offerName: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "Creating Offer...",
    });
    try {
      const response = await axios.post(
        `${conf.API_URL}/offers/createOffer`,
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
          title: "Offer Created Successfully",
          description: `Offer Name: ${response.data.data.offerName}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to create Offer",
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
    <Card className="mt-8 w-96 mx-auto ">
      <CardHeader>
        <CardTitle>Add Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Offer Url Field */}
            <FormField
              control={form.control}
              name="offerURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Offer URL<span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Offer Type Field */}
            <FormField
              control={form.control}
              name="offerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Offer Type <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Offer Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DIRECT">Direct</SelectItem>
                      <SelectItem value="ADVERTORIAL">Advertorial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Country Field. still need to fetch country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Country <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? countries.find(
                                (country) => country.value === field.value
                              )?.label
                            : "Select Country"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {countries.map((country) => (
                              <CommandItem
                                value={country.label}
                                key={country.value}
                                onSelect={() => {
                                  form.setValue("country", country.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    country.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {country.label}
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

            {/* Language Field. still need to fetch languages */}
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Language <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value
                              )?.label
                            : "Select language"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("languages", language.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    language.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {language.label}
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

            {/* Suffix Field */}
            <FormField
              control={form.control}
              name="offerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suffix </FormLabel>
                  <FormControl>
                    <Input placeholder="Offer Name (Optional)" {...field} />
                  </FormControl>
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

export default OfferForm;
