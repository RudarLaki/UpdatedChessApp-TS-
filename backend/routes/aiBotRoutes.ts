import { Router } from "express";
import {
  startGame,
  makeMove,
  close,
  reconnect,
} from "./../controllers/aiBotController";

import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/start", verifyToken, startGame);
router.post("/move", makeMove);
router.post("/close", close);
router.post("/reconnect", reconnect);

export default router;
