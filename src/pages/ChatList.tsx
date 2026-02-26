import { Link } from "react-router-dom";
import { Search, MessageCircle, User } from "lucide-react"; // Tambahkan icon User
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getActiveChatSessions, subscribeToChats, ChatSession } from "@/lib/chatStore";
import { subscribeToBookings } from "@/lib/bookingStore";

// --- ASUMSI: Anda punya hook untuk mendapatkan data user yang login ---
// Ganti dengan path dan implementasi hook autentikasi Anda
import { useAuth } from "@/hooks/useAuth"; 

export default function ChatList() {
  // 1. Ambil user yang sedang login
  const { user, isLoading } = useAuth(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(true);

  useEffect(() => {
    // Jika tidak ada user yang login, kosongkan chat dan hentikan loading
    if (!user) {
      setChatSessions([]);
      setIsChatLoading(false);
      return;
    }

    const loadChats = async () => {
      try {
        setIsChatLoading(true);
        // 2. Kirim user.id ke fungsi pengambilan data
        const sessions = await getActiveChatSessions(user.id);
        const validSessions = sessions.filter(session => 
          session && session.id && session.talentName && session.talentName !== "Mulai percakapan..."
        );
        setChatSessions(validSessions);
      } catch (error) {
        console.error("Error loading chats:", error);
      } finally {
        setIsChatLoading(false);
      }
    };

    loadChats();

    // 3. Kirim user.id ke fungsi subscription
    const unsubscribeChats = subscribeToChats(user.id, loadChats);
    const unsubscribeBookings = subscribeToBookings(user.id, loadChats);

    return () => {
      unsubscribeChats();
      unsubscribeBookings();
    };
    // 4. useEffect akan dijalankan ulang jika user yang login berubah
  }, [user?.id]); 

  // ... (fungsi formatTime dan filteredChatSessions tetap sama)
  const formatTime = (dateString: string) => {
    // ... kode tidak berubah
  };

  const filteredChatSessions = chatSessions.filter((session) => {
    if (!session) return false;
    
    const talentName = session.talentName ?? "";
    const lastMessage = session.lastMessage ?? "";
    const purpose = session.purpose ?? "";

    const matchesSearch =
      talentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purpose.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // 5. Tampilkan pesan jika user belum login
  // 5️⃣ Jika auth masih loading
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Memeriksa sesi login...</p>
    </div>
  );
}

// 6️⃣ Jika benar-benar belum login
if (!user) {
  return (
    <div className="min-h-screen bg-gradient-warm pt-20 md:pt-24 pb-24 md:pb-8 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md">
        <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-bold mb-2">Anda Belum Login</h3>
        <p className="text-muted-foreground mb-6">
          Silakan login untuk melihat daftar percakapan Anda.
        </p>
        <Link to="/login">
          <button className="text-primary font-semibold hover:underline">
            Login Sekarang
          </button>
        </Link>
      </Card>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-warm pt-20 md:pt-24 pb-24 md:pb-8">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Obrolan</h1>

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

        {isChatLoading ? (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-muted-foreground animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2">Memuat Obrolan...</h3>
          </Card>
        ) : filteredChatSessions.length > 0 ? (
          <div className="space-y-3">
            {filteredChatSessions.map((session) => (
              <Link key={session.id} to={`/chat/${session.bookingId}`}>
                <Card hover className="p-4 flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={session.talentPhoto || "/placeholder-avatar.png"}
                      alt={session.talentName}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/10"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold truncate">{session.talentName}</h3>
                        <Badge variant="success" className="text-[10px] px-1.5 py-0">
                          Aktif
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(session.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {session.purpose} • {session.duration} jam
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate pr-4">
                        {session.lastMessage}
                      </p>
                      {session.unreadCount > 0 && (
                        <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                          {session.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery ? "Tidak Ditemukan" : "Belum Ada Obrolan"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Coba kata kunci lain atau cari teman baru"
                : "Obrolan akan muncul setelah pemesanan kamu disetujui oleh admin"}
            </p>
            <Link to="/talents">
              <button className="text-primary font-semibold hover:underline">
                Cari Teman Sekarang
              </button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}