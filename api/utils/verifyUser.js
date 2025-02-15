import { errorHandler } from "./error.js"; // Importing the errorHandler function to handle errors
import jwt from "jsonwebtoken"; // Importing the jsonwebtoken library for token verification

// Middleware function to verify JWT
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // Retrieve the token from cookies

  // Check if the token is present
  if (!token) return next(errorHandler(401, "Unauthorized")); // If not, call errorHandler with 401 status

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden")); // If verification fails, call errorHandler with 403 status
    req.user = user; // If verification is successful, attach user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

