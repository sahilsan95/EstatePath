import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  // Accessing the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  // States to manage file uploads and form data
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent", // Default value is "rent"
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 2000,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  // State to handle various UI feedback
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch existing listing data when the component loads
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();

      // Handle unsuccessful data fetch
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data); // Populate form with fetched data
    };
    fetchListing();
  }, []);

  // Function to handle image uploads
  const handleImageSubmit = (e) => {
    // Check if the number of images is within the allowed limit
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      // Loop through each file and store it
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      // Wait for all image uploads to complete
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          // Handle errors in the image upload
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      // Show an error if the number of images exceeds the limit
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  // Function to store images in Firebase
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name; // Unique filename
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor the progress of the upload
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error); // Reject promise if upload fails
        },
        () => {
          // Resolve promise with download URL when upload completes
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Function to remove an image from the imageUrls array
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      // Handle checkbox inputs
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      // Handle text and number inputs
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation checks
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (formData.regularPrice < formData.discountPrice)
        return setError("Discounted price must be lower than regular price");

      setLoading(true);
      setError(false);

      // Send updated data to the backend
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      // Handle unsuccessful update
      if (data.success === false) {
        setError(data.message);
      }

      // Navigate to the updated listing
      navigate(`/listing/${data._id}`);
    } catch (error) {
      // Handle errors in the update process
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Left Column: Text Inputs */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Input fields for name, description, and address */}
          <input
            type="text"
            onChange={handleChange}
            value={formData.name}
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="1"
            required
          />
          <textarea
            type="text"
            onChange={handleChange}
            value={formData.description}
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            onChange={handleChange}
            value={formData.address}
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />

          {/* Checkbox options for type, parking, furnished, and offer */}
          <div className="flex flex-wrap gap-6">
            {/* Sale or Rent option */}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            {/* Parking, furnished, and offer checkboxes */}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* Input fields for bedrooms, bathrooms, regular price, and discounted price */}
          <div className="flex gap-4">
            <input
              type="number"
              min="1"
              max="20"
              placeholder="Bedrooms"
              onChange={handleChange}
              className="border p-3 rounded-lg"
              value={formData.bedrooms}
              id="bedrooms"
              required
            />
            <input
              type="number"
              min="1"
              max="20"
              placeholder="Bathrooms"
              onChange={handleChange}
              className="border p-3 rounded-lg"
              value={formData.bathrooms}
              id="bathrooms"
              required
            />
          </div>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Regular Price (₹)"
              onChange={handleChange}
              className="border p-3 rounded-lg"
              value={formData.regularPrice}
              id="regularPrice"
              required
            />
            <input
              type="number"
              placeholder="Discounted Price (₹)"
              onChange={handleChange}
              className="border p-3 rounded-lg"
              value={formData.discountPrice}
              id="discountPrice"
              required={formData.offer}
            />
          </div>
        </div>

        {/* Right Column: Image Upload */}
        <div className="flex-1">
          {/* Image upload section */}
          <div className="flex flex-col gap-2">
            <label htmlFor="images" className="font-semibold">
              Upload Images (max 6)
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              className="border p-2 rounded-lg"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="bg-blue-500 text-white py-2 rounded-lg"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
            {imageUploadError && (
              <p className="text-red-500">{imageUploadError}</p>
            )}
          </div>

          {/* Uploaded images preview */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt="Uploaded"
                  className="object-cover w-full h-24 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* Error and loading feedback */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-lg mt-4"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Listing"}
      </button>
    </main>
  );
};

export default UpdateListing;
