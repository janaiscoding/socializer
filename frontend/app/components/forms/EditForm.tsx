import { EditContext } from "@/app/context/editContext";
import { UserContext } from "@/app/context/userContext";
import updateProfile from "@/app/utils/api/users/update_profile";
import { User } from "@/app/utils/types";
import { SyntheticEvent, useContext, useRef, useState } from "react";

const EditForm = () => {
  const userContext = useContext(UserContext);
  const editContext = useContext(EditContext);
  const saveButton = useRef<HTMLButtonElement>(null);

  const [first, setFirst] = useState(userContext.user?.first_name);
  const [last, setLast] = useState(userContext.user?.last_name);
  const [bio, setBio] = useState(userContext.user?.bio);

  const handleEdit = (e: SyntheticEvent) => {
    e.preventDefault();
    updateProfile(
      userContext.user?._id,
      first,
      last,
      bio,
      handleSucces,
      handleError
    );
  };
  const handleSucces = (uUser: User) => {
    editContext.setShowEdit(false);
    userContext.setUser(uUser);
  };

  const handleError = () => {
    console.log("naaay");
  };
  return (
    <form
      className="text-secondary flex flex-col gap-2"
      onSubmit={(e) => handleEdit(e)}
    >
      <label className="flex flex-col">
        <span className="self-start text-secondary">First Name</span>
        <input
          required
          type="text"
          value={first}
          className={`text-secondary w-full bg-accent/10 outline-none py-2 pl-4 pr-12 rounded border-solid border-b `}
          onChange={(e) => {
            setFirst(e.target.value);
          }}
        />
      </label>
      <label className="flex flex-col">
        <span className="self-start text-secondary">Last Name</span>
        <input
          required
          type="text"
          value={last}
          className={`text-secondary w-full bg-accent/10 outline-none py-2 pl-4 pr-12 rounded border-solid border-b `}
          onChange={(e) => {
            setLast(e.target.value);
          }}
        />
      </label>
      <label className="flex flex-col">
        <span className="self-start text-secondary">About</span>
        <input
          required
          type="text"
          value={bio}
          className={`text-secondary w-full bg-accent/10 outline-none py-2 pl-4 pr-12 rounded border-solid border-b `}
          onChange={(e) => {
            setBio(e.target.value);
          }}
        />
      </label>
      <button
        ref={saveButton}
        type="submit"
        className="text-2xl text-center text-white bg-accent rounded font-medium py-2 w-full md:self-center mt-3 hover:bg-accent/90"
      >
        Save
      </button>
    </form>
  );
};

export default EditForm;
