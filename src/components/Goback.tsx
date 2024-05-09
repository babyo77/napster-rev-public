import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function GoBack({ className }: { className?: string }) {
  const history = useNavigate();
  return (
    <div
      onClick={() => history(-1)}
      className=" fade-in absolute top-4 z-10 left-3"
    >
      <IoIosArrowBack
        className={`h-8 w-8 animate-fade-right  backdrop-blur-md text-white bg-black/30 rounded-full p-1 ${className}`}
      />
    </div>
  );
}

export default GoBack;
