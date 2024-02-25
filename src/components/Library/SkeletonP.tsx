import { Skeleton } from "../ui/skeleton";
import { AiOutlineMenu } from "react-icons/ai";
function SkeletonP() {
  return (
    <div className=" w-full flex space-x-2 justify-between">
      <div className=" flex space-x-2 w-full">
        <div>
          <Skeleton className="w-[3.3rem] pt-3 h-[3.3rem] rounded-md bg-zinc-500" />
        </div>
        <div className=" flex  flex-col space-y-2  justify-center ">
          <Skeleton className="w-[30vw]  h-[.7rem] rounded-md bg-zinc-500" />
          <Skeleton className="w-[20vw]  h-[.7rem] rounded-md bg-zinc-500" />
        </div>
      </div>
      <Skeleton className=" bg-transparent flex items-center">
        <AiOutlineMenu className="h-7 w-7 text-zinc-500" />
      </Skeleton>
    </div>
  );
}

export default SkeletonP;
