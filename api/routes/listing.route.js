// Importing the Express framework and listing controller functions
import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.contoller.js";
import { verifyToken } from "../utils/verifyUser.js"; // Middleware to verify user authorization

// Creating a new router instance for handling listing routes
const router = express.Router();

// Route to create a new listing, protected by `verifyToken` middleware
router.post("/create", verifyToken, createListing);

// Route to delete a listing by ID, protected by `verifyToken` middleware
router.delete("/delete/:id", verifyToken, deleteListing);

// Route to update a listing by ID, protected by `verifyToken` middleware
router.post("/update/:id", verifyToken, updateListing);

// Route to retrieve a single listing by ID, open to all users
router.get("/get/:id", getListing);

// Route to retrieve all listings, open to all users
router.get("/get", getListings);

// Exporting the router to be used in the main app
export default router;
