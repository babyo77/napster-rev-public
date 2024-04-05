import { useCallback, useEffect, useState } from "react";
import Header from "../Header/Header";
import Loader from "../Loaders/Loader";
import { Button } from "../ui/button";
import { socket } from "./Socket";
import { v4 } from "uuid";
import { playlistSongs } from "@/Interface";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import { SetSharePlayCode, SetSharePlayConnected } from "@/Store/Player";

function SharePlay() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isConnected = useSelector(
    (state: RootState) => state.musicReducer.sharePlayConnected
  );
  const sharePlayCode = useSelector(
    (state: RootState) => state.musicReducer.sharePlayCode
  );
  const dispatch = useDispatch();
  useEffect(() => {
    function onConnect() {
      setIsLoading(false);
      dispatch(SetSharePlayConnected(true));
    }

    function onDisconnect() {
      dispatch(SetSharePlayConnected(false));
    }
    function onJoined(data: { id: string; song: playlistSongs[] }) {
      console.log(data);
    }
    function onPlay(data: { id: string; song: boolean }) {
      console.log(data);
    }
    function onSeek(data: { id: string; seek: string }) {
      console.log(data);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("joined", onJoined);
    socket.on("playSong", onPlay);
    socket.on("seek", onSeek);
    return () => {
      socket.off("playSong", onPlay);
      socket.off("seek", onSeek);
      socket.off("joined", onJoined);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [dispatch]);

  const handleJoin = useCallback(() => {
    const code = prompt("Enter Shared Code");
    if (code && code.trim() !== "") {
      const data = {
        id: code,
      };
      if (!isConnected) {
        socket.connect();
      }
      socket.emit("join", data);
    }
  }, [isConnected]);

  const handleConnect = useCallback(() => {
    setIsLoading(true);
    socket.connect();
    const code = v4();
    const data = {
      id: code,
    };
    socket.emit("JoinRoom", data);
    dispatch(SetSharePlayCode(code));
  }, [dispatch]);

  const handleLeave = useCallback(() => {
    socket.disconnect();
  }, []);

  const handleInvite = useCallback(() => {
    navigator.share({
      title: `Invite Code for SharePlay`,
      text: `Code - ${sharePlayCode}`,
      url: window.location.href,
    });
  }, [sharePlayCode]);
  return (
    <>
      <Header title="Share Play" />
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex   items-center space-x-2">
          <Loader />
        </div>
      )}
      {isConnected && (
        <div className="px-4">
          <div className="flex space-x-2 items-center justify-between">
            <div className=" flex font-semibold  space-x-2 items-center justify-start  rounded-lg">
              <Avatar>
                <AvatarFallback className=" border-red-500 border-2  rounded-full">
                  CN
                </AvatarFallback>
                <AvatarImage>
                  <img src="cm" className="rounded-full" />
                </AvatarImage>
              </Avatar>
              <p className=" font-semibold text-red-500">Access denied !</p>
            </div>
            <div className="flex space-x-2 items-center">
              <Button
                onClick={handleInvite}
                variant={"secondary"}
                className=" rounded-lg "
                disabled
              >
                Invite
              </Button>
              <Button
                onClick={handleLeave}
                variant={"secondary"}
                className=" rounded-lg bg-red-600 "
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}
      {!isConnected && !isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex   items-center space-x-2">
          <>
            <Button
              onClick={handleConnect}
              variant={"secondary"}
              className="text-xl px-9 py-6 font-semibold rounded-xl items-center"
            >
              Start
            </Button>
            <Button
              onClick={handleJoin}
              variant={"secondary"}
              className="text-xl px-9 py-6 font-semibold rounded-xl items-center"
            >
              Join
            </Button>
          </>
        </div>
      )}
    </>
  );
}

export default SharePlay;
