import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null); // State to hold landlord's information
  const [message, setMessage] = useState(""); // State to hold the message input by the user

  // Function to handle changes in the message input
  const onChange = (e) => {
    setMessage(e.target.value); // Update the message state with the current input value
  };

  // Fetch landlord information based on the user reference from the listing
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`); // Fetch landlord data from the API
        const data = await res.json(); // Parse the JSON response
        setLandlord(data); // Update landlord state with the fetched data
      } catch (error) {
        console.log(error); // Log any errors that occur during the fetch
      }
    };
    fetchLandlord(); // Call the fetch function
  }, [listing.userRef]); // Run this effect when listing.userRef changes

  return (
    <div>
      {landlord && ( // Only render this section if landlord data has been fetched
        <div className="flex flex-col gap-2">
          {/* Display the landlord's name and the listing's name */}
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          
          {/* Textarea for the user to input their message */}
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message} // Bind the textarea value to the message state
            onChange={onChange} // Update the message state on input change
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          {/* Link to open the user's email client with pre-filled email details */}
          <Link
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} // Construct email with subject and body
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;

