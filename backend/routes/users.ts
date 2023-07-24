import express from "express";
import UC from "../controllers/userControllers";
import passport from "passport";

const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

router.get("/", auth, UC.get_users);
router.post("/:userID/upload", auth, UC.update_pfp);
router.get("/:userID", auth, UC.get_profile);
router.put("/:userID", auth, UC.update_account);
router.delete("/:userID", auth, UC.delete_account);
router.get("/:userID/friends", auth, UC.get_friends_list);
router.get("/:userID/received", auth, UC.get_fr_received);
router.get("/:userID/sent", auth, UC.get_fr_sent);
router.post("/send/:senderID/:receiverID", auth, UC.send_request);
router.delete("/cancel/:senderID/:receiverID", auth, UC.cancel_request);
router.put("/accept/:receiverID/:senderID", auth, UC.accept_request);
router.delete("/decline/:receiverID/:senderID", auth, UC.decline_request);
router.delete("/remove/:removerID/:removedID", auth, UC.remove_friend);

export default router;
