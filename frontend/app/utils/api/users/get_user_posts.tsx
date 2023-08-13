import { SetStateAction } from "react";
import { Post } from "../../__types__/types";
import { getJwtToken } from "../auth/auth_handler";
import axios from "axios";

const getUserPosts = (
  userID: string,
  setter: React.Dispatch<SetStateAction<Post[]>>
) => {
  axios
    .get(`https://fiturself.fly.dev/users/${userID}/posts`, {
      headers: {
        Authorization: `Bearer ${getJwtToken()}`,
      },
    })
    .then((res) => {
      setter(res.data.posts);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default getUserPosts;