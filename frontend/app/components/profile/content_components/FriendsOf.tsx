import Loader from "@/app/utils/assets/Loader";
import useFriendsList from "@/app/hooks/useFriendsList";
import UserWrapper from "../../socials_users/UserWrapper";


const FriendsOf = ({ userID }: { userID: string }) => {
  const { friends, isLoading } = useFriendsList(userID);

  return (
    <div className="flex flex-col gap-1 mt-2">
      {isLoading && <Loader />}
      {!isLoading && friends.length === 0 && <p className="w-full self-center text-white2 bg-bgContainers p-2 rounded">This user doesn&apos;t have any friends yet.</p>}
      {friends.map((user) => (
        <UserWrapper user={user} key={user._id} />
      ))}
    </div>
  );
};

export default FriendsOf;