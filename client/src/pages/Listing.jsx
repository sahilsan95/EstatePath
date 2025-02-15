import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

const Listing = () => {
  // Enable Swiper navigation feature
  SwiperCore.use([Navigation]);

  // State variables for the listing data, loading status, error status, copied link status, and contact form visibility
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  // Extract listingId from URL parameters
  const params = useParams();
  
  // Get the current user from Redux store
  const { currentUser } = useSelector((state) => state.user);

  // useEffect hook to fetch listing data when the component mounts or when the listingId changes
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true); // Start loading
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        
        // Handle API response
        if (data.success === false) {
          setError(true); // Set error if fetch fails
          setLoading(false);
          return;
        }
        
        setListing(data); // Set listing data if fetch is successful
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true); // Set error if an exception occurs
        setLoading(false);
      }
    };
    
    fetchListing(); // Call the fetchListing function
  }, [params.listingId]);

  // Main component rendering
  return (
    <main>
      {/* Display loading message */}
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}

      {/* Display error message if there's an error */}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}

      {/* Render listing details if data is available and no error */}
      {listing && !loading && !error && (
        <>
          {/* Image slider using Swiper */}
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share button to copy listing link */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href); // Copy current URL to clipboard
                setCopied(true); // Show 'Link copied!' message
                setTimeout(() => {
                  setCopied(false); // Hide message after 2 seconds
                }, 2000);
              }}
            />
          </div>

          {/* Link copied notification */}
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          {/* Listing details */}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            {/* Property name and price */}
            <p className="text-2xl font-semibold">
              {listing.name} - ₹{" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-IN")
                : listing.regularPrice.toLocaleString("en-IN")}
              {listing.type === "rent" && " / month"}
            </p>

            {/* Address with an icon */}
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>

            {/* Labels for rent/sale and discount */}
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ₹ {+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>

            {/* Property description */}
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>{" "}
              {listing.description}
            </p>

            {/* Property features: bedrooms, bathrooms, parking, furnishing */}
            <ul className="text-green-900 font-semibold text-sm flex items-center gap-4 sm:gap-6 flex-wrap">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />{" "}
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />{" "}
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />{" "}
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />{" "}
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>

            {/* Contact landlord button for logged-in users (excluding the owner) */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}

            {/* Contact form */}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;

