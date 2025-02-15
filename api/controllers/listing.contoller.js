import Listing from "../models/listing.model.js"; // Importing the Listing model to interact with the listings collection in MongoDB
import { errorHandler } from "../utils/error.js"; // Importing the error handler utility to manage error responses

// Function to create a new listing
export const createListing = async (req, res, next) => {
  try {
    // Attempt to create a new listing using the request body
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing); // Respond with the newly created listing and a 201 status
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};

// Function to delete a listing by ID
export const deleteListing = async (req, res, next) => {
  // Find the listing by ID from the request parameters
  const listing = await Listing.findById(req.params.id);
  // If the listing doesn't exist, return a 404 error
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  // Check if the current user is authorized to delete the listing
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    // Attempt to delete the listing by ID
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!"); // Respond with a success message
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};

// Function to update a listing by ID
export const updateListing = async (req, res, next) => {
  // Find the listing by ID from the request parameters
  const listing = await Listing.findById(req.params.id);
  // If the listing doesn't exist, return a 404 error
  if (!listing) return next(errorHandler(404, "Listing not found!"));
  // Check if the current user is authorized to update the listing
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }
  try {
    // Attempt to update the listing with the new data from the request body
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated listing
    );
    res.status(200).json(updatedListing); // Respond with the updated listing
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};

// Function to get a listing by ID
export const getListing = async (req, res, next) => {
  try {
    // Find the listing by ID from the request parameters
    const listing = await Listing.findById(req.params.id);
    // If the listing doesn't exist, return a 404 error
    if (!listing) return next(errorHandler(404, "Listing not found!"));
    res.status(200).json(listing); // Respond with the found listing
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};

// Function to get multiple listings with filtering and pagination
export const getListings = async (req, res, next) => {
  try {
    // Parse query parameters for pagination and filters
    const limit = parseInt(req.query.limit) || 9; // Number of listings to return
    const startIndex = parseInt(req.query.startIndex) || 0; // Index to start fetching listings from
    let offer = req.query.offer; // Offer filter
    // Default to fetching both true and false offers if not specified
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished; // Furnished filter
    // Default to fetching both true and false furnished listings if not specified
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking; // Parking filter
    // Default to fetching both true and false parking listings if not specified
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }
    let type = req.query.type; // Type filter (sale or rent)
    // Default to fetching both sale and rent listings if not specified
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || ""; // Search term for listings
    const sort = req.query.sort || "createdAt"; // Sorting criteria
    const order = req.query.order || "desc"; // Sorting order

    // Fetch listings from the database with the specified filters and sorting
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, // Search for listings by name with case insensitivity
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order, // Sort listings based on the specified criteria
      })
      .limit(limit) // Limit the number of results returned
      .skip(startIndex); // Skip the specified number of results

    return res.status(200).json(listings); // Respond with the fetched listings
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};
