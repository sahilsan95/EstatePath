import React, { useState } from "react"; // Import necessary React components and hooks
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for programmatic navigation
import OAuth from "../components/OAuth"; // Import the OAuth component for third-party authentication

const SignUp = () => {
  // State management for form data, error messages, and loading state
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Hook for navigating programmatically

  // Handles input changes by updating the formData state
  const handleChange = (e) => {
    setFormData({
      ...formData, // Keep existing form data
      [e.target.id]: e.target.value, // Update the specific input field
    });
  };

  // Handles form submission, sending the sign-up data to the server
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      setLoading(true); // Set loading state to true
      const res = await fetch("/api/auth/signup", {
        method: "POST", // Send POST request for sign-up
        headers: {
          "Content-Type": "application/json", // Indicate JSON data
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await res.json(); // Parse the JSON response
      if (data.success === false) { // Check if the request was successful
        setError(data.message); // Set error message if sign-up failed
        console.log(data); // Log the response for debugging
        setLoading(false); // Set loading state to false
        return; // Exit if there's an error
      }
      
      setLoading(false); // Set loading state to false on success
      setError(null); // Clear any previous errors
      navigate("/sign-in"); // Navigate to the sign-in page
      console.log(data); // Log the successful response for debugging
    } catch (error) {
      setLoading(false); // Handle errors and update loading state
      setError(error.message); // Set error message to display
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto"> {/* Container for the sign-up form */}
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1> {/* Form title */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4"> {/* Form structure with input fields */}
        <input
          type="text" // Input for username
          placeholder="username"
          className="p-3 border rounded-lg"
          id="username"
          onChange={handleChange} // Handle input changes
        />
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
          {loading ? "Loading..." : "Sign up"} {/* Button text based on loading state */}
        </button>
        <OAuth /> {/* Include OAuth component for alternative sign-up options */}
      </form>
      <div className="flex gap-2 mt-5"> {/* Link to sign-in page */}
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>} {/* Display error message if exists */}
    </div>
  );
};

export default SignUp; // Export the SignUp component for use in other parts of the application

