import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importing necessary components from react-router-dom for routing
import Home from "./pages/Home"; // Importing the Home page component
import SignIn from "./pages/SignIn"; // Importing the SignIn page component
import SignUp from "./pages/SignUp"; // Importing the SignUp page component
import About from "./pages/About"; // Importing the About page component
import Profile from "./pages/Profile"; // Importing the Profile page component
import Header from "./components/Header"; // Importing the Header component
import PrivateRoute from "./components/PrivateRoute"; // Importing the PrivateRoute component for protected routes
import CreateListing from "./pages/CreateListing"; // Importing the CreateListing page component
import UpdateListing from "./pages/UpdateListing"; // Importing the UpdateListing page component
import Listing from "./pages/Listing"; // Importing the Listing page component
import Search from "./pages/Search"; // Importing the Search page component

const App = () => {
  return (
    <BrowserRouter> {/* Setting up the router for the application */}
      <Header /> {/* Rendering the Header component at the top of every page */}
      <Routes> {/* Defining the routes for the application */}
        <Route path="/" element={<Home />} /> {/* Home route */}
        <Route path="/sign-in" element={<SignIn />} /> {/* Sign-in route */}
        <Route path="/sign-up" element={<SignUp />} /> {/* Sign-up route */}
        <Route path="/about" element={<About />} /> {/* About route */}
        <Route path="/search" element={<Search />} /> {/* Search route */}
        <Route path="/listing/:listingId" element={<Listing />} /> {/* Route for individual listings, with a dynamic listingId */}
        
        {/* Private routes that require authentication */}
        <Route element={<PrivateRoute />}> {/* Wrapping private routes with PrivateRoute for authentication check */}
          <Route path="/profile" element={<Profile />} /> {/* Profile route */}
          <Route path="/create-listing" element={<CreateListing />} /> {/* Route for creating a new listing */}
          <Route path="/update-listing/:listingId" element={<UpdateListing />} /> {/* Route for updating an existing listing */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App; // Exporting the App component for use in other parts of the application

