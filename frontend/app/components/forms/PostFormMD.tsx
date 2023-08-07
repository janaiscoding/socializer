import createPost from "@/app/api/posts/create_post";
import getPosts from "@/app/api/posts/get_posts";
import SendSVG from "@/app/assets/svgs/SendSVG";
import UploadSVG from "@/app/assets/svgs/Upload";
import { PostsContext } from "@/app/context/postsContext";
import { UserContext } from "@/app/context/userContext";
import { SyntheticEvent, useContext, useState } from "react";

const PostFormMD = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<any>(undefined);

  const userContext = useContext(UserContext);
  const postsContext = useContext(PostsContext);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", text);
    if (userContext.user) formData.append("userID", userContext.user._id);
    if (file) {
      formData.append("myImage", file);
      formData.append("mimeType", file.type);
    }
    if (text.length === 0) {
      //Rather than waiting for the server response, this is pre-handled here instead
      setError("Post is too short.");
    } else {
      createPost(formData, handleError, handleSuccess);
    }
  };

  const handleError = (data: string) => {
    setError(data);
    setSuccess(false);
    // setFile(undefined);
  };

  const handleSuccess = () => {
    //Display success message
    setSuccess(true);
    clearData();
    //Update postsContext
    getPosts(postsContext.setPosts);
    setTimeout(() => {
      setSuccess(false);
    }, 1000);
  };

  const clearData = () => {
    setText(" ");
    setFile(undefined);
    setError(" ");
  };
  return (
    <div className="flex-col flex p-4 bg-blue rounded">
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-1">
        <input
          value={text}
          placeholder="What's on your mind?"
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value.length > 1) {
              setError(" ");
            }
          }}
          className="text-white w-full bg-black outline-none focus:ring-1 ring-yellow2 rounded py-2 pb-10 px-4 pr-12 mb-2"
        />
        <div className="self-end flex gap-4 text-sm items-center">
          <div className="font-open flex flex-col items-center gap-2">
            {success && <p className="text-xs text-valid">Post sent!</p>}
            {error.length > 1 && <p className="text-xs text-error">{error}</p>}
            {file && <p className="text-xs text-white2">{file.name}</p>}
          </div>
          <label
            htmlFor="upload-image"
            className="border border-yellow2 hover:border-yellow hover:cursor-pointer hover:bg-black border-solid py-1 px-3 rounded flex gap-1 items-center justify-between"
            aria-label="Upload a new picture"
          >
            <UploadSVG />
            <input
              type="file"
              name="myImage"
              accept="image/*"
              id="upload-image"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files![0]);
              }}
            />
          </label>

          <button
            aria-label="Send a new post"
            type="submit"
            className="flex gap-1 items-center justify-between border border-yellow2 hover:border-yellow hover:bg-black border-solid py-1 px-3 rounded"
          >
            <SendSVG />
            <p>Create Post</p>
          </button>
        </div>
      </form>
    </div>
  );
};
export default PostFormMD;
