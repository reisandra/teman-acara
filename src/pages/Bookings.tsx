import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, MessageCircle, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { talents } from "@/data/mockData";

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
    type: "offline",
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
    type: "offline",
  },
  {
    id: "b3",
    talentId: "5",
    date: "2024-01-28",
    time: "10:00",
    duration: 2,
    purpose: "Traveling / Liburan",
    status: "upcoming",
    total: 280000,
    type: "offline",
  },
];

export default function Bookings() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const upcomingBookings = mockBookings.filter((b) => b.status === "upcoming");
  const completedBookings = mockBookings.filter((b) => b.status === "completed");

  const BookingCard = ({ booking }: { booking: (typeof mockBookings)[0] }) => {
    const talent = talents.find((t) => t.id === booking.talentId);
    if (!talent) return null;

    return (
      <Card hover className="overflow-hidden">
        <div className="flex">
          <img
            src={talent.photo}
            alt={talent.name}
            className="w-28 md:w-36 object-cover"
          />
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold">{talent.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {talent.city}
                </div>
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

            <p className="text-sm text-primary font-medium mb-2">
              {booking.purpose}
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
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

            <div className="flex items-center justify-between pt-3 border-t">
              <span className="font-bold text-primary">
                {formatPrice(booking.total)}
              </span>
              <div className="flex gap-2">
                {booking.status === "upcoming" && (
                  <Link to={`/chat/${booking.talentId}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <MessageCircle className="w-4 h-4" />
                      Obrolan
                    </Button>
                  </Link>
                )}
                {booking.status === "completed" && (
                  <Button size="sm" variant="outline" className="gap-1">
                    <Star className="w-4 h-4" />
                    Beri Ulasan
                  </Button>
                )}
                <Link to={`/talent/${booking.talentId}`}>
                  <Button size="sm" variant="ghost" className="gap-1">
                    Detail
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-warm pt-20 md:pt-24 pb-24 md:pb-8">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Pemesanan Saya</h1>

        <Tabs defaultValue="upcoming">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="upcoming" className="gap-2">
              Akan Datang
              {upcomingBookings.length > 0 && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {upcomingBookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Selesai</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
                <Card className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Belum Ada Pemesanan</h3>
                <p className="text-muted-foreground mb-6">
                  Kamu belum memiliki pemesanan yang akan datang
                </p>
                <Link to="/talents">
                  <Button variant="hero">Cari Pendamping</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedBookings.length > 0 ? (
              completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">Belum Ada Riwayat</h3>
                <p className="text-muted-foreground">
                  Booking yang sudah selesai akan muncul di sini
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
