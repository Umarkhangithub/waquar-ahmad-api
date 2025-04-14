import express from "express";
import { register } from "../controllers/register.controller.js";

const router = express.Router();

// ------------------------------
// 👤 Admin Registration/Login Route (Example: GET)
// ------------------------------

// @route   GET /api/admin
// @desc    Admin login (basic check)
// @access  Private (you should add auth later)
router.get("/", register);

// 🔐 Later you can add more routes like:
// router.post("/login", loginAdmin);
// router.post("/create", createAdmin);

export default router;
