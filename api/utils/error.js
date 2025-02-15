// Function to create a custom error object
export const errorHandler = (statusCode, message) => {
  const error = new Error(); // Create a new Error object
  error.statusCode = statusCode; // Assign the provided status code to the error
  error.message = message; // Assign the provided message to the error
  return error; // Return the custom error object
};

