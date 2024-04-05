import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DATABASE_ID,
  ALBUM_COLLECTION_ID,
  db,
  ID,
} from "@/appwrite/appwriteConfig";
import { Query } from "appwrite";
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

import { useDispatch } from "react-redux";
import { setCurrentToggle, setSavedPlaylist } from "@/Store/Player";
import { savedPlaylist } from "@/Interface";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loaders/Loader";

const AddAlbum: React.FC<{
  clone?: boolean;
  id?: string;
  name: string;
  album: string;
  image: string;
}> = ({ clone, id, name, album, image }) => {
  const close = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch();

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
      const payload: savedPlaylist = {
        name: album,
        image: image,
        creator: data.creator,
        link: data.link,
        for: localStorage.getItem("uid") || "default",
      };
      db.createDocument(DATABASE_ID, ALBUM_COLLECTION_ID, ID.unique(), payload)
        .then(async () => {
          form.reset();
          const r = await db.listDocuments(DATABASE_ID, ALBUM_COLLECTION_ID, [
            Query.orderDesc("$createdAt"),
            Query.equal("for", [
              localStorage.getItem("uid") || "default",
              "default",
            ]),
          ]);
          const p = r.documents as unknown as savedPlaylist[];
          dispatch(setCurrentToggle("Albums"));
          dispatch(setSavedPlaylist(p)), close.current?.click();
          clone && n("/library/");
        })
        .catch((error) => {
          throw new Error(error);
        });
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
    <Dialog>
      <DialogTrigger className="w-full fade-in">
        {clone ? (
          <IoMdAdd className="h-8 w-8  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
        ) : (
          <span className="text-center  justify-end px-3 flex  text-lg truncate">
            <IoMdAdd className="h-8 w-8 fill-zinc-100" />
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="w-full h-dvh border-none flex flex-col justify-center items-center rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {clone ? "Save this album" : "Create your own playlist"}
          </DialogTitle>
        </DialogHeader>

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
                        className=" py-5"
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
                      className=" py-5"
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
              className=" py-5 w-full rounded-xl"
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
        <DialogClose className="w-full">
          <Button
            ref={close}
            asChild
            onClick={handleReset}
            variant={"secondary"}
            disabled={isSubmit || error}
            className=" text-zinc-100 py-5 -mt-1.5 w-full rounded-xl"
          >
            <p>Close</p>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlbum;
