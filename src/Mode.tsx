import Auth from "./Auth";
import { useEffect, useState } from "react";
import Check from "./components/Check";

function Mode() {
  const [online, setOnline] = useState<boolean>(false);
  const [offline, setOffline] = useState<boolean>(false);
  useEffect(() => {
    const online = navigator.onLine;

    if (online) {
      setOnline(online);
    } else {
      setOffline(true);
    }
  }, []);

  if (online) {
    return <Auth />;
  }
  if (offline) {
    return <Check />;
  }
}

export default Mode;
