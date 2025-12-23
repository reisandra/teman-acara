import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Talents from "./pages/Talents";
import TalentDetail from "./pages/TalentDetail";
import Booking from "./pages/Booking";
import ChatList from "./pages/ChatList";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/talents" element={<Talents />} />
          <Route path="/talent/:id" element={<TalentDetail />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/chat" element={<ChatList />} />
          <Route path="/chat/:bookingId" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
