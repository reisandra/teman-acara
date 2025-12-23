import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Video,
  Users,
  Calendar,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { talents, bookingPurposes } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const talent = talents.find((t) => t.id === id);

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    duration: 2,
    purpose: "",
    type: "offline" as "online" | "offline",
    date: "",
    time: "",
    notes: "",
  });

  if (!talent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Talent tidak ditemukan</h2>
          <Link to="/talents">
            <Button>Kembali ke Daftar Talent</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = talent.pricePerHour * bookingData.duration;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    // Mock booking confirmation
    toast({
      title: "Booking Berhasil! 🎉",
      description: "Kamu akan diarahkan ke halaman chat",
    });
    setTimeout(() => {
      navigate(`/chat/${talent.id}`);
    }, 1500);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return bookingData.duration > 0 && bookingData.purpose;
      case 2:
        return bookingData.date && bookingData.time;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm pt-16 md:pt-24 pb-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Booking Talent</h1>
            <p className="text-muted-foreground">Lengkapi detail booking kamu</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                  step >= s
                    ? "bg-primary text-primary-foreground shadow-orange"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {i < 2 && (
                <div
                  className={cn(
                    "w-16 md:w-24 h-1 mx-2 rounded-full transition-all",
                    step > s ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="md:col-span-2">
            <Card className="p-6">
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Detail Booking</h2>

                  {/* Duration */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Durasi (jam)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6].map((h) => (
                        <Button
                          key={h}
                          variant={bookingData.duration === h ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setBookingData({ ...bookingData, duration: h })
                          }
                        >
                          {h} jam
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Tujuan Booking
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {bookingPurposes.map((purpose) => (
                        <Button
                          key={purpose}
                          variant={
                            bookingData.purpose === purpose ? "default" : "outline"
                          }
                          size="sm"
                          className="justify-start"
                          onClick={() =>
                            setBookingData({ ...bookingData, purpose })
                          }
                        >
                          {purpose}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Tipe Pertemuan
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <Card
                        hover
                        className={cn(
                          "p-4 text-center cursor-pointer",
                          bookingData.type === "offline" &&
                            "border-primary ring-2 ring-primary/20"
                        )}
                        onClick={() =>
                          setBookingData({ ...bookingData, type: "offline" })
                        }
                      >
                        <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-semibold">Offline</h4>
                        <p className="text-xs text-muted-foreground">
                          Bertemu langsung
                        </p>
                      </Card>
                      <Card
                        hover
                        className={cn(
                          "p-4 text-center cursor-pointer",
                          bookingData.type === "online" &&
                            "border-primary ring-2 ring-primary/20"
                        )}
                        onClick={() =>
                          setBookingData({ ...bookingData, type: "online" })
                        }
                      >
                        <Video className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-semibold">Online</h4>
                        <p className="text-xs text-muted-foreground">
                          Video call
                        </p>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Jadwal & Waktu</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Tanggal
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="date"
                          className="pl-11"
                          value={bookingData.date}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, date: e.target.value })
                          }
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Waktu Mulai
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="time"
                          className="pl-11"
                          value={bookingData.time}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, time: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Catatan Tambahan (opsional)
                    </label>
                    <textarea
                      className="w-full h-24 rounded-xl border-2 border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary resize-none"
                      placeholder="Tuliskan catatan atau permintaan khusus..."
                      value={bookingData.notes}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, notes: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Konfirmasi & Pembayaran</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Durasi</span>
                      <span className="font-medium">{bookingData.duration} jam</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Tujuan</span>
                      <span className="font-medium">{bookingData.purpose}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Tipe</span>
                      <Badge variant={bookingData.type === "online" ? "accent" : "secondary"}>
                        {bookingData.type === "online" ? "Online" : "Offline"}
                      </Badge>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Tanggal & Waktu</span>
                      <span className="font-medium">
                        {bookingData.date && new Date(bookingData.date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        - {bookingData.time}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Harga per jam</span>
                      <span className="font-medium">
                        {formatPrice(talent.pricePerHour)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Card className="p-4 bg-accent/50 flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">Metode Pembayaran</p>
                      <p className="text-sm text-muted-foreground">
                        Transfer Bank / E-Wallet
                      </p>
                    </div>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Kembali
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    variant="hero"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="flex-1"
                  >
                    Lanjutkan
                  </Button>
                ) : (
                  <Button
                    variant="hero"
                    onClick={handleConfirm}
                    className="flex-1"
                  >
                    Bayar & Konfirmasi
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Talent Summary */}
          <div className="hidden md:block">
            <Card className="p-5 sticky top-24">
              <div className="flex gap-4 mb-4">
                <img
                  src={talent.photo}
                  alt={talent.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold">{talent.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {talent.city}
                  </div>
                  <div className="flex gap-1 mt-2">
                    {talent.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga per jam</span>
                  <span className="font-medium">
                    {formatPrice(talent.pricePerHour)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Durasi</span>
                  <span className="font-medium">{bookingData.duration} jam</span>
                </div>
                <div className="flex justify-between font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
