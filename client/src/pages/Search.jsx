import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "", // Search term input
    type: "all", // Type of listing (all, rent, sale)
    parking: false, // Parking availability filter
    furnished: false, // Furnished filter
    offer: false, // Offer filter
    sort: "created_at", // Sorting criteria
    order: "desc", // Sort order
  });
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [listings, setListings] = useState([]); // State to hold fetched listings
  const [showmore, setShowmore] = useState(false); // Control visibility of "Show more" button

  useEffect(() => {
    // Parse URL parameters for search filters
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    
    // Update sidebar data state based on URL parameters
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    // Function to fetch listings based on search criteria
    const fetchListings = async () => {
      setLoading(true); // Set loading to true before fetching data
      setShowmore(false); // Hide "Show more" button initially
      const searchQuery = urlParams.toString(); // Create search query string
      const res = await fetch(`/api/listing/get?${searchQuery}`); // Fetch listings from API
      const data = await res.json(); // Parse JSON response
      setShowmore(data.length > 8); // Show "Show more" button if more than 8 listings
      setListings(data); // Update listings state with fetched data
      setLoading(false); // Set loading to false after fetching
    };

    fetchListings(); // Call fetch function
  }, [location.search]); // Effect runs when location.search changes

  // Handle input changes for filters and search term
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id }); // Update type based on checkbox
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value }); // Update search term
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false, // Update boolean filters
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at"; // Get sort field
      const order = e.target.value.split("_")[1] || "desc"; // Get sort order
      setSidebardata({ ...sidebardata, sort, order }); // Update sorting criteria
    }
  };

  // Handle form submission to trigger search
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const urlParams = new URLSearchParams(); // Create URLSearchParams instance
    urlParams.set("searchTerm", sidebardata.searchTerm); // Add search term
    urlParams.set("type", sidebardata.type); // Add type
    urlParams.set("parking", sidebardata.parking); // Add parking filter
    urlParams.set("furnished", sidebardata.furnished); // Add furnished filter
    urlParams.set("offer", sidebardata.offer); // Add offer filter
    urlParams.set("sort", sidebardata.sort); // Add sort field
    urlParams.set("order", sidebardata.order); // Add sort order
    const searchQuery = urlParams.toString(); // Create search query string
    navigate(`/search?${searchQuery}`); // Navigate to search results page
  };

  // Load more listings when "Show more" button is clicked
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length; // Get current number of listings
    const startIndex = numberOfListings; // Set start index for pagination
    const urlParams = new URLSearchParams(location.search); // Create URLSearchParams instance
    urlParams.set("startIndex", startIndex); // Add start index to query
    const searchQuery = urlParams.toString(); // Create search query string
    const res = await fetch(`/api/listing/get?${searchQuery}`); // Fetch more listings
    const data = await res.json(); // Parse JSON response
    setShowmore(data.length >= 9); // Update "Show more" visibility based on fetched data
    setListings([...listings, ...data]); // Append new listings to the existing ones
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar for filters and search form */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Search term input */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              onChange={handleChange}
              value={sidebardata.searchTerm} // Bind value to state
            />
          </div>
          {/* Type filters */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"} // Bind checked state to type
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"} // Bind checked state to type
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"} // Bind checked state to type
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer} // Bind checked state to offer
              />
              <span>Offer</span>
            </div>
          </div>
          {/* Amenities filters */}
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking} // Bind checked state to parking
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished} // Bind checked state to furnished
              />
              <span>Furnished</span>
            </div>
          </div>
          {/* Sort options */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              id="sort_order"
              className="border rounded-lg p-3 w-full"
            >
              <option value="created_at_desc">Most Recent</option>
              <option value="created_at_asc">Oldest</option>
              <option value="price_desc">Highest Price</option>
              <option value="price_asc">Lowest Price</option>
            </select>
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="border bg-blue-600 text-white rounded-lg py-2 px-4"
          >
            Search
          </button>
        </form>
      </div>

      {/* Listings display section */}
      <div className="flex flex-wrap p-7 gap-5 md:gap-6 w-full">
        {loading && <p>Loading...</p>} {/* Loading indicator */}
        {!loading &&
          listings.length === 0 && <p>No listings found</p>} {/* No listings message */}
        {listings.length > 0 &&
          listings.map((item) => (
            <ListingItem key={item._id} data={item} /> // Render ListingItem for each listing
          ))}
        {/* Show more button */}
        {showmore && (
          <button
            className="border bg-blue-600 text-white rounded-lg py-2 px-4 w-full"
            onClick={onShowMoreClick}
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
