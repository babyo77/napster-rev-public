import * as React from "react";
import Header from "../Header/Header";

import "react-lazy-load-image-component/src/effects/blur.css";

import { Skeleton } from "@/components/ui/skeleton";

export function NewL() {
  return (
    <>
      <Header title="Listen Now" />
      <div className="flex px-4  space-x-4 items-center w-full ">
        <Skeleton className="w-[50vw] h-4 rounded-md bg-zinc-500" />
      </div>
      <div className="flex px-4 flex-col space-y-4 items-start w-full mt-5">
        <Skeleton className="w-[90vw] h-36 rounded-md bg-zinc-500" />
      </div>
      <div className="flex px-4  space-x-4 items-center w-full mt-5">
        <Skeleton className="w-[40vw] h-4 rounded-md bg-zinc-500" />
      </div>
      <div className="flex px-4 justify-center space-x-4 items-center w-full mt-5">
        <Skeleton className="w-[50vw] h-36 rounded-md bg-zinc-500" />
        <Skeleton className="w-[50vw] h-36 rounded-md bg-zinc-500" />
      </div>
      <div className="flex px-4  space-x-4 items-center w-full mt-5">
        <Skeleton className="w-[30vw] h-4 rounded-md bg-zinc-500" />
      </div>

      <div className="flex px-4  space-x-4 items-start w-full mt-5">
        <Skeleton className="w-20 h-20 rounded-full bg-zinc-500" />
        <Skeleton className="w-20 h-20 rounded-full bg-zinc-500" />
        <Skeleton className="w-20 h-20 rounded-full bg-zinc-500" />
      </div>
    </>
  );
}

const ListenNo = React.memo(NewL);
export default ListenNo;
