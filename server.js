import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs/promises';  // Use fs.promises for async file handling
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 🧪 Load environment variables
dotenv.config();

// Importing modules
import connectDB from './config/db.js';
import registerRoutes from './routes/register.routes.js';
import projectRoutes from './routes/project.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------------
// 🛠 Setup __dirname in ES6 module scope
// ----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------
// 📁 Ensure 'uploads' directory exists for storing files
// ----------------------------
const uploadDir = path.join(__dirname, 'uploads');

// Using async function to handle directory check
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir); // Check if the directory exists
  } catch (err) {
    await fs.mkdir(uploadDir); // Create the directory if it doesn't exist
    console.log('Uploads directory created');
  }
};

// ----------------------------
// 🔗 Connect to MongoDB
// ----------------------------
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Ensure upload directory exists
    await ensureUploadDir();

    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error starting the server:', error.message);
  }
};

// ----------------------------
// 🧩 Global Middlewares
// ----------------------------
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Built-in middleware to parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // Built-in middleware for URL-encoded bodies

// Serve static files (images) from /uploads folder
app.use('/uploads', express.static(uploadDir));

// ----------------------------
// 📦 API Routes
// ----------------------------
app.use('/api/register', registerRoutes);
app.use('/api/projects', projectRoutes);

// ----------------------------
// 🚀 Start the Server
// ----------------------------
startServer();  // Call async function to start the server after successful DB connection

