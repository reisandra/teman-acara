import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChatBubble } from "@/components/ChatBubble";
import { talents, mockChats } from "@/data/mockData";
import type { ChatMessage } from "@/data/mockData";

export default function Chat() {
  const { talentId } = useParams();
  const talent = talents.find((t) => t.id === talentId);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChats);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "user1",
      senderType: "user",
      message: newMessage,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate talent response
    setTimeout(() => {
      const response: ChatMessage = {
        id: `m${Date.now() + 1}`,
        senderId: talentId || "1",
        senderType: "talent",
        message: "Terima kasih pesannya! Aku akan segera merespon ya 😊",
        timestamp: new Date().toISOString(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
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

  if (!talent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Chat tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">
            Chat hanya tersedia setelah booking berhasil
          </p>
          <Link to="/talents">
            <Button>Cari Talent</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-card border-b px-4 py-3 flex items-center gap-3 mt-14 md:mt-16">
        <Link to="/talents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>

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
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Booking Info */}
      <div className="flex-shrink-0 bg-accent/50 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-sm">
              Booking aktif: <strong>2 jam</strong> • Nongkrong / Ngobrol
            </span>
          </div>
          <Badge variant="success">Dikonfirmasi</Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {/* Date Separator */}
        <div className="flex items-center justify-center">
          <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full shadow-sm">
            {formatDate(messages[0]?.timestamp || new Date().toISOString())}
          </span>
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
          />
        ))}

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
