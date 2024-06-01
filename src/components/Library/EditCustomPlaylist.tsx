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
import { SearchPlaylist } from "@/Interface";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { RiEditBoxLine } from "react-icons/ri";

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
      async () => (
        form.setValue("Playlist", data.Playlist),
        form.setValue("creator", data.creator),
        setIsSubmit(false),
        close.current?.click(),
        await q.fetchQuery("savedPlaylist"),
        await q.fetchQuery(["playlistDetails", "custom" + id]),
        await q.fetchQuery(["SavedPlaylistDetails", id])
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
              await q.fetchQuery("savedPlaylist");
              await q.fetchQuery(["SavedPlaylistDetails", id]);
              await reload();
            });
          }
        }
      } catch (error) {
        alert((error as Error).message);
      }
    },
    [id, reload, thumbnailUrl, q]
  );
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="">
          <RiEditBoxLine className="h-8 w-8 animate-fade-left  backdrop-blur-md text-white bg-black/30 rounded-full p-1.5" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[100dvh] rounded-lg flex justify-center flex-col items-center ">
        <div className="h-dvh items-center border-none px-5 justify-center flex flex-col w-full  rounded-2x">
          <DrawerHeader>
            <DrawerTitle className="text-2xl animate-fade-down font-semibold -mb-2.5">
              Edit Playlist details
            </DrawerTitle>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-2 px-4"
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
                  <div className=" animate-fade-down h-80 px-0.5 w-full">
                    <img
                      width="100%"
                      height="100%"
                      src={image}
                      alt="Image"
                      loading="lazy"
                      className="object-cover  -xl h-[100%] w-[100%]"
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
                      <Input
                        placeholder="Playlist Name"
                        {...field}
                        className="animate-fade-up mt-2"
                      />
                    </FormControl>

                    <FormMessage className="animate-fade-up text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creator"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="By"
                        {...field}
                        className="animate-fade-up"
                      />
                    </FormControl>

                    <FormMessage className="animate-fade-up text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <div className=" space-y-2 flex flex-col">
                <Button
                  type="submit"
                  className=" rounded-lg border bg-neutral-950 animate-fade-up"
                  variant={"secondary"}
                  disabled={isSubmit}
                >
                  {isSubmit ? (
                    <Loader size="20" loading={true} />
                  ) : (
                    "Save changes"
                  )}
                </Button>
                <DrawerClose className="flex w-full">
                  <Button
                    asChild
                    ref={close}
                    type="button"
                    variant={"secondary"}
                    className="w-full border bg-neutral-950  rounded-lg animate-fade-up"
                  >
                    <p>Close</p>
                  </Button>
                </DrawerClose>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
