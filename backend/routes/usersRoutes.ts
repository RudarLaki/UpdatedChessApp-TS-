// routes/authRoutes.js
import express from "express";
import {
  getProfile,
  getFriends,
  addFriend,
  search,
} from "../controllers/usersController";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.get("/profile/:id", verifyToken, getProfile);
router.get("/friends/:id", verifyToken, getFriends);
router.post("/add-friend", verifyToken, addFriend);
router.post("/search", verifyToken, search);

export default router;
