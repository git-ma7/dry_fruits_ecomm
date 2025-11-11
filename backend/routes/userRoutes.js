import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  getMe,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", authUser);

// Protected route
router.get("/me", protect, getMe);
router.get("/profile", protect, getUserProfile);

export default router;
