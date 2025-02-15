// Import necessary hooks and utilities from libraries
import { useSelector } from "react-redux"; // To select state from the Redux store
import { useRef, useState, useEffect } from "react"; // React hooks for managing refs, state, and side effects
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"; // Firebase storage utilities
import { app } from "../firebase"; // Import Firebase app configuration
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice"; // Redux actions for user management
import { useDispatch } from "react-redux"; // To dispatch actions
import { Link } from "react-router-dom"; // To create navigable links

const Profile = () => {
  const fileRef = useRef(null); // Ref to handle file input
  const { currentUser, loading, error } = useSelector((state) => state.user); // Destructuring user state from Redux store
  const [file, setFile] = useState(undefined); // State to store the selected file
  const [filePerc, setFilePerc] = useState(0); // State to track file upload progress
  const [fileUploadError, setFileUploadError] = useState(false); // State for file upload errors
  const [formData, setFormData] = useState({}); // State for form data
  const [updateSuccess, setUpdateSuccess] = useState(false); // State to track update success
  const [showListingsError, setShowListingsError] = useState(false); // State for listing errors
  const [userListings, setUserListings] = useState([]); // State for user's listings
  const dispatch = useDispatch(); // Hook to dispatch Redux actions

  // Effect hook to handle file upload when the file state changes
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Function to handle file upload to Firebase storage
  const handleFileUpload = (file) => {
    const storage = getStorage(app); // Initialize Firebase storage
    const fileName = new Date().getTime() + file.name; // Create a unique file name
    const storageRef = ref(storage, fileName); // Create a reference to the storage location
    const uploadTask = uploadBytesResumable(storageRef, file); // Start the file upload

    // Monitor the upload progress and handle success or error
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate upload progress
        setFilePerc(Math.round(progress)); // Update progress state
      },
      (error) => {
        setFileUploadError(true); // Set error state if upload fails
      },
      () => {
        // On successful upload, get the download URL and update form data
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Function to handle form submission for updating user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart()); // Dispatch action to start user update
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData), // Send form data in the request body
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message)); // Dispatch failure action if unsuccessful
        return;
      }
      dispatch(updateUserSuccess(data)); // Dispatch success action
      setUpdateSuccess(true); // Set update success state
    } catch (error) {
      dispatch(updateUserFailure(error.message)); // Handle and dispatch error
    }
  };

  // Function to handle user account deletion
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data)); // Dispatch success action
    } catch (error) {
      dispatch(deleteUserFailure(error.message)); // Dispatch failure action
    }
  };

  // Function to handle user sign out
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data)); // Dispatch success action
    } catch (error) {
      dispatch(signOutUserFailure(error.message)); // Dispatch failure action
    }
  };

  // Function to fetch and display user listings
  const handleShowListings = async () => {
    try {
      setShowListingsError(false); // Reset error state
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true); // Set error state if fetching fails
        return;
      }
      setUserListings(data); // Update listings state
    } catch (error) {
      setShowListingsError(true); // Set error state
    }
  };

  // Function to delete a specific listing
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      // Remove the deleted listing from state
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message); // Log error message if deletion fails
    }
  };

  // JSX for rendering the profile page
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Hidden file input to upload avatar */}
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        {/* Avatar image that triggers file input when clicked */}
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {/* Display upload status messages */}
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload (Image must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        {/* Input fields for user details */}
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        {/* Update button */}
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        {/* Link to create a new listing */}
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      {/* Delete account and sign out options */}
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="uppercase cursor-pointer text-red-500"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="uppercase cursor-pointer text-slate-700"
        >
          Sign Out
        </span>
      </div>
      {/* Button to show user listings */}
      <button
        onClick={handleShowListings}
        className="text-slate-700 underline text-center mt-7"
      >
        Show My Listings
      </button>
      {/* Display listings or error message */}
      {showListingsError ? (
        <p className="text-red-700 text-center mt-3">
          Failed to fetch your listings!
        </p>
      ) : userListings.length > 0 ? (
        userListings.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg shadow-md p-3 mt-5"
          >
            <img
              src={listing.img}
              alt="listing"
              className="rounded-md object-cover aspect-video"
            />
            <p className="text-sm font-bold">{listing.title}</p>
            <p className="text-xs">{listing.desc}</p>
            <button
              onClick={() => handleListingDelete(listing._id)}
              className="bg-red-700 text-white uppercase text-xs rounded-md px-4 py-1 mt-3 hover:opacity-90"
            >
              Delete Listing
            </button>
          </div>
        ))
      ) : null}
      {/* Success message on user update */}
      {updateSuccess ? (
        <p className="text-green-700 text-center mt-3">
          User data successfully updated!
        </p>
      ) : error ? (
        <p className="text-red-700 text-center mt-3">{error}</p>
      ) : null}
    </div>
  );
};

export default Profile;

