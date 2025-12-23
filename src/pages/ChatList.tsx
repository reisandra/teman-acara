import { Link } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { talents, mockChatRooms, mockBookings } from "@/data/mockData";
import { useState } from "react";

export default function ChatList() {
  const [searchQuery, setSearchQuery] = useState("");

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Kemarin";
    } else if (days < 7) {
      return date.toLocaleDateString("id-ID", { weekday: "long" });
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    }
  };

  // Filter chat rooms based on search
  const filteredChatRooms = mockChatRooms.filter((chatRoom) => {
    const talent = talents.find((t) => t.id === chatRoom.talentId);
    if (!talent) return false;
    
    const matchesSearch = talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatRoom.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-warm pt-20 md:pt-24 pb-24 md:pb-8">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Chat</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Cari percakapan..." 
            className="pl-12 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredChatRooms.length > 0 ? (
          <div className="space-y-3">
            {filteredChatRooms.map((chatRoom) => {
              const talent = talents.find((t) => t.id === chatRoom.talentId);
              const booking = mockBookings.find((b) => b.id === chatRoom.bookingId);
              if (!talent || !booking) return null;

              return (
                <Link key={chatRoom.id} to={`/chat/${chatRoom.bookingId}`}>
                  <Card hover className="p-4 flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={talent.photo}
                        alt={talent.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/10"
                      />
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold truncate">{talent.name}</h3>
                          <Badge 
                            variant={booking.status === "active" ? "success" : "secondary"}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {booking.status === "active" ? "Aktif" : "Selesai"}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(chatRoom.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {booking.purpose} • {booking.duration} jam
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate pr-4">
                          {chatRoom.lastMessage}
                        </p>
                        {chatRoom.unreadCount > 0 && (
                          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                            {chatRoom.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery ? "Tidak Ditemukan" : "Belum Ada Chat"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? "Coba kata kunci lain atau cari talent baru"
                : "Chat akan muncul setelah kamu melakukan booking dengan talent"}
            </p>
            <Link to="/talents">
              <button className="text-primary font-semibold hover:underline">
                Cari Talent Sekarang
              </button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
