import express from "express";
import multer from "multer";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/project.controller.js";

const router = express.Router();

// ------------------------------
// 📂 Multer Configuration - memory storage
// ------------------------------
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = file.mimetype.split("/")[1];
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("❌ Only image files are allowed (jpeg, jpg, png, webp)"));
    }
  },
});

// ------------------------------
// 🚀 Project Routes
// ------------------------------
router.post("/", upload.single("image"), createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

export default router;
