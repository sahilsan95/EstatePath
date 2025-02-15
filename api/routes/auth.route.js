// Importing the Express framework and authentication controller functions
import express from "express";
import {
  signup,
  signin,
  google,
  signout,
} from "../controllers/auth.controller.js";

// Creating a new router instance for handling authentication routes
const router = express.Router();

// Route for user signup, calling the `signup` controller function
router.post("/signup", signup);

// Route for user signin, calling the `signin` controller function
router.post("/signin", signin);

// Route for Google sign-in, calling the `google` controller function
router.post("/google", google);

// Route for user signout, calling the `signout` controller function
router.get("/signout", signout);

// Exporting the router to be used in the main app
export default router;

