import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  DollarSign,
  MessageCircle,
  User,
  Star,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for talent dashboard
const mockTalentProfile = {
  name: "Sarah Wijaya",
  photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  rating: 4.8,
  totalReviews: 24,
  status: "active",
  totalEarnings: 3500000,
  thisMonthEarnings: 850000,
  completedBookings: 42,
  profileViews: 156,
};

const mockIncomingBookings = [
  {
    id: "ib1",
    userName: "Budi Santoso",
    userPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    date: "2024-01-28",
    time: "14:00",
    duration: 2,
    purpose: "Nongkrong / Ngobrol",
    type: "offline",
    total: 300000,
    status: "pending",
  },
  {
    id: "ib2",
    userName: "Andi Pratama",
    userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    date: "2024-01-30",
    time: "19:00",
    duration: 3,
    purpose: "Dinner / Makan Malam",
    type: "offline",
    total: 450000,
    status: "pending",
  },
];

const mockSchedule = [
  {
    id: "s1",
    userName: "Citra Dewi",
    userPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    date: "2024-01-25",
    time: "10:00",
    duration: 2,
    purpose: "Traveling / Liburan",
    status: "confirmed",
  },
  {
    id: "s2",
    userName: "Dimas Putra",
    userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    date: "2024-01-26",
    time: "15:00",
    duration: 3,
    purpose: "Event / Acara",
    status: "confirmed",
  },
];

export default function TalentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const statCards = [
    {
      icon: DollarSign,
      label: "Pendapatan Bulan Ini",
      value: formatPrice(mockTalentProfile.thisMonthEarnings),
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: Calendar,
      label: "Booking Selesai",
      value: mockTalentProfile.completedBookings.toString(),
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Star,
      label: "Rating",
      value: `${mockTalentProfile.rating} / 5`,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      icon: Eye,
      label: "Profil Dilihat",
      value: mockTalentProfile.profileViews.toString(),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-warm pt-20 md:pt-24 pb-24 md:pb-8">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={mockTalentProfile.photo}
              alt={mockTalentProfile.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{mockTalentProfile.name}</h1>
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Talent Aktif
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{mockTalentProfile.rating}</span>
                <span>•</span>
                <span>{mockTalentProfile.totalReviews} ulasan</span>
              </div>
            </div>
          </div>
          <Link to="/profile">
            <Button variant="outline" className="gap-2">
              <User className="w-4 h-4" />
              Edit Profil Talent
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="incoming" className="relative">
              Booking Masuk
              {mockIncomingBookings.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {mockIncomingBookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="schedule">Jadwal</TabsTrigger>
            <TabsTrigger value="earnings">Pendapatan</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Booking Masuk Terbaru
                </h3>
                {mockIncomingBookings.slice(0, 2).map((booking) => (
                  <div key={booking.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl mb-2">
                    <img
                      src={booking.userPhoto}
                      alt={booking.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{booking.userName}</p>
                      <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                    </div>
                    <Badge variant="accent">Menunggu</Badge>
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-2" onClick={() => setActiveTab("incoming")}>
                  Lihat Semua
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Statistik Performa
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Pendapatan</span>
                    <span className="font-bold text-green-500">
                      {formatPrice(mockTalentProfile.totalEarnings)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Booking Selesai</span>
                    <span className="font-bold">{mockTalentProfile.completedBookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tingkat Respons</span>
                    <span className="font-bold text-primary">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tingkat Penyelesaian</span>
                    <span className="font-bold text-primary">95%</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Incoming Bookings Tab */}
          <TabsContent value="incoming" className="space-y-4">
            {mockIncomingBookings.map((booking) => (
              <Card key={booking.id} hover className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <img
                    src={booking.userPhoto}
                    alt={booking.userName}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{booking.userName}</h3>
                      <Badge variant="outline">{booking.type === "online" ? "Online" : "Offline"}</Badge>
                    </div>
                    <p className="text-sm text-primary font-medium">{booking.purpose}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.date).toLocaleDateString("id-ID", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.time} • {booking.duration} jam
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(booking.total)}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1 text-destructive">
                        <XCircle className="w-4 h-4" />
                        Tolak
                      </Button>
                      <Button size="sm" variant="hero" className="gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Terima
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            {mockSchedule.map((schedule) => (
              <Card key={schedule.id} hover className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={schedule.userPhoto}
                    alt={schedule.userName}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{schedule.userName}</h3>
                    <p className="text-sm text-primary font-medium">{schedule.purpose}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(schedule.date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {schedule.time} • {schedule.duration} jam
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="success">Dikonfirmasi</Badge>
                    <Button size="sm" variant="outline" className="gap-1">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-4">
            <Card className="p-6 bg-gradient-hero text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Pendapatan</p>
                  <p className="text-3xl font-bold">
                    {formatPrice(mockTalentProfile.totalEarnings)}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                  <DollarSign className="w-8 h-8" />
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-bold mb-4">Pendapatan per Bulan</h3>
                <div className="space-y-3">
                  {[
                    { month: "Januari 2024", amount: 850000 },
                    { month: "Desember 2023", amount: 1200000 },
                    { month: "November 2023", amount: 950000 },
                    { month: "Oktober 2023", amount: 500000 },
                  ].map((item) => (
                    <div key={item.month} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                      <span>{item.month}</span>
                      <span className="font-bold text-green-500">{formatPrice(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-bold mb-4">Riwayat Penarikan</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                    <div>
                      <p className="font-medium">Penarikan ke Bank BCA</p>
                      <p className="text-sm text-muted-foreground">15 Jan 2024</p>
                    </div>
                    <span className="font-bold">Rp 500.000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                    <div>
                      <p className="font-medium">Penarikan ke Bank BCA</p>
                      <p className="text-sm text-muted-foreground">1 Jan 2024</p>
                    </div>
                    <span className="font-bold">Rp 700.000</span>
                  </div>
                </div>
                <Button variant="hero" className="w-full mt-4">
                  Tarik Saldo
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
