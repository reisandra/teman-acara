import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Edit3,
  Camera,
  MapPin,
  Calendar,
  Wallet,
  Clock,
  Star,
  ChevronRight,
  Settings,
  LogOut,
  HelpCircle,
  FileText,
  Bell,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingModal } from "@/components/RatingModal";
import { talents } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

// Mock user data
const initialUserData = {
  name: "Budi Santoso",
  username: "budisantoso",
  email: "budi@email.com",
  phone: "+62 812 3456 7890",
  bio: "Suka traveling dan ngobrol santai",
  city: "Jakarta",
  hobbies: "Traveling, Fotografi, Kuliner",
  preference: "offline" as "online" | "offline" | "both",
  photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  joinDate: "Januari 2024",
  wallet: 500000,
};

const mockBookings = [
  {
    id: "b1",
    talentId: "1",
    date: "2024-01-20",
    time: "14:00",
    duration: 2,
    purpose: "Nongkrong / Ngobrol",
    status: "completed",
    total: 300000,
  },
  {
    id: "b2",
    talentId: "3",
    date: "2024-01-25",
    time: "19:00",
    duration: 3,
    purpose: "Dinner / Makan Malam",
    status: "upcoming",
    total: 390000,
  },
];

export default function Profile() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bookings");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [editData, setEditData] = useState(initialUserData);
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    talentId: string;
    bookingId: string;
  }>({ isOpen: false, talentId: "", bookingId: "" });
  const [ratedBookings, setRatedBookings] = useState<string[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleEditClick = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    setUserData(editData);
    setIsEditing(false);
    toast({
      title: "Profil berhasil diperbarui",
      description: "Perubahan telah disimpan",
    });
  };

  const menuItems = [
    { icon: Bell, label: "Notifikasi", path: "#" },
    { icon: Settings, label: "Pengaturan", path: "#" },
    { icon: HelpCircle, label: "Bantuan", path: "#" },
    { icon: FileText, label: "Syarat & Ketentuan", path: "#" },
  ];

  return (
    <div className="min-h-screen bg-gradient-warm pt-20 md:pt-24 pb-24 md:pb-8">
      <div className="container max-w-4xl">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={userData.photo}
                alt={userData.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-primary/20"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-orange">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {!isEditing ? (
              <>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                    <Badge variant="secondary" className="gap-1">
                      <User className="w-3 h-3" />
                      Pengguna
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-1">@{userData.username}</p>
                  <p className="text-sm text-muted-foreground mb-2">{userData.bio}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {userData.city}, Indonesia
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Bergabung {userData.joinDate}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  <Button variant="outline" className="gap-2" onClick={handleEditClick}>
                    <Edit3 className="w-4 h-4" />
                    Edit Profil
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 w-full">
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nama Lengkap</label>
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Username</label>
                      <Input
                        value={editData.username}
                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                        placeholder="Username"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio Singkat</label>
                    <Input
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      placeholder="Ceritakan tentang dirimu"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Kota</label>
                      <Input
                        value={editData.city}
                        onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                        placeholder="Kota"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Hobi</label>
                      <Input
                        value={editData.hobbies}
                        onChange={(e) => setEditData({ ...editData, hobbies: e.target.value })}
                        placeholder="Hobi (pisahkan dengan koma)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Nomor Kontak (opsional)</label>
                    <Input
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      placeholder="Nomor telepon"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferensi Pertemuan</label>
                    <div className="flex gap-2">
                      {[
                        { value: "online", label: "Online" },
                        { value: "offline", label: "Offline" },
                        { value: "both", label: "Keduanya" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={editData.preference === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setEditData({ ...editData, preference: option.value as "online" | "offline" | "both" })
                          }
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Non-editable fields */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Informasi yang tidak dapat diubah:</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email: </span>
                        <span className="font-medium">{userData.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Role: </span>
                        <Badge variant="secondary" className="gap-1">
                          <User className="w-3 h-3" />
                          Pengguna
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="hero" className="flex-1 gap-2" onClick={handleSaveProfile}>
                      <Save className="w-4 h-4" />
                      Simpan Perubahan
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={handleCancelEdit}>
                      <X className="w-4 h-4" />
                      Batal
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Wallet Card */}
        <Card className="p-6 mb-6 bg-gradient-hero text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm opacity-80">Saldo Dompet</p>
                <p className="text-2xl font-bold">{formatPrice(userData.wallet)}</p>
              </div>
            </div>
            <Button variant="secondary" className="text-foreground">
              Isi Saldo
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="bookings">Riwayat Pemesanan</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            {mockBookings.map((booking) => {
              const talent = talents.find((t) => t.id === booking.talentId);
              if (!talent) return null;

              return (
                <Card key={booking.id} hover className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={talent.photo}
                      alt={talent.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold">{talent.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.purpose}
                          </p>
                        </div>
                        <Badge
                          variant={
                            booking.status === "completed"
                              ? "success"
                              : booking.status === "upcoming"
                              ? "accent"
                              : "secondary"
                          }
                        >
                          {booking.status === "completed"
                            ? "Selesai"
                            : booking.status === "upcoming"
                            ? "Akan Datang"
                            : "Dibatalkan"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {booking.time} • {booking.duration} jam
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="font-bold text-primary">
                          {formatPrice(booking.total)}
                        </span>
                        {booking.status === "completed" && !ratedBookings.includes(booking.id) && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => setRatingModal({
                              isOpen: true,
                              talentId: booking.talentId,
                              bookingId: booking.id,
                            })}
                          >
                            <Star className="w-4 h-4" />
                            Beri Penilaian
                          </Button>
                        )}
                        {booking.status === "completed" && ratedBookings.includes(booking.id) && (
                          <Badge variant="success" className="gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Sudah Dinilai
                          </Badge>
                        )}
                        {booking.status === "upcoming" && (
                          <Link to={`/chat/${booking.talentId}`}>
                            <Button size="sm">Obrolan</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="settings" className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.label}
                  hover
                  className="p-4 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Card>
              );
            })}

            <Card
              hover
              className="p-4 flex items-center justify-between cursor-pointer text-destructive"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-medium">Keluar</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rating Modal */}
        {ratingModal.talentId && (
          <RatingModal
            isOpen={ratingModal.isOpen}
            onClose={() => setRatingModal({ isOpen: false, talentId: "", bookingId: "" })}
            talentName={talents.find((t) => t.id === ratingModal.talentId)?.name || ""}
            talentPhoto={talents.find((t) => t.id === ratingModal.talentId)?.photo || ""}
            bookingId={ratingModal.bookingId}
            onSubmit={(rating, comment) => {
              console.log("Rating submitted:", { rating, comment, bookingId: ratingModal.bookingId });
              setRatedBookings((prev) => [...prev, ratingModal.bookingId]);
            }}
          />
        )}
      </div>
    </div>
  );
}
