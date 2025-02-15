import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingItem from "../components/ListingItem";

// Home component that displays listings and offers
const Home = () => {
  // State variables to hold different types of listings
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  // Enable navigation for Swiper
  SwiperCore.use([Navigation]);

  // Log offer listings to console for debugging
  console.log(offerListings);

  // Fetch listings when the component mounts
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        // Fetch offer listings
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data); // Update state with fetched data
        fetchRentListings(); // Fetch rent listings after offers
      } catch (error) {
        console.log(error); // Log any errors
      }
    };

    const fetchRentListings = async () => {
      try {
        // Fetch rent listings
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data); // Update state with fetched data
        fetchSaleListings(); // Fetch sale listings after rents
      } catch (error) {
        console.log(error); // Log any errors
      }
    };

    const fetchSaleListings = async () => {
      try {
        // Fetch sale listings
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data); // Update state with fetched data
      } catch (error) {
        console.log(error); // Log any errors
      }
    };

    fetchOfferListings(); // Initiate the first fetch
  }, []);

  return (
    <div>
      {/* Top section with title and description */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Estate Path is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
          to="/search"
        >
          Let's get started...
        </Link>
      </div>

      {/* Swiper for showcasing offer listings */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}> {/* Unique key for each slide */}
              <div
                className="h-[550px]"
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`, // Set background image
                  backgroundSize: "cover", // Cover the entire area
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Display sections for offer, sale, and rent listings */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} /> /* Render ListingItem for offers */
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} /> /* Render ListingItem for rents */
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} /> /* Render ListingItem for sales */
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

