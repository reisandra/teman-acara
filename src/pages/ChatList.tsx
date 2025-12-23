import { Link } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { talents } from "@/data/mockData";

// Mock active chats
const activeChats = [
  {
    talentId: "1",
    lastMessage: "Siap! Aku tunggu di lobby ya. Sampai ketemu! 😊",
    timestamp: "2024-01-20T10:36:00",
    unread: 2,
  },
  {
    talentId: "3",
    lastMessage: "Oke, besok ya! Jangan lupa bawa kamera",
    timestamp: "2024-01-19T15:20:00",
    unread: 0,
  },
];

export default function ChatList() {
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

  return (
    <div className="min-h-screen bg-gradient-warm pt-20 md:pt-24 pb-24 md:pb-8">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Chat</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Cari percakapan..." className="pl-12 h-12" />
        </div>

        {activeChats.length > 0 ? (
          <div className="space-y-3">
            {activeChats.map((chat) => {
              const talent = talents.find((t) => t.id === chat.talentId);
              if (!talent) return null;

              return (
                <Link key={chat.talentId} to={`/chat/${chat.talentId}`}>
                  <Card hover className="p-4 flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={talent.photo}
                        alt={talent.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold truncate">{talent.name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(chat.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate pr-4">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                            {chat.unread}
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
            <h3 className="text-xl font-bold mb-2">Belum Ada Chat</h3>
            <p className="text-muted-foreground mb-6">
              Chat akan muncul setelah kamu melakukan booking dengan talent
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
