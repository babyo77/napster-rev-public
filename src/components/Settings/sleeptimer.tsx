import React, { useCallback } from "react";
import { LuTimer } from "react-icons/lu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { SetSleepTimer, SetStopPlaying } from "@/Store/Player";
import { toast } from "../ui/use-toast";
import { RootState } from "@/Store/Store";

function SleepTimer() {
  const dispatch = useDispatch();
  const timer = useSelector(
    (state: RootState) => state.musicReducer.sleepTimer
  );

  const handleTimer = useCallback(
    (time: number, e: React.MouseEvent<HTMLButtonElement>) => {
      const timer = setTimeout(() => {
        dispatch(SetStopPlaying(true));
        dispatch(SetSleepTimer("end"));
      }, time * 1000);
      dispatch(SetSleepTimer(timer));
      toast({
        title: `Timer set  for ${e.currentTarget.textContent}`,
      });
      return () => {
        dispatch(SetSleepTimer(null));
        clearTimeout(timer);
      };
    },
    [dispatch]
  );

  const clearTime = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
      dispatch(SetSleepTimer(null));
      toast({
        title: `Sleep timer removed`,
        variant: "destructive",
      });
    }
  }, [timer, dispatch]);
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="animate-fade-up">
          <p className=" rounded-xl py-2.5 mt-3 animate-fade-up  flex text-start   px-4  text-base items-center space-x-1 bg-neutral-950">
            <LuTimer className="h-6 w-6" />
            <span>Sleep Timer</span>
          </p>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader></DrawerHeader>
        <div className="px-4 flex  flex-col space-y-3 pb-10">
          <DrawerClose asChild>
            <Button
              onClick={(e) => handleTimer(600, e)}
              variant={"secondary"}
              className="bg-neutral-950 py-5 tracking-tight leading-tight rounded-xl"
            >
              10 min
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              onClick={(e) => handleTimer(900, e)}
              variant={"secondary"}
              className="bg-neutral-950 py-5 tracking-tight leading-tight rounded-xl"
            >
              15 min
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              onClick={(e) => handleTimer(1800, e)}
              variant={"secondary"}
              className="bg-neutral-950 py-5 tracking-tight leading-tight rounded-xl"
            >
              30 min
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              onClick={(e) => handleTimer(2700, e)}
              variant={"secondary"}
              className="bg-neutral-950 py-5 tracking-tight leading-tight rounded-xl"
            >
              45 min
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              onClick={(e) => handleTimer(3600, e)}
              variant={"secondary"}
              className="bg-neutral-950 py-5 tracking-tight leading-tight rounded-xl"
            >
              1 hour
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              onClick={clearTime}
              variant={"destructive"}
              disabled={timer ? false : true}
              className="bg-red-700 py-5 tracking-tight leading-tight rounded-xl"
            >
              Turn off Sleep Timer
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SleepTimer;
