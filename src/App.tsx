
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Symptoms from "./pages/Symptoms";
import Mood from "./pages/Mood";
import Nutrition from "./pages/Nutrition";
import Exercise from "./pages/Exercise";
import BirthPlan from "./pages/BirthPlan";
import Hospitals from "./pages/Hospitals";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import AiAssistant from "./pages/AiAssistant";
import EmergencyContacts from "./pages/EmergencyContacts";
import Appointments from "./pages/Appointments";
import KickCounter from "./pages/KickCounter";
import ContractionTimer from "./pages/ContractionTimer";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

// Wrap the App component in React.StrictMode
const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/symptoms" element={<Symptoms />} />
              <Route path="/mood" element={<Mood />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/exercise" element={<Exercise />} />
              <Route path="/birth-plan" element={<BirthPlan />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              <Route path="/emergency-contacts" element={<EmergencyContacts />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/kick-counter" element={<KickCounter />} />
              <Route path="/contraction-timer" element={<ContractionTimer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
