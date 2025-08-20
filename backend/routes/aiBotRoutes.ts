import { Router } from "express";
import {
  startGame,
  makeMove,
  close,
  reconnect,
} from "./../controllers/aiBotController";

const router = Router();

router.post("/start", startGame);
router.post("/move", makeMove);
router.post("/close", close);
router.post("/reconnect", reconnect);

export default router;
