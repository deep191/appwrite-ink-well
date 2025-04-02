
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
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if Appwrite project ID is configured
    const projectId = localStorage.getItem('VITE_APPWRITE_PROJECT_ID') || APPWRITE_PROJECT;
    
    // We consider it configured if it's not the default placeholder
    const configured = projectId !== 'your-project-id';
    setIsConfigured(configured);
    setIsLoading(false);
    
    if (configured) {
      console.log("Appwrite project configured with ID:", projectId);
    } else {
      console.log("Appwrite project not configured, showing setup screen");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
