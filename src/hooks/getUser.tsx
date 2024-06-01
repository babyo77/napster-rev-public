import { getSpotifyProfile } from "@/API/api";
import { DATABASE_ID, NEW_USER, db } from "@/appwrite/appwriteConfig";
import User from "@/user/User";
import { Query } from "appwrite";
import axios from "axios";
import { useQuery } from "react-query";

function useGetUser({ id }: { id: string | undefined }) {
  const getUser = async () => {
    const user = await db.listDocuments(DATABASE_ID, NEW_USER, [
      Query.equal("user", [id ? id : ""]),
      Query.limit(1),
    ]);

    const res = await axios.get(
      `${getSpotifyProfile}${user.documents[0].spotifyId}`
    );
    const result: User = user.documents[0] as User;
    const code: User[] = res.data;

    const modified = [
      {
        name: code[0].name,
        image: code[0].image,
        snap: result.snap,
        insta: result.insta,
        other: result.other,
        twitter: result.twitter,
        paytm: result.paytm,
        bio: result.bio,
      },
    ];

    return modified as User[];
  };
  const { data: user, isLoading: userLoading } = useQuery<User[]>(
    ["userDetails", id],
    getUser,
    {
      keepPreviousData: true,
    }
  );

  return { user, userLoading };
}

export default useGetUser;
