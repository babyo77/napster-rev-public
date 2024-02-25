import { QRCodeSVG } from "qrcode.react";
function Desktop() {
  return (
    <>
      <div className="absolute fade-in inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
      <div className="flex z-10   justify-center flex-col h-screen text-center items-center py-10">
        <span className="font-semibold text-zinc-700">
          Not available on Desktop Now
        </span>
        <h1 className="font-bold text-5xl mt-4 mb-4 text-zinc-700">
          Scan this QR
        </h1>
        <span className="font-semibold text-zinc-700">
          on Phone or{" "}
          <a
            href="https://your-napster.vercel.app"
            className="underline fade-in-sec  underline-offset-2 text-red-500"
          >
            visit old napster-drx
          </a>
        </span>

        <div className="  bg-black/20   mt-5 object-center flex justify-center items-center overflow-hidden rounded-3xl">
          <QRCodeSVG
            value={window.location.origin}
            className="h-96 w-96 p-4 rounded-[1.7rem]"
          />
        </div>

        <div className="flex justify-center flex-col items-center mt-[3vw]">
          <h1 className="font-bold text-zinc-500">NapsterDrx.</h1>
          <span className="font-semibold text-zinc-500 text-xs mt-1">
            Love from NapsterDrx.
          </span>
        </div>
      </div>
    </>
  );
}

export { Desktop };
