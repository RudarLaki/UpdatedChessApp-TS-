// routes/authRoutes.js
import express from "express";
import {
  getProfile,
  getFriends,
  addFriend,
  search,
} from "../controllers/usersController";
const router = express.Router();

router.get("/profile/:id", getProfile);
router.get("/friends/:id", getFriends);
router.post("/add-friend", addFriend);
router.post("/search", search);

export default router;
