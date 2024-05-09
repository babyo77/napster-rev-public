import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DATABASE_ID,
  ALBUM_COLLECTION_ID,
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
  link: z.string(),
  creator: z.string().min(2),
});
import { IoMdAdd } from "react-icons/io";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentToggle, setSavedPlaylist } from "@/Store/Player";
import { savedPlaylist } from "@/Interface";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loaders/Loader";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { RootState } from "@/Store/Store";

const AddAlbum: React.FC<{
  clone?: boolean;
  id?: string;
  name: string;
  album: string;
  image: string;
}> = ({ clone, id, name, album, image }) => {
  const close = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch();
  const uid = useSelector((state: RootState) => state.musicReducer.uid);

  const n = useNavigate();
  const [isSubmit, setIsSubmit] = useState<boolean>();
  const [error, setError] = useState<boolean>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      link: "",
      creator: "",
    },
  });
  useEffect(() => {
    clone && id && form.setValue("link", id);
    clone && id && form.setValue("creator", `${name}`);
  }, [clone, form, id, name]);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmit(true);

    try {
      if (uid) {
        const payload: savedPlaylist = {
          name: album,
          image: image,
          creator: data.creator,
          link: data.link,
          for: uid || "default",
        };
        db.createDocument(
          DATABASE_ID,
          ALBUM_COLLECTION_ID,
          ID.unique(),
          payload,
          [Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]
        )
          .then(async () => {
            form.reset();
            const r = await db.listDocuments(DATABASE_ID, ALBUM_COLLECTION_ID, [
              Query.orderDesc("$createdAt"),
              Query.equal("for", [uid || "default", "default"]),
            ]);
            const p = r.documents as unknown as savedPlaylist[];
            dispatch(setCurrentToggle("Albums"));
            dispatch(setSavedPlaylist(p)), close.current?.click();
            clone && n("/library/");
          })
          .catch((error) => {
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
      <DrawerTrigger className="w-full">
        {clone ? (
          <IoMdAdd className="h-8 w-8 animate-fade-left  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
        ) : (
          <span className="text-center  justify-end px-3 flex  text-lg truncate">
            <IoMdAdd className="h-8 w-8 fill-zinc-100" />
          </span>
        )}
      </DrawerTrigger>
      <DrawerContent className="h-[100dvh] rounded-none px-5">
        <div className="h-dvh items-center border-none justify-center flex flex-col w-full  rounded-2xl">
          <DrawerHeader>
            <DrawerHeader className="text-xl leading-tight tracking-tighter font-semibold animate-fade-down">
              {clone ? "Save this album" : "Create your own playlist"}
            </DrawerHeader>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-3"
            >
              {!clone && (
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
                        <FormMessage className="text-red-500">
                          Playlist is private or invalid url
                        </FormMessage>
                      )}
                      <FormMessage className="text-red-500" />
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
                        readOnly
                        disabled
                        className=" rounded-lg text-zinc-400 py-5 animate-fade-up"
                        placeholder={name}
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
                className=" py-5 w-full rounded-xl border bg-neutral-900 animate-fade-up"
              >
                {isSubmit ? (
                  <Loader size="20" loading={true} />
                ) : clone ? (
                  "Save"
                ) : (
                  "Add"
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
              className=" text-zinc-100 py-5 border bg-neutral-900 animate-fade-up -mt-1.5 w-full rounded-xl"
            >
              <p>Close</p>
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddAlbum;
