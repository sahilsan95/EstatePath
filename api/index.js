// Importing required modules and routers
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";

// Loading environment variables from .env file
dotenv.config();

// Connecting to MongoDB using Mongoose with a connection string
mongoose
  .connect('mongodb+srv://21uec062:Lplm10vk%40database@mern-estate.b0kwp6r.mongodb.net/?retryWrites=true&w=majority&appName=mern-estate')
  .then(() => {
    console.log("connected to mongodb"); // Connection success message
  })
  .catch((err) => {
    console.log(err); // Logs any connection errors
  });

// Resolving the directory name for serving static files later
// used in Node.js to determine the absolute path to the directory containing the currently executing script.
const __dirname = path.resolve();

// Initializing Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse cookies in requests
app.use(cookieParser());

// Starting the server and listening on port 3000
app.listen(3000, () => {
  console.log("server is running on port 3000");
});

// Defining API routes
app.use("/api/user", userRouter); // Routes for user-related operations
app.use("/api/auth", authRouter); // Routes for authentication-related operations
app.use("/api/listing", listingRouter); // Routes for listing-related operations

// Serving static files from the client build directory
// Any file in the client/dist folder can be accessed directly via the backend.
app.use(express.static(path.join(__dirname, "/client/dist")));

// Catch-all route to serve index.html for any unspecified route, supporting client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Default to 500 if status code is undefined
  const message = err.message || "Internal server error"; // Default error message
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

