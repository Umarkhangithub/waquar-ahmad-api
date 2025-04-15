import Project from "../models/project.model.js";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import fs from "fs/promises";

/**
 * @desc    Create a new project with uploaded image
 * @route   POST /api/projects
 * @access  Public
 */
export const createProject = async (req, res) => {
  try {
    const { projectName, description, url } = req.body;

    if (!projectName?.trim() || !description?.trim() || !url?.trim()) {
      return res.status(400).json({
        message: "⚠️ Please provide project name, description, and URL.",
      });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "projects",
      });
      imageUrl = result.secure_url;

      // Remove local file after upload
      await fs.unlink(req.file.path);
    }

    const newProject = new Project({
      name: projectName.trim(),
      description: description.trim(),
      url: url.trim(),
      image: imageUrl,
    });

    await newProject.save();

    return res.status(201).json({
      message: "✅ Project uploaded successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("❌ Error creating project:", error.message);

    if (req.file) {
      try {
        await fs.unlink(req.file.path);
        console.log("❌ Deleted uploaded image after error");
      } catch (fileError) {
        console.error("❌ Error deleting uploaded image:", fileError.message);
      }
    }

    return res.status(500).json({
      message: "❌ Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all uploaded projects
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "✅ Projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.error("❌ Error fetching projects:", error.message);
    return res.status(500).json({
      message: "❌ Failed to fetch projects",
      error: error.message,
    });
  }
};

/**
 * @desc    Get a specific project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "❌ Project not found",
      });
    }
    return res.status(200).json({
      message: "✅ Project fetched successfully",
      project,
    });
  } catch (error) {
    console.error("❌ Error fetching project:", error.message);
    return res.status(500).json({
      message: "❌ Failed to fetch project",
      error: error.message,
    });
  }
};

/**
 * @desc    Update a specific project by ID
 * @route   PUT /api/projects/:id
 * @access  Public
 */
export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { projectName, description, url } = req.body;

    if (!projectName?.trim() || !description?.trim() || !url?.trim()) {
      return res.status(400).json({
        message: "⚠️ Please provide project name, description, and URL.",
      });
    }

    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
      return res.status(404).json({
        message: "❌ Project not found",
      });
    }

    let newImageUrl = existingProject.image;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "projects",
      });
      newImageUrl = result.secure_url;

      await fs.unlink(req.file.path); // Remove local file
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        name: projectName.trim(),
        description: description.trim(),
        url: url.trim(),
        image: newImageUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "✅ Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("❌ Error updating project:", error.message);
    return res.status(500).json({
      message: "❌ Failed to update project",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a specific project by ID
 * @route   DELETE /api/projects/:id
 * @access  Public
 */
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({
        message: "❌ Project not found",
      });
    }

    // Cloudinary cleanup (optional)
    // If you want to delete image from cloudinary, you must store public_id during upload

    return res.status(200).json({
      message: "✅ Project deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting project:", error.message);
    return res.status(500).json({
      message: "❌ Failed to delete project",
      error: error.message,
    });
  }
};
