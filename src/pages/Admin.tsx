import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Shield,
  Ban,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { talents } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const stats = [
  { label: "Total Pengguna", value: "10,234", icon: Users, change: "+12%" },
  { label: "Pendamping Aktif", value: "523", icon: UserCheck, change: "+8%" },
  { label: "Total Percakapan", value: "45,678", icon: MessageSquare, change: "+23%" },
  { label: "Pendapatan", value: "Rp 125M", icon: DollarSign, change: "+15%" },
];

const pendingVerifications = [
  { id: "v1", name: "Dewi Lestari", email: "dewi@email.com", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", date: "2024-01-20" },
  { id: "v2", name: "Rizky Pratama", email: "rizky@email.com", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", date: "2024-01-19" },
];

const pendingBookings = [
  { 
    id: "pb1", 
    userName: "Andi Wijaya", 
    userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    talentName: "Sarah Putri",
    talentPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    purpose: "Nongkrong / Ngobrol",
    date: "2024-01-25",
    time: "14:00",
    duration: 2,
    total: 300000,
    paymentStatus: "paid",
    approvalStatus: "pending_approval"
  },
  { 
    id: "pb2", 
    userName: "Dian Permata", 
    userPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    talentName: "Maya Indah",
    talentPhoto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face",
    purpose: "Dinner / Makan Malam",
    date: "2024-01-26",
    time: "19:00",
    duration: 3,
    total: 390000,
    paymentStatus: "paid",
    approvalStatus: "pending_approval"
  },
  { 
    id: "pb3", 
    userName: "Riko Saputra", 
    userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    talentName: "Lisa Andriani",
    talentPhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    purpose: "Temani ke Acara",
    date: "2024-01-27",
    time: "10:00",
    duration: 4,
    total: 520000,
    paymentStatus: "paid",
    approvalStatus: "pending_approval"
  },
];

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState(pendingBookings);
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleApproveBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    toast({
      title: "Pemesanan Disetujui",
      description: "Percakapan antara pengguna dan pendamping sudah aktif",
    });
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    toast({
      title: "Pemesanan Ditolak",
      description: "Pengguna akan menerima notifikasi penolakan",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Admin Header - Terpisah dari Navbar user */}
      <div className="bg-card border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-orange">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-xl">RentMate Admin</span>
              <p className="text-xs text-muted-foreground">Panel Administrasi</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              Keluar
            </Button>
          </Link>
        </div>
      </div>

      <div className="container pt-8 pb-8">
        <h1 className="text-3xl font-bold mb-2">Dasbor Admin</h1>
        <p className="text-muted-foreground mb-8">Kelola platform RentMate - Khusus Administrator</p>

        {/* Admin Notice */}
        <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-sm">Mode Admin Aktif</p>
              <p className="text-xs text-muted-foreground mt-1">
                Sebagai admin, Anda hanya dapat mengelola platform. Admin tidak dapat memesan, membayar, atau menggunakan fitur percakapan.
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="success" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="approvals" className="gap-1">
              <Clock className="w-4 h-4" />
              Persetujuan
              {bookings.length > 0 && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] ml-1">
                  {bookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Pengguna</TabsTrigger>
            <TabsTrigger value="verification">Verifikasi</TabsTrigger>
            <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="approvals" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Pemesanan Menunggu Persetujuan</h2>
                <p className="text-muted-foreground text-sm">
                  Pemesanan yang sudah dibayar dan menunggu persetujuan admin
                </p>
              </div>
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                {bookings.length} Menunggu
              </Badge>
            </div>
            
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="p-5">
                      {/* Header with user & talent info */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <img 
                            src={booking.userPhoto} 
                            alt={booking.userName} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-background shadow" 
                          />
                          <div>
                            <p className="text-xs text-muted-foreground">Pengguna</p>
                            <h3 className="font-bold">{booking.userName}</h3>
                          </div>
                        </div>
                        
                        <div className="text-center text-muted-foreground">
                          <div className="w-8 h-[2px] bg-border mx-auto mb-1" />
                          <span className="text-xs">memesan</span>
                          <div className="w-8 h-[2px] bg-border mx-auto mt-1" />
                        </div>
                        
                        <div className="flex items-center gap-3 flex-1 justify-end">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Pendamping</p>
                            <h3 className="font-bold">{booking.talentName}</h3>
                          </div>
                          <img 
                            src={booking.talentPhoto} 
                            alt={booking.talentName} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow" 
                          />
                        </div>
                      </div>

                      {/* Booking details */}
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Tujuan</p>
                            <p className="font-medium">{booking.purpose}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Tanggal</p>
                            <p className="font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(booking.date).toLocaleDateString("id-ID", { 
                                day: "numeric", 
                                month: "short",
                                year: "numeric"
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Waktu & Durasi</p>
                            <p className="font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {booking.time} • {booking.duration} jam
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Status Pembayaran</p>
                            <Badge variant="success" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Sudah Dibayar
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Pembayaran</p>
                            <p className="font-bold text-primary text-lg">{formatPrice(booking.total)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center justify-between">
                        <Badge variant="accent" className="gap-1">
                          <Clock className="w-3 h-3" />
                          Menunggu Persetujuan Admin
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            size="sm" 
                            className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRejectBooking(booking.id)}
                          >
                            <XCircle className="w-4 h-4" />
                            Tolak Pemesanan
                          </Button>
                          <Button 
                            size="sm" 
                            className="gap-1"
                            onClick={() => handleApproveBooking(booking.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Setujui Pemesanan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Semua Pemesanan Sudah Diproses</h3>
                <p className="text-muted-foreground">Tidak ada pemesanan yang menunggu persetujuan saat ini</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Cari pengguna atau pendamping..."
                  className="pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Pendamping</th>
                      <th className="text-left p-4 font-semibold">Kota</th>
                      <th className="text-left p-4 font-semibold">Penilaian</th>
                      <th className="text-left p-4 font-semibold">Harga</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {talents.map((talent) => (
                      <tr key={talent.id} className="border-t hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={talent.photo} alt={talent.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="font-semibold">{talent.name}</p>
                              <p className="text-sm text-muted-foreground">{talent.age} thn</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{talent.city}</td>
                        <td className="p-4">{talent.rating}</td>
                        <td className="p-4">{formatPrice(talent.pricePerHour)}</td>
                        <td className="p-4">
                          <Badge variant={talent.verified ? "success" : "warning"}>
                            {talent.verified ? "Terverifikasi" : "Menunggu"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Ban className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <h2 className="text-xl font-bold">Verifikasi Pending ({pendingVerifications.length})</h2>
            {pendingVerifications.map((user) => (
              <Card key={user.id} className="p-4 flex items-center gap-4">
                <img src={user.photo} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Dikirim: {user.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1"><CheckCircle className="w-4 h-4" />Terima</Button>
                  <Button size="sm" variant="outline" className="gap-1"><XCircle className="w-4 h-4" />Tolak</Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="revenue">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Ringkasan Pendapatan</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-accent rounded-xl">
                  <p className="text-sm text-muted-foreground">Bulan Ini</p>
                  <p className="text-2xl font-bold text-primary">Rp 45.000.000</p>
                </div>
                <div className="p-4 bg-accent rounded-xl">
                  <p className="text-sm text-muted-foreground">Komisi (10%)</p>
                  <p className="text-2xl font-bold text-primary">Rp 4.500.000</p>
                </div>
                <div className="p-4 bg-accent rounded-xl">
                  <p className="text-sm text-muted-foreground">Total Transaksi</p>
                  <p className="text-2xl font-bold text-primary">234</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
