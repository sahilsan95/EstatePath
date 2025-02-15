import { errorHandler } from "../utils/error.js"; // Importing the error handler utility to manage error responses
import bcryptjs from "bcryptjs"; // Importing bcryptjs for password hashing
import User from "../models/user.model.js"; // Importing the User model to interact with the users collection
import Listing from "../models/listing.model.js"; // Importing the Listing model to interact with the listings collection

// Test endpoint to check if the API is working
export const test = (req, res) => {
  res.json({
    message: "API route is working!", // Respond with a simple message
  });
};

// Function to update a user's information
export const updateUser = async (req, res, next) => {
  // Check if the user is authorized to update their account
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!")); // Return a 401 error if unauthorized

  try {
    // If a new password is provided, hash it before saving
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    // Update the user information in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true } // Return the updated user
    );

    const { password, ...rest } = updatedUser._doc; // Exclude the password from the response
    res.status(200).json(rest); // Respond with the updated user data
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};

// Function to delete a user account
export const deleteUser = async (req, res, next) => {
  // Check if the user is authorized to delete their account
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!")); // Return a 401 error if unauthorized

  try {
    // Delete the user account from the database
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token"); // Clear the access token cookie
    res.status(200).json("User has been deleted!"); // Respond with a success message
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};

// Function to get all listings created by a specific user
export const getUserListings = async (req, res, next) => {
  // Check if the user is authorized to view their own listings
  if (req.user.id === req.params.id) {
    try {
      // Fetch listings that belong to the user
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings); // Respond with the user's listings
    } catch (error) {
      next(error); // Pass any errors to the error handler
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!")); // Return a 401 error if unauthorized
  }
};

// Function to get a user's information by ID
export const getUser = async (req, res, next) => {
  try {
    // Find the user by ID from the request parameters
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found!")); // Return a 404 error if user not found
    const { password: pass, ...rest } = user._doc; // Exclude the password from the response
    res.status(200).json(rest); // Respond with the user data
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};
