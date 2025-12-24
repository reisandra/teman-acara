import { useState, useEffect } from "react";
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
  Loader2,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { talents, bookingPurposes } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { addBooking, getBookingById, getActiveBookingByTalent, subscribeToBookings, SharedBooking } from "@/lib/bookingStore";
import { getCurrentUser } from "@/lib/userStore";

type BookingStatus = "draft" | "pending_payment" | "pending_approval" | "approved" | "rejected";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const talent = talents.find((t) => t.id === id);

  const [step, setStep] = useState(1);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("draft");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    duration: 2,
    purpose: "",
    type: "offline" as "online" | "offline",
    date: "",
    time: "",
    notes: "",
  });

  // Check for existing active booking on page load (STEP LOCK)
  useEffect(() => {
    if (!id) return;
    
    const existingBooking = getActiveBookingByTalent(id);
    if (existingBooking) {
      // Restore booking state - LOCK the step
      setCurrentBookingId(existingBooking.id);
      setStep(3); // Lock at final step
      setBookingData({
        duration: existingBooking.duration,
        purpose: existingBooking.purpose,
        type: existingBooking.type,
        date: existingBooking.date,
        time: existingBooking.time,
        notes: existingBooking.notes || "",
      });
      
      // Set appropriate status based on approval
      if (existingBooking.approvalStatus === "approved") {
        setBookingStatus("approved");
      } else if (existingBooking.approvalStatus === "pending_approval") {
        setBookingStatus("pending_approval");
      }
    }
  }, [id]);

  // Subscribe to booking updates from Admin
  useEffect(() => {
    if (!currentBookingId) return;
    
    const checkStatus = () => {
      const booking = getBookingById(currentBookingId);
      if (booking) {
        if (booking.approvalStatus === "approved" && bookingStatus !== "approved") {
          setBookingStatus("approved");
          toast({
            title: "Pemesanan Disetujui!",
            description: "Admin telah menyetujui pemesanan. Percakapan sudah aktif.",
          });
        } else if (booking.approvalStatus === "rejected" && bookingStatus !== "rejected") {
          setBookingStatus("rejected");
          toast({
            title: "Pemesanan Ditolak",
            description: "Maaf, admin menolak pemesanan Anda.",
            variant: "destructive",
          });
        }
      }
    };

    const unsubscribe = subscribeToBookings(checkStatus);
    // Also check on interval for cross-tab sync
    const interval = setInterval(checkStatus, 1000);
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [currentBookingId, bookingStatus, toast]);

  if (!talent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Pendamping tidak ditemukan</h2>
          <Link to="/talents">
            <Button>Kembali ke Daftar Pendamping</Button>
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

  const handlePayment = () => {
    setBookingStatus("pending_payment");
    setIsProcessing(true);
    
    // Simulasi pembayaran (2 detik) dan simpan ke shared store
    setTimeout(() => {
      // Get current logged-in user identity
      const currentUser = getCurrentUser();
      
      // Create booking in shared store with REAL user identity
      const newBooking = addBooking({
        userName: currentUser.name,
        userPhoto: currentUser.photo,
        talentId: talent.id,
        talentName: talent.name,
        talentPhoto: talent.photo,
        purpose: bookingData.purpose,
        type: bookingData.type,
        date: bookingData.date,
        time: bookingData.time,
        duration: bookingData.duration,
        total: totalPrice,
        notes: bookingData.notes,
        paymentStatus: "paid",
        approvalStatus: "pending_approval",
      });
      
      setCurrentBookingId(newBooking.id);
      setIsProcessing(false);
      setBookingStatus("pending_approval");
      toast({
        title: "Pembayaran Berhasil!",
        description: "Menunggu persetujuan admin untuk mengaktifkan percakapan",
      });
    }, 2000);
  };

  // Admin approval removed - handled only in Admin dashboard

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

  const getStatusBadge = () => {
    switch (bookingStatus) {
      case "pending_payment":
        return <Badge variant="warning">Menunggu Pembayaran</Badge>;
      case "pending_approval":
        return <Badge variant="accent">Menunggu Persetujuan Admin</Badge>;
      case "approved":
        return <Badge variant="success">Disetujui</Badge>;
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return null;
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Pesan Pendamping</h1>
            <p className="text-muted-foreground">Lengkapi detail pemesanan kamu</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Progress Steps - 5 Steps */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
          {[
            { num: 1, label: "Detail" },
            { num: 2, label: "Jadwal" },
            { num: 3, label: "Bayar" },
            { num: 4, label: "Approval" },
            { num: 5, label: "Chat" },
          ].map((s, i) => {
            // Determine step completion status
            const isCompleted = 
              step > s.num || 
              (s.num === 3 && bookingStatus !== "draft") ||
              (s.num === 4 && bookingStatus === "approved") ||
              (s.num === 5 && bookingStatus === "approved");
            
            const isActive = 
              step === s.num || 
              (s.num === 4 && bookingStatus === "pending_approval") ||
              (s.num === 5 && bookingStatus === "approved");
            
            const isPending = s.num === 4 && bookingStatus === "pending_approval";
            const isApproved = bookingStatus === "approved";
            
            return (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all text-sm",
                      isCompleted || isActive
                        ? "bg-primary text-primary-foreground shadow-orange"
                        : "bg-muted text-muted-foreground",
                      s.num === 4 && isApproved && "bg-green-500",
                      s.num === 5 && isApproved && "bg-green-500"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                    ) : isPending ? (
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    ) : s.num === 5 ? (
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      s.num
                    )}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground whitespace-nowrap">{s.label}</span>
                </div>
                {i < 4 && (
                  <div
                    className={cn(
                      "w-8 md:w-16 h-1 mx-1 md:mx-2 rounded-full transition-all",
                      (step > s.num || (s.num === 3 && bookingStatus !== "draft") || (s.num === 4 && isApproved))
                        ? "bg-primary" 
                        : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="md:col-span-2">
            <Card className="p-6">
              {step === 1 && bookingStatus === "draft" && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Detail Pemesanan</h2>

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
                      Tujuan Pemesanan
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

              {step === 2 && bookingStatus === "draft" && (
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

              {step === 3 && bookingStatus === "draft" && (
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

              {/* Pending Payment State */}
              {bookingStatus === "pending_payment" && (
                <div className="py-12 text-center animate-fade-in">
                  <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-4" />
                  <h2 className="text-xl font-bold mb-2">Memproses Pembayaran...</h2>
                  <p className="text-muted-foreground">Mohon tunggu sebentar</p>
                </div>
              )}

              {/* Pending Approval State */}
              {bookingStatus === "pending_approval" && (
                <div className="py-8 text-center animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Menunggu Persetujuan Admin</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Pembayaran berhasil! Pemesanan kamu sedang ditinjau oleh admin. 
                    Percakapan akan aktif setelah disetujui.
                  </p>
                  
                  <Card className="p-4 bg-muted/50 max-w-sm mx-auto mb-6">
                    <div className="flex items-center gap-3 text-left">
                      <img
                        src={talent.photo}
                        alt={talent.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{talent.name}</p>
                        <p className="text-sm text-muted-foreground">{bookingData.purpose}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Info status - read only */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menunggu admin menyetujui pemesanan...</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Kamu akan menerima notifikasi setelah pemesanan disetujui
                    </p>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/bookings')}
                      className="flex-1"
                    >
                      Lihat Pemesanan Saya
                    </Button>
                  </div>
                </div>
              )}

              {/* Approved State - Step 5: Chat Active */}
              {bookingStatus === "approved" && (
                <div className="py-8 text-center animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Pemesanan Disetujui!</h2>
                  <p className="text-muted-foreground mb-6">
                    Percakapan dengan {talent.name} sudah aktif
                  </p>
                  
                  {/* Chat Button - Active */}
                  <Link to={`/chat/${talent.id}`}>
                    <Button variant="hero" size="lg" className="gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Buka Percakapan
                    </Button>
                  </Link>
                  
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      ✅ Langkah 5: Percakapan Aktif - Kamu bisa mulai ngobrol sekarang!
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {bookingStatus === "draft" && (
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
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        "Bayar Sekarang"
                      )}
                    </Button>
                  )}
                </div>
              )}
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

              {/* Alur Pemesanan Info */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs font-medium mb-2">Alur Pemesanan:</p>
                <ol className="text-xs text-muted-foreground space-y-1">
                  <li className={cn(step >= 1 && "text-primary font-medium")}>1. Pilih detail</li>
                  <li className={cn(step >= 2 && "text-primary font-medium")}>2. Atur jadwal</li>
                  <li className={cn(step >= 3 && "text-primary font-medium")}>3. Bayar</li>
                  <li className={cn(
                    bookingStatus === "pending_approval" && "text-primary font-medium",
                    bookingStatus === "approved" && "text-green-500 font-medium"
                  )}>
                    4. Tunggu approval admin {bookingStatus === "approved" && "✓"}
                  </li>
                  <li className={cn(
                    bookingStatus === "approved" && "text-green-500 font-medium"
                  )}>
                    5. Percakapan aktif {bookingStatus === "approved" && "✓"}
                  </li>
                </ol>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
