import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AiOutlineMenu } from "react-icons/ai";
import { Button } from "../ui/button";
import { FcFullTrash } from "react-icons/fc";
import { useCallback, useRef } from "react";
import {
  DATABASE_ID,
  PLAYLIST_COLLECTION_ID,
  db,
} from "@/appwrite/appwriteConfig";
import { useDispatch } from "react-redux";
import { removePlaylist } from "@/Store/Player";

const EditInfo: React.FC<{ id: string; f: string }> = ({ id, f }) => {
  const dispatch = useDispatch();
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleDelete = useCallback(() => {
    db.deleteDocument(DATABASE_ID, PLAYLIST_COLLECTION_ID, id).then(() => {
      dispatch(removePlaylist(id));
      closeRef.current?.click();
    });
  }, [id, dispatch]);

  return (
    <Dialog>
      <DialogTrigger>
        <AiOutlineMenu className="h-7 w-7 text-zinc-400" />
      </DialogTrigger>
      <DialogContent className="items-center rounded-2xl flex flex-col w-[80vw]">
        <DialogHeader>
          <DialogTitle className="text-zinc-400 font-bold">
            Are you sure?
          </DialogTitle>
        </DialogHeader>

        <FcFullTrash className="h-24 w-24" />
        <Button
          disabled={f === "default" ? true : false}
          variant={"destructive"}
          onClick={handleDelete}
          className=" py-4 rounded-xl w-52 bg-red-500"
        >
          Delete
        </Button>

        <DialogClose>
          <Button
            asChild
            ref={closeRef}
            variant={"secondary"}
            className=" py-4 rounded-xl w-52"
          >
            <p>Close</p>
          </Button>
        </DialogClose>
        <DialogFooter className="text-center text-xs text-zinc-500">
          {id}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInfo;
