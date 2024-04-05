import { tailspin } from "ldrs";

tailspin.register();
function Loader({
  size,
  color,
  stroke,
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
      className={`flex flex-col space-y-2 justify-center items-center text-xs font-normal ${className}`}
    >
      <l-tailspin
        size={size || "30"}
        stroke={stroke || "4"}
        speed="1"
        color={color || "gray"}
      ></l-tailspin>

      {!loading && <p></p>}
    </div>
  );
}

export default Loader;
