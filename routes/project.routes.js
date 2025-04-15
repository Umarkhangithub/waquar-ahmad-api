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
// 🗂 Multer Configuration for File Uploads
// ------------------------------
const storage = multer.diskStorage({
  destination: "uploads/", // Temporary local storage
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
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
// 📦 Project Routes
// ------------------------------

// @route   POST /api/projects
// @desc    Create a new project with image
router.post("/", upload.single("image"), createProject);

// @route   GET /api/projects
// @desc    Get all projects
router.get("/", getProjects);

// @route   GET /api/projects/:id
// @desc    Get a project by ID
router.get("/:id", getProjectById);

// @route   PUT /api/projects/:id
// @desc    Update a project with optional image
router.put("/:id", upload.single("image"), updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project
router.delete("/:id", deleteProject);

export default router;
