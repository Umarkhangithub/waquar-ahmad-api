import mongoose from "mongoose";

// Define Project schema
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: 1000,
    },
    url: {
      type: String,
      required: [true, "Project URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
        },
        message: "Please enter a valid URL",
      },
    },
    image: {
      type: String,
      required: [true, "Image path is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false, // Removes __v from documents
  }
);

// Create and export Project model
const Project = mongoose.model("Project", projectSchema);
export default Project;
