import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ParentRegistration from "./pages/ParentRegistration";
import BabysitterRegistration from "./pages/BabysitterRegistration";
import ParentDashboard from "./pages/ParentDashboard";
import BabysitterDashboard from "./pages/BabysitterDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register/parent" element={<ParentRegistration />} />
            <Route path="/register/babysitter" element={<BabysitterRegistration />} />
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/babysitter/dashboard" element={<BabysitterDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
