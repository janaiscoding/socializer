import { Avatar, User } from "@/app/utils/types";
import Image from "next/image";

const PostImage = ({ user, image }: { user: User; image: Avatar }) => {
  return (
    image !== undefined && (
      <Image
        src={`data:${image.contentType};base64,${Buffer.from(
          image.data!
        ).toString("base64")}`}
        width={400}
        height={0}
        className="w-full h-80 object-cover border border-solid border-neutral-900 md:h-auto"
        alt={`Post pic, uploaded by ${user.first_name} ${user.last_name}`}
      />
    )
  );
};

export default PostImage;
