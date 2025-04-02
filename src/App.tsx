
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { APPWRITE_PROJECT } from "@/lib/appwrite";
import Index from "./pages/Index";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AppwriteSetup from "./components/AppwriteSetup";

const queryClient = new QueryClient();

const App = () => {
  const [isConfigured, setIsConfigured] = useState(true);
  
  useEffect(() => {
    // Check if Appwrite project ID is configured
    const projectId = localStorage.getItem('VITE_APPWRITE_PROJECT_ID') || APPWRITE_PROJECT;
    setIsConfigured(projectId !== 'your-project-id');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {!isConfigured ? (
            <AppwriteSetup />
          ) : (
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
