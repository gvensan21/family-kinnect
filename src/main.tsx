
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

// Use a default publishable key for development if environment variable is not set
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_dummy-key-for-development";

// We'll still log a warning if the actual key is missing
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key in environment variables. Using a dummy key for development.");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      signInUrl="/login"
      signUpUrl="/register"
      signInFallbackRedirectUrl="/profile"
      signUpFallbackRedirectUrl="/profile"
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
