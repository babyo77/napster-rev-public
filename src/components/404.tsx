import { Link } from "react-router-dom";
import GoBack from "./Goback";

function NotFound() {
  return (
    <div className=" relative  w-full">
      <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Link
          to={"/search"}
          className=" text-zinc-300 underline underline-offset-2"
        >
          Search
        </Link>
      </div>
      <GoBack />
    </div>
  );
}

export default NotFound;
