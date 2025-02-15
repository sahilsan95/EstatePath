// Importing required modules from Vite and the React SWC plugin
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Exporting the Vite configuration
export default defineConfig({
  // Server configuration options
  server: {
    // Setting up a proxy to redirect API requests
    proxy: {
      // Any request starting with "/api" will be proxied
      "/api": {
        // Target server for the API requests, often used for backend during development
        target: "http://localhost:3000",
        // Disables SSL verification, useful for local development with HTTP
        secure: false,
      },
    },
  },
  // Adding the React SWC plugin to the Vite configuration
  plugins: [react()],
});
