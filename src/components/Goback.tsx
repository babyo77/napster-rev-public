import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function GoBack() {
  const history = useNavigate();
  return (
    <div onClick={() => history(-1)} className=" absolute top-4 z-10 left-3">
      <IoIosArrowBack className="h-8 w-8  backdrop-blur-md text-white bg-black/30 rounded-full p-1" />
    </div>
  );
}

export default GoBack;
