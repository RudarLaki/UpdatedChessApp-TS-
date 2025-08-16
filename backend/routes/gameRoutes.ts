import { Router } from "express";
import { endGame } from "../controllers/gameController.";

const router = Router();

//router.post("/start", startGame);
router.post("/end", endGame);

export default router;
