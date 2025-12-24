import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChatBubble } from "@/components/ChatBubble";
import { talents, getContextualResponse } from "@/data/mockData";
import { getBookingById } from "@/lib/bookingStore";
import {
  getChatSessionByBookingId,
  getOrCreateChatSession,
  addMessageToChat,
  updateMessageStatus,
  markChatAsRead,
  deleteMessageFromChat,
  subscribeToChats,
  ChatMessage,
  ChatSession,
} from "@/lib/chatStore";
import { getCurrentUser } from "@/lib/userStore";

export default function Chat() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat session from approved booking
  useEffect(() => {
    if (!bookingId) {
      setError("ID pemesanan tidak ditemukan");
      return;
    }

    // Get the booking first
    const booking = getBookingById(bookingId);

    if (!booking) {
      setError("Pemesanan tidak ditemukan");
      return;
    }

    if (booking.approvalStatus !== "approved") {
      setError("Percakapan hanya tersedia untuk pemesanan yang sudah disetujui");
      return;
    }

    // Get or create chat session for this approved booking
    const session = getOrCreateChatSession(booking);

    if (!session) {
      setError("Tidak dapat membuat sesi percakapan");
      return;
    }

    setChatSession(session);
    setMessages(session.messages);
    markChatAsRead(bookingId);
    setError(null);
  }, [bookingId]);

  // Subscribe to chat updates
  useEffect(() => {
    if (!bookingId) return;

    const handleUpdate = () => {
      const session = getChatSessionByBookingId(bookingId);
      if (session) {
        setChatSession(session);
        setMessages(session.messages);
      }
    };

    const unsubscribe = subscribeToChats(handleUpdate);
    return () => unsubscribe();
  }, [bookingId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !bookingId || !chatSession) return;

    // Add user message
    const userMessage = addMessageToChat(bookingId, {
      senderId: "user1",
      senderType: "user",
      message: newMessage,
      status: "sent",
    });

    if (!userMessage) return;

    setNewMessage("");

    // Update local state immediately
    setMessages((prev) => [...prev, userMessage]);

    // Simulate delivery after 1 second
    setTimeout(() => {
      updateMessageStatus(bookingId, userMessage.id, "delivered");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "delivered" as const } : msg
        )
      );
    }, 1000);

    // Show typing indicator
    setTimeout(() => {
      setIsTyping(true);
    }, 1200);

    // Simulate talent response
    setTimeout(() => {
      setIsTyping(false);

      const contextualMessage = getContextualResponse(
        newMessage,
        chatSession.talentName
      );

      const talentMessage = addMessageToChat(bookingId, {
        senderId: chatSession.talentId,
        senderType: "talent",
        message: contextualMessage,
        status: "delivered",
      });

      if (talentMessage) {
        // Mark user messages as read when talent replies
        setMessages((prev) => [
          ...prev.map((msg) =>
            msg.senderType === "user" && msg.status !== "read"
              ? { ...msg, status: "read" as const }
              : msg
          ),
          talentMessage,
        ]);
      }
    }, 2500);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!bookingId) return;
    deleteMessageFromChat(bookingId, messageId);
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

  // Error state - booking not found or not approved
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <Card className="p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Obrolan Tidak Tersedia</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/chat">
              <Button variant="outline">Daftar Obrolan</Button>
            </Link>
            <Link to="/talents">
              <Button variant="hero">Cari Pendamping</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Loading state
  if (!chatSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat percakapan...</p>
        </div>
      </div>
    );
  }

  // Get current user for displaying user messages
  const currentUser = getCurrentUser();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-card border-b px-4 py-3 flex items-center gap-3 mt-14 md:mt-16">
        <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Link
          to={`/talent/${chatSession.talentId}`}
          className="flex items-center gap-3 flex-1"
        >
          <div className="relative">
            <img
              src={chatSession.talentPhoto}
              alt={chatSession.talentName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold truncate">{chatSession.talentName}</h2>
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

      {/* Booking Info Banner - with booking context */}
      <div
        className="flex-shrink-0 bg-accent/50 px-4 py-3 border-b cursor-pointer hover:bg-accent/70 transition-colors"
        onClick={() => setShowBookingInfo(!showBookingInfo)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-sm">
              <strong>{chatSession.purpose}</strong> • {chatSession.duration} jam
            </span>
          </div>
          <Badge variant="success">Aktif</Badge>
        </div>
      </div>

      {/* Booking Details Expandable */}
      {showBookingInfo && (
        <div className="flex-shrink-0 bg-card border-b p-4 animate-fade-in">
          <h4 className="font-semibold mb-3">Detail Pemesanan</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatBookingDate(chatSession.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>
                {chatSession.time} • {chatSession.duration} jam
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="capitalize">{chatSession.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">Disetujui</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {/* Date Separator */}
        <div className="flex items-center justify-center">
          <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full shadow-sm">
            {formatDate(messages[0]?.timestamp || new Date().toISOString())}
          </span>
        </div>

        {/* System Message */}
        <div className="flex justify-center">
          <div className="bg-primary/10 text-primary text-xs px-4 py-2 rounded-full max-w-xs text-center">
            🎉 Pemesanan dikonfirmasi! Silakan koordinasi dengan{" "}
            {chatSession.talentName}
          </div>
        </div>

        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            senderPhoto={
              message.senderType === "talent"
                ? chatSession.talentPhoto
                : currentUser.photo
            }
            senderName={
              message.senderType === "talent" ? chatSession.talentName : "Kamu"
            }
            onDelete={handleDeleteMessage}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2 max-w-[85%] mr-auto animate-fade-in">
            <img
              src={chatSession.talentPhoto}
              alt={chatSession.talentName}
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
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
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
