import axios from "axios";
import { SetStateAction } from "react";
import { getJwtToken } from "../auth/auth_handler";
import { User } from "../../types";

const getProfile = (
  id: string | undefined,
  setter: React.Dispatch<SetStateAction<User>>,
  handleError: () => void
) => {
  axios
    .get(`https://fittrackr.fly.dev/users/${id}`, {
      headers: {
        Authorization: `Bearer ${getJwtToken()}`,
      },
    })
    .then((res) => {
      setter(res.data.user);
    })
    .catch((err) => {
      console.log(err);
      handleError()
    });
};

export default getProfile;
