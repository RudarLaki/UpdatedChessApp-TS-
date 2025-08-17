import { Router } from "express";
import { endGame, reconnect } from "../controllers/gameController.";

const router = Router();

//router.post("/start", startGame);
router.post("/end", endGame);
router.get("/reconnect/:roomId", reconnect);

export default router;
