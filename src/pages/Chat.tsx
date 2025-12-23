import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChatBubble } from "@/components/ChatBubble";
import { talents, mockChatRooms, mockBookings, getContextualResponse } from "@/data/mockData";
import type { ChatMessage, Booking } from "@/data/mockData";

export default function Chat() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is a new booking from navigation state
  const stateBooking = location.state?.booking as Booking | undefined;
  const stateTalentId = location.state?.talentId as string | undefined;
  
  // Find the chat room by booking ID or use state data
  const chatRoom = mockChatRooms.find((c) => c.bookingId === bookingId);
  const booking = stateBooking || mockBookings.find((b) => b.id === bookingId);
  const talent = talents.find((t) => t.id === (stateTalentId || chatRoom?.talentId || booking?.talentId));
  
  const [messages, setMessages] = useState<ChatMessage[]>(chatRoom?.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper to mark all user messages as read
  const markAllUserMessagesAsRead = (msgs: ChatMessage[]): ChatMessage[] => {
    return msgs.map((msg) =>
      msg.senderType === "user" && msg.status !== "read"
        ? { ...msg, status: "read" as const }
        : msg
    );
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageId = `m${Date.now()}`;
    const message: ChatMessage = {
      id: messageId,
      senderId: "user1",
      senderType: "user",
      message: newMessage,
      timestamp: new Date().toISOString(),
      status: "sent", // Start with single tick
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate: after 1 second, change to delivered (double tick gray)
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "delivered" as const } : msg
        )
      );
    }, 1000);

    // Show typing indicator after 1.2 seconds
    setTimeout(() => {
      setIsTyping(true);
    }, 1200);

    // Simulate contextual talent response after 2.5 seconds
    setTimeout(() => {
      setIsTyping(false);
      const contextualMessage = getContextualResponse(newMessage, talent?.name || "");
      const response: ChatMessage = {
        id: `m${Date.now() + 1}`,
        senderId: talent?.id || "1",
        senderType: "talent",
        message: contextualMessage,
        timestamp: new Date().toISOString(),
        status: "delivered",
      };
      
      // When talent replies, mark ALL previous user messages as read (orange double tick)
      setMessages((prev) => [...markAllUserMessagesAsRead(prev), response]);
    }, 2500);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  if (!talent || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <Card className="p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Info className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Obrolan Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-6">
            Obrolan hanya tersedia setelah pemesanan berhasil dikonfirmasi
          </p>
          <Link to="/talents">
            <Button variant="hero">Cari Pendamping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-card border-b px-4 py-3 flex items-center gap-3 mt-14 md:mt-16">
        <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Link to={`/talent/${talent.id}`} className="flex items-center gap-3 flex-1">
          <div className="relative">
            <img
              src={talent.photo}
              alt={talent.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold truncate">{talent.name}</h2>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </Link>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowBookingInfo(!showBookingInfo)}
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Booking Info Banner */}
      <div 
        className="flex-shrink-0 bg-accent/50 px-4 py-3 border-b cursor-pointer hover:bg-accent/70 transition-colors"
        onClick={() => setShowBookingInfo(!showBookingInfo)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-sm">
              <strong>{booking.purpose}</strong> • {booking.duration} jam
            </span>
          </div>
          <Badge variant={booking.status === "active" ? "success" : "secondary"}>
            {booking.status === "active" ? "Aktif" : "Selesai"}
          </Badge>
        </div>
      </div>

      {/* Booking Details Expandable */}
      {showBookingInfo && (
        <div className="flex-shrink-0 bg-card border-b p-4 animate-fade-in">
          <h4 className="font-semibold mb-3">Detail Pemesanan</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatBookingDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{booking.time} • {booking.duration} jam</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="capitalize">{booking.type}</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-semibold">
              Rp {booking.totalPrice.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {/* Date Separator */}
        <div className="flex items-center justify-center">
          <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full shadow-sm">
            {formatDate(messages[0]?.timestamp || booking.createdAt)}
          </span>
        </div>

        {/* System Message */}
        <div className="flex justify-center">
          <div className="bg-primary/10 text-primary text-xs px-4 py-2 rounded-full max-w-xs text-center">
            🎉 Pemesanan dikonfirmasi! Silakan koordinasi dengan {talent.name}
          </div>
        </div>

        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            senderPhoto={
              message.senderType === "talent"
                ? talent.photo
                : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
            }
            senderName={message.senderType === "talent" ? talent.name : "Kamu"}
            onDelete={handleDeleteMessage}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2 max-w-[85%] mr-auto animate-fade-in">
            <img
              src={talent.photo}
              alt={talent.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
            />
            <div className="bg-chat-talent text-chat-talent-foreground px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 bg-card border-t p-4 pb-20 md:pb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Ketik pesan..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="pr-12"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <Button
            variant="hero"
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
