import { getJwtToken } from "../auth/auth_handler";

const deletePost = async (id: string, handleSuccess: () => void) => {
  await fetch(`https://fittrackr.fly.dev/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getJwtToken()}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      //console.log(data)
      if (data.message && data.message.includes("succes")) {
        handleSuccess();
      }
    })
    .catch((err) => console.log(err));
};

export default deletePost;
