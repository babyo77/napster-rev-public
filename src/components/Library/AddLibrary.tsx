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
  PLAYLIST_COLLECTION_ID,
  db,
ID
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
  link: z.string().url(),
  creator: z.string().min(2),
});
import { IoMdAdd } from "react-icons/io";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { isPlaylist } from "@/API/api";
import Loader from "../Loaders/Loader";
import { useDispatch } from "react-redux";
import { setSavedPlaylist } from "@/Store/Player";
import { savedPlaylist } from "@/Interface";
import { RiMenuAddFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const AddLibrary: React.FC<{ clone?: boolean; id?: string }> = ({
  clone,
  id,
}) => {
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
    clone &&
      id &&
      form.setValue("link", `https://www.youtube.com/playlist?list=${id}`);
  }, [clone, form, id]);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmit(true);

    try {
      const res = await axios.get(`${isPlaylist}${data.link}`);
      const payload: savedPlaylist = {
        name: "default",
        creator: data.creator,
        link: res.data,
        for: localStorage.getItem("uid") || "default",
      };
      if (res.status !== 500) {
        db.createDocument(
          DATABASE_ID,
          PLAYLIST_COLLECTION_ID,
          ID.unique(),
          payload
        )
          .then(async() => {
            form.reset()
const r = await db.listDocuments(DATABASE_ID, PLAYLIST_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.equal("for", [localStorage.getItem("uid") || "default", "default"]),
    ]);
    const p = r.documents as unknown as savedPlaylist[];

              dispatch(setSavedPlaylist(p)),
              close.current?.click();
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
    <Dialog>
      <DialogTrigger className="w-full">
        {clone ? (
          <RiMenuAddFill className="h-8 w-8  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
        ) : (
          <span className="text-center  justify-end px-3 flex  text-lg truncate">
            <IoMdAdd className="h-8 w-8 fill-zinc-100" />
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="w-[85vw]  rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            {clone ? "Clone this playlist" : "Create your own playlist"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                      className=" py-5"
                      placeholder="Enter your name"
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
              {isSubmit ? <Loader size="20" /> : clone ? "Clone" : "Add"}
            </Button>
          </form>
        </Form>
        <DialogClose>
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

export default AddLibrary;
