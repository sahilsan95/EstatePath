import { useSelector } from "react-redux"; // Importing useSelector to access Redux state
import { Outlet, Navigate } from "react-router-dom"; // Importing Outlet for rendering nested routes and Navigate for redirection

const PrivateRoute = () => {
  // Accessing the currentUser from the Redux store
  const { currentUser } = useSelector((state) => state.user);

  // If a user is authenticated (currentUser exists), render the nested routes using Outlet
  // If not, redirect the user to the Sign-In page
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute; // Exporting the PrivateRoute component for use in the routing setup

