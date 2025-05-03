
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseProvider, useSupabase } from "@/lib/SupabaseProvider";
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import DropOff from "./pages/DropOff";
import Rewards from "./pages/Rewards";
import Learn from "./pages/Learn";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Partners from "./pages/Partners";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Component that checks Supabase config before rendering routes
const AppRoutes = () => {
  const { isSupabaseConfigured, user, isLoading } = useSupabase();

  // Debug user state
  useEffect(() => {
    console.log("AppRoutes user state:", { user, isLoading });
  }, [user, isLoading]);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <div className="flex-grow flex items-center justify-center p-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  // Admin route component 
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <div className="flex-grow flex items-center justify-center p-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
    
    // For demo purposes, we'll allow any authenticated user to access admin
    // In a real app, you'd check for admin roles
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-red-600">Supabase Configuration Required</h1>
            <p className="mb-4 text-gray-700">
              Authentication is not working because your Supabase credentials are missing or invalid.
            </p>
            <h2 className="text-lg font-semibold mb-2">To fix this issue:</h2>
            <ol className="list-decimal pl-5 mb-6 space-y-2">
              <li>Create a Supabase project at <a href="https://supabase.com" className="text-primary underline">supabase.com</a></li>
              <li>Get your project URL from the API settings</li>
              <li>Get your public anon key from the API settings</li>
              <li>Set these values as environment variables in your project</li>
            </ol>
            <div className="bg-gray-100 p-3 rounded-md mb-6">
              <p className="font-mono text-sm mb-1">VITE_SUPABASE_URL=https://your-project-id.supabase.co</p>
              <p className="font-mono text-sm">VITE_SUPABASE_ANON_KEY=your-anon-key</p>
            </div>
            <p className="text-sm text-gray-600">
              You can continue using the app's non-authentication features, but login and registration will not work until this is fixed.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/drop-off" element={<DropOff />} />
      <Route path="/rewards" element={
        <ProtectedRoute>
          <Rewards />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      } />
      <Route path="/learn" element={<Learn />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SupabaseProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SupabaseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
