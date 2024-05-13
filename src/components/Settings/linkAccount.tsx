import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { AiOutlineLink } from "react-icons/ai";
import { RiInstagramFill, RiSnapchatFill } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import { BiWorld } from "react-icons/bi";
import Loader from "../Loaders/Loader";
import { DATABASE_ID, NEW_USER, db } from "@/appwrite/appwriteConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { useState } from "react";
import { Toaster } from "../ui/toaster";
import { toast } from "../ui/use-toast";
import { SiPaytm } from "react-icons/si";

const FormSchema = z.object({
  insta: z
    .string()
    .refine(
      (data) =>
        !data ||
        data.startsWith("https://instagram.com") ||
        data.startsWith("https://www.instagram.com")
    )
    .optional(),
  twitter: z
    .string()
    .refine(
      (data) =>
        !data ||
        data.startsWith("https://twitter.com") ||
        data.startsWith("https://www.twitter.com")
    )
    .optional(),
  snap: z
    .string()
    .refine(
      (data) =>
        !data ||
        data.startsWith("https://snapchat.com") ||
        data.startsWith("https://www.snapchat.com")
    )
    .optional(),
  paytm: z
    .string()
    .refine((data) => !data || data)
    .optional(),
  other: z
    .string()
    .refine((data) => !data || data.startsWith("https://"))
    .optional(),
});

export function LinkAccount({
  snap,
  twitter,
  insta,
  paytm,
  other,
}: {
  paytm?: string;
  snap?: string;
  twitter?: string;
  insta?: string;
  other?: string;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      insta: insta || "",
      snap: snap || "",
      twitter: twitter || "",
      other: other || "",
      paytm: paytm || "",
    },
  });
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const [submit, setSubmit] = useState<boolean>(false);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (uid) {
      try {
        setSubmit(true);
        await db.updateDocument(DATABASE_ID, NEW_USER, uid, {
          ...data,
          paytm: `upi://pay?pa=${data.paytm}@paytm&pn=PaytmUser`,
        });

        toast({
          title: "Profile updated",
        });
        setSubmit(false);
      } catch (error) {
        toast({
          title: "Something went wrong",
        });
        setSubmit(false);
      }
    }
  }

  return (
    <Drawer>
      <Toaster />
      <DrawerTrigger>
        <div className="animate-fade-up">
          <p className=" animate-fade-up bg-neutral-950 rounded-xl py-2.5 mt-3  flex px-4 text-base items-center space-x-1">
            <AiOutlineLink className="h-5 w-5" />
            <span>Link Account</span>
          </p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-dvh">
        <div className=" h-full flex justify-center items-center px-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-2"
            >
              <FormField
                control={form.control}
                name="insta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" ml-0.5 text-base flex mb-3 space-x-1.5 items-center">
                      <RiInstagramFill />
                      <p>Instagram link</p>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Instagram " {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="snap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" ml-0.5 text-base flex mb-3 space-x-1.5 items-center">
                      <RiSnapchatFill />
                      <p>Snapchat link</p>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input placeholder="Snapchat " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" ml-0.5 text-base flex mb-3 space-x-1.5 items-center">
                      <FaXTwitter />
                      <p>Twitter link</p>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input placeholder="Twitter " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paytm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" ml-0.5 text-base flex mb-3 space-x-1.5 items-center">
                      <SiPaytm />
                      <p>Paytm no</p>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input placeholder="Paytm no" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" ml-0.5 text-base flex mb-3 space-x-1.5 items-center">
                      <BiWorld />
                      <p>Other link</p>
                    </FormLabel>{" "}
                    <FormControl>
                      <Input required={false} placeholder="Other" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=""></div>
              <Button
                type="submit"
                variant={"secondary"}
                disabled={submit}
                className=" py-5 w-full rounded-xl border bg-neutral-950 animate-fade-up"
              >
                {submit ? (
                  <Loader size="20" loading={true} />
                ) : (
                  <p>Save changes</p>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
