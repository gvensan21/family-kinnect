
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

// Custom Error Boundary component to catch authentication errors
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Authentication error caught by boundary:", error);
    console.log("Error info:", errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      // Authentication failed, but we still render the app in a non-authenticated state
      return (
        <App authError={true} />
      );
    }
    
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
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
    </ErrorBoundary>
  </React.StrictMode>
);
