
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import "./styles/familyTree.css";

const queryClient = new QueryClient();

// Protected route component with fallback for loading state and auth errors
const ProtectedRoute = ({ children, authError = false }: { children: React.ReactNode, authError?: boolean }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  // If there's an auth error or Clerk failed to load, redirect to login
  if (authError || (isLoaded && !isSignedIn)) {
    return <Navigate to="/login" replace />;
  }
  
  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center">Loading authentication...</div>;
  }

  return <>{children}</>;
};

// Wrapper component to conditionally add sidebar and sidebar trigger
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // No sidebar for index, login, register pages
  if (path === "/" || path === "/login" || path === "/register") {
    return <>{children}</>;
  }
  
  // Apply sidebar to all other pages
  return (
    <SidebarProvider>
      <AppSidebar>
        <div className="p-4">
          <div className="flex justify-end mb-4">
            <SidebarTrigger />
          </div>
          {children}
        </div>
      </AppSidebar>
    </SidebarProvider>
  );
};

// Main App component that can accept an authError flag from the ErrorBoundary
const App = ({ authError = false }: { authError?: boolean }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PageWrapper>
                <ProtectedRoute authError={authError}>
                  <Dashboard />
                </ProtectedRoute>
              </PageWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <PageWrapper>
                <ProtectedRoute authError={authError}>
                  <Profile />
                </ProtectedRoute>
              </PageWrapper>
            }
          />
          <Route
            path="*"
            element={
              <PageWrapper>
                <NotFound />
              </PageWrapper>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
