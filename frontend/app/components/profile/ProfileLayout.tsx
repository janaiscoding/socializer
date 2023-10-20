import { User } from "@/app/utils/types";
import ContentOf from "./ContentOf";

import { useContext, useEffect, useState } from "react";
import { EditContext } from "@/app/context/editContext";
import UpdateProfileModal from "../modals/UpdateProfileModal";
import useCurrentUser from "@/app/hooks/useCurrentUser";
import getProfile from "@/app/utils/api/users/get_profile";
import Loader from "@/app/utils/assets/Loader";
import { useRouter } from "next/navigation";
import UserTabToggle from "../toggles/UserTabToggle";
import UserInfo from "./UserInfo";
import PostFormMD from "../forms/PostFormMD";
import { UserContext } from "@/app/context/userContext";

const ProfileLayout = ({ id }: { id: string }) => {
  const { currentUser } = useCurrentUser();
  const userContext = useContext(UserContext);
  const router = useRouter();

  const [profile, setProfile] = useState<User>({} as User);
  const [isLoading, setIsLoading] = useState(true);
  const [isSame, setIsSame] = useState<boolean>();

  // In case the user changes the URL manually.
  const handleError = () => {
    router.push("/users");
  };

  useEffect(() => {
    // Initial profile loader.
    getProfile(id, setProfile, handleError);
    //console.log("updating everytime user changes");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userContext]);

  useEffect(() => {
    if (profile) {
      setIsLoading(Object.keys(profile).length === 0);
      setIsSame(currentUser._id === profile._id);
    }
  }, [profile, currentUser]);

  return (
    <div className="flex flex-col font-ubuntu mb-10 w-full text-softWhite max-w-4xl m-auto h-screen">
      {isLoading && <Loader />}
      <>
        {!isLoading && <UserInfo profile={profile} isSame={isSame} />}
        <UserTabToggle />

        {!isLoading && <ContentOf isSame={isSame} profile={profile} />}
      </>
    </div>
  );
};

export default ProfileLayout;
