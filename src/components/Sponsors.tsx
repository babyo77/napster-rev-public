import { SiGithubsponsors } from "react-icons/si";

import { FaSnapchat } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DATABASE_ID, SPONSORS, db } from "@/appwrite/appwriteConfig";
import { Sponsors } from "@/Interface";
import { useQuery } from "react-query";
import Loader from "./Loaders/Loader";
import { Query } from "appwrite";
import { BsDiscord } from "react-icons/bs";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";

function SponsorsComp() {
  const getSponsors = async () => {
    const data = await db.listDocuments(DATABASE_ID, SPONSORS, [
      Query.orderDesc("$updatedAt"),
      Query.equal("visible", true),
    ]);
    return data.documents as unknown as Sponsors[];
  };

  const { data, isLoading } = useQuery<Sponsors[]>("sponsors", getSponsors, {
    staleTime: Infinity,
  });

  return (
    <Drawer>
      <DrawerTrigger className="w-full animate-fade-up">
        <p className=" w-full bg-neutral-950 animate-fade-up rounded-lg flex px-5 items-center justify-start py-2.5 mt-3  text-base">
          <SiGithubsponsors className="mr-2 h-[1.1rem] w-[1.1rem] fill-pink-400" />

          <span>Sponsors</span>
        </p>
      </DrawerTrigger>
      <DrawerContent className="w-full border-none flex items-center flex-col justify-center h-dvh rounded-none">
        <div className="h-dvh animate-fade-up pb-[6dvh] items-center border-none  justify-center flex flex-col w-full  rounded-2xl">
          <DrawerHeader></DrawerHeader>
          {isLoading && (
            <div className="py-4 w-full  animate-fade-up rounded-lg flex justify-center flex-col  space-y-2 items-center">
              <Loader />
            </div>
          )}
          {data && (
            <>
              <div className=" rounded-lg flex flex-col space-y-2.5">
                {data.map((sponsor) => (
                  <div
                    key={sponsor.image}
                    className=" border animate-fade-up delay-300 bg-neutral-800/10 py-3 px-4 w-[90dvw] text-center rounded-2xl flex justify-start  items-center space-x-3"
                  >
                    <div className="">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          className=" object-cover h-[100%] w-[100%]"
                          src={sponsor.image}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className=" flex-col mb-1 justify-start items-start text-start">
                        <p className=" text-3xl -mb-1.5 tracking-tighter leading-tight font-semibold py-0.5  capitalize">
                          {sponsor.name}
                        </p>
                        <p className=" text-sm text-zinc-400 tracking-tighter leading-tight font-medium  capitalize">
                          {sponsor.type}
                        </p>
                      </div>
                      <div className="flex space-x-2 justify-start items-center">
                        {sponsor.snapchat && (
                          <a href={sponsor.snapchat} target="_blank">
                            <FaSnapchat className="w-4 h-4" />
                          </a>
                        )}
                        {sponsor.instagram && (
                          <a href={sponsor.instagram} target="_blank">
                            <FaInstagram className="w-4 h-4" />
                          </a>
                        )}
                        {sponsor.twitter && (
                          <a href={sponsor.twitter} target="_blank">
                            <FaXTwitter className="w-4 h-4" />
                          </a>
                        )}
                        {sponsor.discord && (
                          <a href={sponsor.discord} target="_blank">
                            <BsDiscord className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { SponsorsComp };
