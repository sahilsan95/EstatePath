import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      {/* Link to the detailed listing page using the listing's ID */}
      <Link to={`/listing/${listing._id}`}>
        {/* Image of the listing, with hover scaling effect */}
        <img
          src={listing.imageUrls[0]} // Display the first image of the listing
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        
        {/* Container for listing details */}
        <div className="p-3 flex flex-col gap-2 w-full">
          {/* Listing name */}
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          
          {/* Location details with an icon */}
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address} {/* Display the listing's address */}
            </p>
          </div>
          
          {/* Brief description of the listing */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          
          {/* Price display */}
          <p className="text-slate-500 mt-2 font-semibold">
            ₹
            {listing.offer // Check if there is a discount offer
              ? listing.discountPrice.toLocaleString("en-IN") // Display discount price if available
              : listing.regularPrice.toLocaleString("en-IN")} // Otherwise display regular price
            {listing.type === "rent" && " / month"} {/* Add rental indication if applicable */}
          </p>
          
          {/* Display number of bedrooms and bathrooms */}
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-sm">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds` // Pluralize "bed" for multiple bedrooms
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-sm">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths` // Pluralize "bath" for multiple bathrooms
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;

