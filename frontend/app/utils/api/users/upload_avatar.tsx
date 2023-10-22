import { getJwtToken } from "../auth/auth_handler";

const uploadAvatar = (
  userID: string,
  formData: any,
  handleSuccess: () => void,
  handleError: (data: string) => void
) => {
  fetch(`https://fittrackr.fly.dev/users/${userID}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getJwtToken()}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.message) {
        handleSuccess();
      } else if (data.error) {
        handleError(data.error);
      } else {
        handleError(data);
      }
    })
    .catch((err) => console.log(err));
};
export default uploadAvatar;
