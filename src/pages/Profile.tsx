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
  Crown,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingModal } from "@/components/RatingModal";
import { talents } from "@/data/mockData";

// Mock user data
const mockUser = {
  name: "Budi Santoso",
  email: "budi@email.com",
  phone: "+62 812 3456 7890",
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
  const [activeTab, setActiveTab] = useState("bookings");
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    talentId: string;
    bookingId: string;
  }>({ isOpen: false, talentId: "", bookingId: "" });
  const [ratedBookings, setRatedBookings] = useState<string[]>([]);
  
  // Check user role from localStorage (UI state only)
  const [userRole, setUserRole] = useState<"user" | "talent">(() => {
    return (localStorage.getItem("userRole") as "user" | "talent") || "user";
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
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
                src={mockUser.photo}
                alt={mockUser.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-primary/20"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-orange">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                {userRole === "talent" ? (
                  <Badge variant="default" className="gap-1">
                    <Crown className="w-3 h-3" />
                    Talent
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <User className="w-3 h-3" />
                    User
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-2">{mockUser.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Jakarta, Indonesia
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Bergabung {mockUser.joinDate}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Button variant="outline" className="gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Profil
              </Button>
              {userRole === "user" ? (
                <Link to="/talent-registration">
                  <Button variant="hero" className="gap-2 w-full">
                    <Star className="w-4 h-4" />
                    Daftar sebagai Talent
                  </Button>
                </Link>
              ) : (
                <Link to="/talent-dashboard">
                  <Button variant="hero" className="gap-2 w-full">
                    <Users className="w-4 h-4" />
                    Dashboard Talent
                  </Button>
                </Link>
              )}
            </div>
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
                <p className="text-sm opacity-80">Saldo Wallet</p>
                <p className="text-2xl font-bold">{formatPrice(mockUser.wallet)}</p>
              </div>
            </div>
            <Button variant="secondary" className="text-foreground">
              Top Up
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="bookings">Riwayat Booking</TabsTrigger>
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
                            Beri Rating
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
                            <Button size="sm">Chat</Button>
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
