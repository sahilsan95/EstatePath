import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"; // Import necessary Firebase authentication methods
import { app } from "../firebase"; // Import the initialized Firebase app
import { useDispatch } from "react-redux"; // Import useDispatch to access Redux actions
import { signInSuccess } from "../redux/user/userSlice"; // Import the signInSuccess action from the user slice
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const OAuth = () => {
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const navigate = useNavigate(); // Get the navigate function for routing

  // Function to handle Google sign-in
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider(); // Create a new Google auth provider
      const auth = getAuth(app); // Get the auth instance from the Firebase app

      // Sign in with Google using a popup
      const result = await signInWithPopup(auth, provider);
      
      // Send the user's info to the backend after successful sign-in
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify({ // Send user data in the request body
          name: result.user.displayName, // User's display name
          email: result.user.email, // User's email
          photo: result.user.photoURL, // User's profile photo URL
        }),
      });

      const data = await res.json(); // Parse the JSON response from the server
      dispatch(signInSuccess(data)); // Dispatch action to update the user state in Redux
      navigate("/"); // Redirect to the home page after successful sign-in
    } catch (error) {
      // Log error if sign-in fails
      console.log("could not sign in with google", error);
    }
  };

  // Render the Google sign-in button
  return (
    <button
      onClick={handleGoogleClick} // Set click event to handle Google sign-in
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95" // Apply styles to the button
    >
      Continue with Google
    </button>
  );
};

export default OAuth; // Export the OAuth component
