import { Router } from "express";
import { getMessages } from "../controllers/chatController";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.get("/messages/:userId/:friendId", verifyToken, getMessages);

export default router;
