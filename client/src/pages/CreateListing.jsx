import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  // Getting the current user from Redux state
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate(); // Hook for navigation

  // States to manage form data, file uploads, errors, and loading status
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [], // Array to store URLs of uploaded images
    name: "", // Name of the listing
    description: "", // Description of the listing
    address: "", // Address of the listing
    type: "rent", // Default type is 'rent'
    bedrooms: 1, // Default number of bedrooms
    bathrooms: 1, // Default number of bathrooms
    regularPrice: 2000, // Default price
    discountPrice: 0, // Discounted price if any
    offer: false, // Offer status
    parking: false, // Parking availability
    furnished: false, // Furnished status
  });
  const [imageUploadError, setImageUploadError] = useState(false); // Error state for image upload
  const [uploading, setUploading] = useState(false); // Uploading status
  const [error, setError] = useState(false); // Error state for form submission
  const [loading, setLoading] = useState(false); // Loading status for form submission

  // Function to handle image upload
  const handleImageSubmit = () => {
    // Check if the number of selected files does not exceed the limit of 6 images
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      
      // Upload all selected images and store their URLs
      const promises = files.map((file) => storeImage(file));
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: [...formData.imageUrls, ...urls], // Append the new URLs to the existing imageUrls array
          });
          setUploading(false);
        })
        .catch(() => {
          // Handle errors during image upload
          setImageUploadError("Image upload failed (2 MB max per image)");
          setUploading(false);
        });
    } else {
      // Error if more than 6 images are uploaded
      setImageUploadError("You can only upload up to 6 images per listing");
    }
  };

  // Function to upload an image to Firebase Storage and get the download URL
  const storeImage = async (file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${file.name}`; // Generate a unique file name
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Log the upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        reject, // Handle upload error
        () => getDownloadURL(uploadTask.snapshot.ref).then(resolve) // Get the download URL after upload completes
      );
    });
  };

  // Function to remove an image from the formData
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index), // Remove the image at the specified index
    });
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    // Handle changes for the type (rent or sale)
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id, // Update the type in formData
      });
    }
    // Handle changes for checkboxes (parking, furnished, offer)
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked, // Update the checkbox state in formData
      });
    }
    // Handle changes for text, number, and textarea inputs
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value, // Update the respective input value in formData
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Validate the form data
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (formData.regularPrice < formData.discountPrice)
        return setError("Discounted price must be lower than regular price");

      setLoading(true); // Start loading
      setError(false); // Reset error state

      // Send form data to the server
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id, // Reference the current user's ID
        }),
      });
      const data = await res.json();
      setLoading(false); // Stop loading

      // Handle response from the server
      if (!data.success) {
        setError(data.message); // Set error message if submission fails
      } else {
        navigate(`/listing/${data._id}`); // Redirect to the newly created listing
      }
    } catch (error) {
      // Handle errors during form submission
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Form for listing details */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            onChange={handleChange}
            value={formData.name}
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="1"
            required // Indicates that this field is required
          />
          <textarea
            type="text"
            onChange={handleChange}
            value={formData.description}
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required // Indicates that this field is required
          />
          <input
            type="text"
            onChange={handleChange}
            value={formData.address}
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required // Indicates that this field is required
          />
          {/* Options for type, parking, furnished, and offer */}
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"} // Check if the current type is 'sale'
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"} // Check if the current type is 'rent'
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking} // Check if parking is available
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished} // Check if the listing is furnished
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer} // Check if there is an offer
              />
              <span>Offer</span>
            </div>
          </div>
          {/* Input fields for bedrooms, bathrooms, and prices */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                onChange={handleChange}
                value={formData.bedrooms}
                id="bedrooms"
                min="1"
                max="50"
                className="border p-2 rounded-lg"
              />
              <span>Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                onChange={handleChange}
                value={formData.bathrooms}
                id="bathrooms"
                min="1"
                max="50"
                className="border p-2 rounded-lg"
              />
              <span>Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                onChange={handleChange}
                value={formData.regularPrice}
                id="regularPrice"
                min="1"
                className="border p-2 rounded-lg"
                required
              />
              <span>Regular Price</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                onChange={handleChange}
                value={formData.discountPrice}
                id="discountPrice"
                min="0"
                className="border p-2 rounded-lg"
              />
              <span>Discount Price</span>
            </div>
          </div>
          {/* Error message display */}
          {error && <p className="text-red-500">{error}</p>}
          {imageUploadError && <p className="text-red-500">{imageUploadError}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>
        {/* Image upload section */}
        <div className="flex-1 flex flex-col gap-4">
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            multiple
            accept="image/*"
            className="border p-3 rounded-lg"
          />
          <button
            type="button"
            onClick={handleImageSubmit}
            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
          {/* Preview uploaded images */}
          <div className="grid grid-cols-2 gap-4">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Uploaded Preview ${index}`} className="w-full h-32 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
