import { Router } from "express";
import { getMessages } from "../controllers/chatController";

const router = Router();

router.get("/messages/:userId/:friendId", getMessages);

export default router;
