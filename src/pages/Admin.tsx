import { useState } from "react";
import {
  Users,
  UserCheck,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Shield,
  Ban,
  Search,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { talents } from "@/data/mockData";

const stats = [
  { label: "Total Pengguna", value: "10,234", icon: Users, change: "+12%" },
  { label: "Pendamping Aktif", value: "523", icon: UserCheck, change: "+8%" },
  { label: "Total Obrolan", value: "45,678", icon: MessageSquare, change: "+23%" },
  { label: "Pendapatan", value: "Rp 125M", icon: DollarSign, change: "+15%" },
];

const pendingVerifications = [
  { id: "v1", name: "Dewi Lestari", email: "dewi@email.com", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face", date: "2024-01-20" },
  { id: "v2", name: "Rizky Pratama", email: "rizky@email.com", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", date: "2024-01-19" },
];

export default function Admin() {
  const [searchQuery, setSearchQuery] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-warm pt-20 md:pt-24 pb-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-2">Dasbor Admin</h1>
        <p className="text-muted-foreground mb-8">Kelola platform RentMate</p>

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

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="users">Pengguna</TabsTrigger>
            <TabsTrigger value="verification">Verifikasi</TabsTrigger>
            <TabsTrigger value="moderation">Moderasi</TabsTrigger>
            <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
          </TabsList>

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

          <TabsContent value="moderation">
            <Card className="p-8 text-center">
              <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Tidak Ada Laporan</h3>
              <p className="text-muted-foreground">Semua obrolan aman dan tidak ada pelanggaran</p>
            </Card>
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
