import { LuLoader2 } from "react-icons/lu";

function Loader({
  size,
  loading,
  className,
}: {
  className?: string;
  size?: string;
  loading?: boolean;
  color?: string;
  stroke?: string;
}) {
  return (
    <div
      className={`flex flex-col  space-y-2 justify-center items-center text-xs font-normal ${className}`}
    >
      <LuLoader2
        className="animate-spin duration-700 text-red-500"
        size={size || "30"}
      ></LuLoader2>

      {!loading && <p></p>}
    </div>
  );
}

export default Loader;
