import { Skeleton } from "../ui/skeleton";
import { RxCross2 } from "react-icons/rx";
function SkeletonP({ hidden }: { hidden?: boolean }) {
  return (
    <div className=" w-full animate-fade-right flex space-x-2 justify-between">
      <div className=" flex space-x-2 w-full">
        <div>
          <Skeleton className="w-14 pt-3 h-14 rounded-none bg-zinc-500" />
        </div>
        <div className=" flex  flex-col space-y-2  justify-center ">
          <Skeleton className="w-[30vw]  h-[.7rem] rounded-none bg-zinc-500" />
          <Skeleton className="w-[20vw]  h-[.7rem] rounded-none bg-zinc-500" />
        </div>
      </div>
      {!hidden && (
        <Skeleton className=" bg-transparent flex items-center">
          <RxCross2 className="h-6 w-6 text-zinc-400" />
        </Skeleton>
      )}
    </div>
  );
}

export default SkeletonP;
