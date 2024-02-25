import Header from "../Header/Header";
import Loader from "../Loaders/Loader";

function SharePlay() {
  return (
    <>
      <Header title="Share Play" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-2">
        <Loader />
        <span className="text-zinc-400 text-sm">Coming soon...</span>
      </div>
    </>
  );
}

export default SharePlay;
