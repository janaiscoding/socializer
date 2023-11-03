import Close from "@/app/utils/assets/svgs/Close";
import EditForm from "../forms/EditForm";
import { EditContext } from "@/app/context/editContext";
import { useContext } from "react";

const EditModal = () => {
  const editContext = useContext(EditContext);

  return (
    <div
      className="w-full h-full left-0 top-0 overflow-auto bg-gray-700/70 
      flex fixed z-[1000] justify-center items-center"
    >
      <div
        className="bg-white p-6 fixed z-[100] w-full md:max-w-sm 
        top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 w-[96%] font-ubuntu"
      >
        <div className="flex justify-between">
          <p className="text-xl font-ubuntu-500 text-secondary text-center">
            Edit Profile
          </p>
          <div
            onClick={() => editContext.setShowEdit(false)}
            className="hover:bg-gray-700/10 rounded-full p-1 hover:cursor-pointer"
          >
            <Close />
          </div>
        </div>
        <EditForm />
      </div>
    </div>
  );
};

export default EditModal;
