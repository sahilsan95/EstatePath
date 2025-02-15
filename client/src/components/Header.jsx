import { FaSearch } from "react-icons/fa"; // Importing a search icon from the react-icons library
import { Link, useNavigate } from "react-router-dom"; // Importing Link for navigation and useNavigate for programmatic navigation
import { useSelector } from "react-redux"; // Importing useSelector to access the Redux store state
import { useEffect, useState } from "react"; // Importing useEffect and useState for managing component state and side effects

const Header = () => {
  // Selecting the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);
  
  // Local state for managing the search term
  const [searchTerm, setSearchTerm] = useState("");
  
  // Hook to programmatically navigate
  const navigate = useNavigate();
  
  // Handling form submission for the search functionality
  const handleSubmit = (e) => {
    e.preventDefault(); // Preventing the default form submission behavior
    const urlParams = new URLSearchParams(window.location.search); // Getting current URL parameters
    urlParams.set("searchTerm", searchTerm); // Setting the search term parameter
    const searchQuery = urlParams.toString(); // Converting the parameters to a string
    navigate(`/search?${searchQuery}`); // Navigating to the search results page with the search term
  };

  // Effect hook to update the search term based on the URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Getting URL parameters
    const searchTermFromUrl = urlParams.get("searchTerm"); // Retrieving the search term from the URL
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); // Updating the local state if a search term is found
    }
  }, [location.search]); // Dependency array to re-run the effect when the URL changes

  return (
    <header className="bg-slate-200 shadow-md"> {/* Header with background color and shadow */}
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3"> {/* Container for header content */}
        <Link to="/"> {/* Link to the home page */}
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap"> {/* Header title */}
            <span className="text-slate-500">Estate</span>
            <span className="text-slate-700">Path</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit} // Handling form submission
          className="bg-slate-100 p-3 rounded-lg flex items-center" // Styling for the search form
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64" // Styling for the input field
            value={searchTerm} // Binding the input value to the local state
            onChange={(e) => setSearchTerm(e.target.value)} // Updating the state on input change
          />
          <button> {/* Button to submit the search */}
            <FaSearch className="text-slate-600" /> {/* Search icon */}
          </button>
        </form>
        <ul className="flex gap-4"> {/* Navigation links */}
          <Link to="/"> {/* Link to the home page */}
            <li className="hidden sm:inline text-slate-700 hover:underline"> {/* Home link */}
              Home
            </li>
          </Link>
          <Link to="/about"> {/* Link to the about page */}
            <li className="hidden sm:inline text-slate-700 hover:underline"> {/* About link */}
              About
            </li>
          </Link>
          <Link to="/profile"> {/* Link to the profile page */}
            {currentUser ? ( // Checking if a user is logged in
              <img
                className="rounded-full h-7 w-7 object-cover" // Profile image styling
                src={currentUser.avatar} // User's avatar from the state
                alt="profile" // Alt text for the image
              />
            ) : (
              <li className="text-slate-700 hover:underline">Sign In</li> // Sign In link if no user is logged in
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header; // Exporting the Header component for use in other parts of the application
