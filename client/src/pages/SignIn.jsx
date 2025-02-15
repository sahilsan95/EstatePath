import React, { useState } from "react"; // Import necessary React components and hooks
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for programmatic navigation
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks for state management
import {
  signInStart, // Action to indicate the start of the sign-in process
  signInSuccess, // Action to indicate successful sign-in
  signInFailure, // Action to handle sign-in failure
} from "../redux/user/userSlice"; // Import actions from userSlice
import OAuth from "../components/OAuth"; // Import OAuth component for third-party authentication

const SignIn = () => {
  // State management for form data
  const [formData, setFormData] = useState({});
  
  // Access loading and error state from Redux store
  const { loading, error } = useSelector((state) => state.user);
  
  const navigate = useNavigate(); // Hook for navigating programmatically
  const dispatch = useDispatch(); // Hook for dispatching actions

  // Handles input changes by updating the formData state
  const handleChange = (e) => {
    setFormData({
      ...formData, // Keep existing form data
      [e.target.id]: e.target.value, // Update the specific input field
    });
  };

  // Handles form submission, sending the sign-in data to the server
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      dispatch(signInStart()); // Dispatch action to indicate sign-in start
      const res = await fetch("/api/auth/signin", {
        method: "POST", // Send POST request for sign-in
        headers: {
          "Content-Type": "application/json", // Indicate JSON data
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });
      const data = await res.json(); // Parse the JSON response

      if (data.success === false) { // Check if the sign-in was unsuccessful
        dispatch(signInFailure(data.message)); // Dispatch action for sign-in failure
        return; // Exit if there's an error
      }

      dispatch(signInSuccess(data)); // Dispatch action for successful sign-in
      navigate("/"); // Navigate to the home page
      console.log(data); // Log the successful response for debugging
    } catch (error) {
      dispatch(signInFailure(error.message)); // Handle errors by dispatching failure action
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto"> {/* Container for the sign-in form */}
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1> {/* Form title */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4"> {/* Form structure with input fields */}
        <input
          type="email" // Input for email
          placeholder="email"
          className="p-3 border rounded-lg"
          id="email"
          onChange={handleChange} // Handle input changes
        />
        <input
          type="password" // Input for password
          placeholder="password"
          className="p-3 border rounded-lg"
          id="password"
          onChange={handleChange} // Handle input changes
        />
        <button
          disabled={loading} // Disable button when loading
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign in"} {/* Button text based on loading state */}
        </button>
        <OAuth /> {/* Include OAuth component for alternative sign-in options */}
      </form>
      <div className="flex gap-2 mt-5"> {/* Link to sign-up page */}
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>} {/* Display error message if exists */}
    </div>
  );
};

export default SignIn; // Export the SignIn component for use in other parts of the application

