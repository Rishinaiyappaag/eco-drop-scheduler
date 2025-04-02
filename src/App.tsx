
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component that checks Supabase config before rendering routes
const AppRoutes = () => {
  const { isSupabaseConfigured } = useSupabase();

  if (!isSupabaseConfigured) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Supabase Configuration Required</h1>
          <p className="mb-4 text-gray-700">
            Please add your Supabase credentials to continue:
          </p>
          <ul className="mb-6 text-left text-sm">
            <li className="mb-2">
              <span className="font-semibold">VITE_SUPABASE_URL</span>: Your Supabase project URL
            </li>
            <li className="mb-2">
              <span className="font-semibold">VITE_SUPABASE_ANON_KEY</span>: Your public anon key
            </li>
          </ul>
          <p className="text-sm text-gray-600">
            Set these in your .env file or directly in the Lovable environment settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/drop-off" element={<DropOff />} />
      <Route path="/rewards" element={<Rewards />} />
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
