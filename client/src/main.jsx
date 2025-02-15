import React from "react"; // Importing the React library for building components
import ReactDOM from "react-dom/client"; // Importing the ReactDOM library to render components to the DOM
import App from "./App.jsx"; // Importing the main App component
import "./index.css"; // Importing global CSS styles
import { persistor, store } from "./redux/store.js"; // Importing the Redux store and persistor for state management
import { Provider } from "react-redux"; // Importing Provider to connect Redux to the React app
import { PersistGate } from "redux-persist/integration/react"; // Importing PersistGate to manage persisted state

// Rendering the root element of the React app
ReactDOM.createRoot(document.getElementById("root")).render(
  // Providing the Redux store to the entire app
  // Managing rehydration of persisted state 
  // delay the rendering of your application until the persisted state has been retrieved and rehydrated.
  <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}> 
      <App /> 
    </PersistGate>
  </Provider>
);
