import useGetUser from "@/hooks/getUser";
import LiveListening from "@/user/LiveListening";
import { useParams } from "react-router-dom";

function EmbedUser() {
  const { id } = useParams();
  const { user } = useGetUser({ id: id });
  return <LiveListening id={id} user={user} embed />;
}

export default EmbedUser;
