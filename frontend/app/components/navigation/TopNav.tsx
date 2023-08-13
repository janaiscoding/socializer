import useCurrentUser from "@/app/hooks/useCurrentUser";
import Logo from "../../utils/assets/Logo";
import Notification from "../../utils/assets/svgs/Notification";
import AvatarComment from "../images/AvatarComment";
import { useContext } from "react";
import { ModalContext } from "@/app/context/modalContext";
import RequestModal from "../modals/RequestModal";

const TopNav = () => {
  const { currentUser } = useCurrentUser();
  const modalContext = useContext(ModalContext);

  return (
    <nav className="backdrop-blur-xl bg-black/80 sticky top-0 z-50 flex justify-between md:justify-center items-center py-2 border-solid border-b border-secondary md:px-20">
      <div className="px-4">
        <Logo />
      </div>

      <div className="md:hidden gap-2 items-center flex px-4 ">
        <Notification />
        <AvatarComment avatar={currentUser.avatar} userID={currentUser._id} />
      </div>
      {modalContext.modalBell && <RequestModal />}
    </nav>
  );
};


export default TopNav;