import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DATABASE_ID,
  PLAYLIST_COLLECTION_ID,
  db,
  ID,
} from "@/appwrite/appwriteConfig";
import { Permission, Query, Role } from "appwrite";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  link: z.string().min(2),
  creator: z.string().min(2),
});
import { IoMdAdd } from "react-icons/io";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Loader from "../Loaders/Loader";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import {
  Drawer,
  DrawerClose,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { SpotifyTransfer } from "../SpotifyTransfer";
import { RootState } from "@/Store/Store";
import { useQueryClient } from "react-query";
import { toast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { savedPlaylist } from "@/Interface";

const AddLibrary: React.FC<{ clone?: boolean; id?: string }> = ({
  clone,
  id,
}) => {
  const close = useRef<HTMLButtonElement>(null);

  const [isSubmit, setIsSubmit] = useState<boolean>();
  const [error, setError] = useState<boolean>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      link: "",
      creator: "",
    },
  });
  const uid = useSelector((state: RootState) => state.musicReducer.uid);
  const q = useQueryClient();
  const n = useNavigate();
  useEffect(() => {
    clone && id && form.setValue("link", id);
    !clone && form.setValue("link", `custom${v4()}`);
  }, [clone, form, id]);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmit(true);

    try {
      if (uid) {
        const payload: savedPlaylist = {
          name: "new playlist",
          creator: data.creator,
          link: data.link,
          for: uid,
        };

        db.createDocument(
          DATABASE_ID,
          PLAYLIST_COLLECTION_ID,
          ID.unique(),
          payload,
          [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
        )
          .then(async () => {
            form.reset();
            await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
              Query.orderDesc("$createdAt"),
              Query.equal("for", [uid]),
            ]);
            close.current?.click();
            toast({
              description: "Playlist added to library",
            });
            await q.fetchQuery("savedPlaylist");
            clone && n("/library/");
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              description: "error saving playlist",
            });
            throw new Error(error);
          });
      }
    } catch (error) {
      setIsSubmit(false);
      setError(true);
      form.setValue("link", "");
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  }

  const handleReset = useCallback(() => {
    form.reset(), setIsSubmit(false);
  }, [form]);

  return (
    <Drawer>
      <DrawerTrigger className="w-full animate-fade-left">
        {clone ? (
          <IoMdAdd className="h-8 w-8  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
        ) : (
          <span className="text-center  justify-end px-3 flex  text-lg truncate">
            <IoMdAdd className="h-8 w-8 fill-zinc-100" />
          </span>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-[100dvh] rounded-none px-5">
        <div className="h-dvh items-center border-none justify-center flex flex-col w-full  rounded-2xl">
          <DrawerHeader>
            <DrawerTitle className="text-xl tracking-tighter leading-tight animate-fade-down  font-semibold">
              {clone ? "Save this playlist" : "Create your own playlist"}
            </DrawerTitle>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-3"
            >
              {!clone && clone && (
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className=" py-5 animate-fade-up"
                          placeholder="Paste youtube playlist link"
                          {...field}
                        ></Input>
                      </FormControl>
                      {error && (
                        <FormMessage className="text-red-500 animate-fade-left">
                          Playlist is private or invalid url
                        </FormMessage>
                      )}
                      <FormMessage className="text-red-500 animate-fade-right" />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="creator"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className=" py-5 animate-fade-up rounded-lg"
                        placeholder="Give a name..."
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant={"secondary"}
                disabled={isSubmit || error}
                className=" py-5 w-full animate-fade-up border bg-neutral-950 rounded-lg"
              >
                {isSubmit ? (
                  <Loader size="20" loading={true} />
                ) : clone ? (
                  "Save"
                ) : (
                  "Create"
                )}
              </Button>
            </form>
          </Form>

          <DrawerClose className="w-full mt-3.5">
            <Button
              ref={close}
              asChild
              onClick={handleReset}
              variant={"secondary"}
              disabled={isSubmit || error}
              className=" text-zinc-100 py-5 border bg-neutral-950 animate-fade-up -mt-1.5 w-full rounded-lg"
            >
              <p>Close</p>
            </Button>
          </DrawerClose>
          {!clone && (
            <div className=" animate-fade-up w-full -mt-1">
              <SpotifyTransfer
                close={close}
                className=" rounded-lg text-sm bg-green-500 py-3 font-semibold"
              />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddLibrary;
