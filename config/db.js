import mongoose from "mongoose";

const connectDB = async (MONGO_URI) => {
  try {
    if (!MONGO_URI) {
      throw new Error("MongoDB URI is not provided.");
    }

    const connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
