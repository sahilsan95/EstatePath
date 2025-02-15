// Importing the Express framework and user controller functions
import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js"; // Middleware to verify user authorization

// Creating a new router instance for handling user routes
const router = express.Router();

// Route to test the user route setup, mainly for debugging
router.get("/test", test);

// Route to update user information by ID, protected by `verifyToken` middleware
router.post("/update/:id", verifyToken, updateUser);

// Route to delete a user by ID, protected by `verifyToken` middleware
router.delete("/delete/:id", verifyToken, deleteUser);

// Route to get all listings created by a user, by user ID, protected by `verifyToken`
router.get("/listings/:id", verifyToken, getUserListings);

// Route to retrieve specific user information by ID, protected by `verifyToken`
router.get("/:id", verifyToken, getUser);

// Exporting the router to be used in the main app
export default router;

