import { MdOutlineEdit } from "react-icons/md";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DATABASE_ID,
  ID,
  PLAYLIST_COLLECTION_ID,
  STORAGE,
  db,
  storage,
} from "@/appwrite/appwriteConfig";
import React, { useCallback, useRef, useState } from "react";
import Loader from "../Loaders/Loader";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQueryClient,
} from "react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { SearchPlaylist } from "@/Interface";
import "react-lazy-load-image-component/src/effects/blur.css";

const FormSchema = z.object({
  Playlist: z.string().min(2, {
    message: "Playlist name must be at least 3 characters.",
  }),
  creator: z
    .string()
    .refine((data) => !data || data.length > 1, {
      message: "Name must be at least 3 characters.",
    })
    .optional(),
});

export function EditCustomPlaylist({
  id,
  name,
  creator,
  thumbnailUrl,
  reload,
}: {
  reload?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<SearchPlaylist[], unknown>>;
  thumbnailUrl: string;
  id: string;
  name: string;
  creator: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>();
  const q = useQueryClient();
  const [image, setImage] = useState<string>(thumbnailUrl);
  const close = useRef<HTMLButtonElement>(null);
  const [isSubmit, setIsSubmit] = useState<boolean>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Playlist: name,
      creator: creator,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmit(true);
    const info = {
      ...(data.creator && { name: data.creator }),
      creator: data.Playlist,
    };

    db.updateDocument(DATABASE_ID, PLAYLIST_COLLECTION_ID, id, {
      ...info,
    }).then(
      () => (
        form.setValue("Playlist", data.Playlist),
        form.setValue("creator", data.creator),
        setIsSubmit(false),
        close.current?.click(),
        q.fetchQuery(["playlistDetails", "custom" + id])
      )
    );
  }

  const handleCover = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const cover = e.target.files?.[0];
        if (cover) {
          setIsLoading(true);
          if (cover && reload) {
            storage.createFile(STORAGE, ID.unique(), cover).then(async (c) => {
              const image = `https://cloud.appwrite.io/v1/storage/buckets/${c.bucketId}/files/${c.$id}/view?project=65c15bc8bfb586129eb4`;

              setImage(image);
              await db.updateDocument(DATABASE_ID, PLAYLIST_COLLECTION_ID, id, {
                image: image,
              });
              storage.deleteFile(
                STORAGE,
                thumbnailUrl.split("/files/")[1].split("/")[0]
              );
              setIsLoading(false);
              reload();
            });
          }
        }
      } catch (error) {
        alert((error as Error).message);
      }
    },
    [id, reload, thumbnailUrl]
  );
  return (
    <Dialog>
      <DialogTrigger>
        <div className="">
          <MdOutlineEdit className="h-8 w-8 fade-in backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[80vw] rounded-xl flex justify-center flex-col items-center">
        <DialogHeader>
          <DialogTitle>Edit Playlist details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file"
              onChange={handleCover}
            />
            <label htmlFor="file">
              {isLoading ? (
                <div className="h-[60vw] flex justify-center items-center w-full">
                  {<Loader loading={true} />}
                </div>
              ) : (
                <div className="h-[60vw] w-full">
                  <LazyLoadImage
                    effect="blur"
                    width="100%"
                    height="100%"
                    src={image}
                    alt="Image"
                    loading="lazy"
                    className="object-cover rounded-xl h-[100%] w-[100%]"
                  />
                </div>
              )}
            </label>

            <FormField
              control={form.control}
              name="Playlist"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Playlist Name" {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creator"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="By" {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className=" space-y-2 flex flex-col">
              <Button
                type="submit"
                className=" rounded-xl"
                variant={"secondary"}
                disabled={isSubmit}
              >
                {isSubmit ? (
                  <Loader size="20" loading={true} />
                ) : (
                  "Save changes"
                )}
              </Button>
              <DialogClose className="flex w-full">
                <Button
                  asChild
                  ref={close}
                  type="button"
                  variant={"secondary"}
                  className="w-full  rounded-xl"
                >
                  <p>Close</p>
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
