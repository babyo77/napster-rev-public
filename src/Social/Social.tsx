import Loader from "@/components/Loaders/Loader";
import { useEffect } from "react";

function Social() {
  useEffect(() => {
    window.open(
      "https://excalidraw.com/#json=JcjkWGbggjgWOCFgLTpKJ,X8Z6pPDBTd59ul1-5iCeXg"
    );
  }, []);
  return (
    <div className=" flex flex-col space-y-1 justify-center items-center h-dvh">
      <Loader />
      <p>Coming soon</p>
    </div>
  );
}

export default Social;
