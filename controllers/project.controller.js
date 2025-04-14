import Project from "../models/project.model.js";
import path from "path";
import fs from "fs/promises"; // Use fs.promises for async file operations

/**
 * @desc    Create a new project with uploaded image
 * @route   POST /api/projects
 * @access  Public
 */
export const createProject = async (req, res) => {
  try {
    const { projectName, description, url } = req.body;

    // Validate required fields
    if (!projectName?.trim() || !description?.trim() || !url?.trim()) {
      return res.status(400).json({
        message: "⚠️ Please provide project name, description, and URL.",
      });
    }

    // Normalize image path for all OS (e.g., turn \\ into /)
    const imagePath = req.file?.path ? req.file.path.replace(/\\/g, "/") : "";

    // Create new project document
    const newProject = new Project({
      name: projectName.trim(),
      description: description.trim(),
      url: url.trim(),
      image: imagePath,
    });

    await newProject.save();

    return res.status(201).json({
      message: "✅ Project uploaded successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("❌ Error creating project:", error.message);

    // Remove uploaded file in case of error (optional)
    if (req.file) {
      const filePath = path.resolve(req.file.path);
      try {
        await fs.unlink(filePath);
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

    // Validate required fields
    if (!projectName?.trim() || !description?.trim() || !url?.trim()) {
      return res.status(400).json({
        message: "⚠️ Please provide project name, description, and URL.",
      });
    }

    // Normalize image path for all OS (e.g., turn \\ into /)
    const imagePath = req.file?.path ? req.file.path.replace(/\\/g, "/") : "";

    // Find the existing project
    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
      return res.status(404).json({
        message: "❌ Project not found",
      });
    }

    // Delete old image if a new one is provided
    if (imagePath && existingProject.image) {
      const oldImagePath = path.resolve(existingProject.image);
      try {
        await fs.unlink(oldImagePath); // Delete old image
        console.log("❌ Deleted old image");
      } catch (fileError) {
        console.error("❌ Error deleting old image:", fileError.message);
      }
    }

    // Update project document
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        name: projectName.trim(),
        description: description.trim(),
        url: url.trim(),
        image: imagePath,
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        message: "❌ Project not found",
      });
    }

    // Return updated project document
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

    // Find project by ID and delete it
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({
        message: "❌ Project not found",
      });
    }

    // Delete image file from server (if exists)
    const imagePath = project.image;
    if (imagePath) {
      const filePath = path.resolve(imagePath); // Resolve the file path to ensure it is correct
      try {
        await fs.unlink(filePath); // Delete image file from server
        console.log("❌ Deleted image file");
      } catch (fileError) {
        console.error("❌ Error deleting image file:", fileError.message);
        return res.status(500).json({
          message: "❌ Failed to delete image file",
          error: fileError.message,
        });
      }
    }

    // Return success message
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
