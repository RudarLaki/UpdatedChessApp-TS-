import { Router } from "express";
import { endGame, reconnect } from "../controllers/gameController.";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/end", verifyToken, endGame);
router.get("/reconnect/:roomId", verifyToken, reconnect);

export default router;
