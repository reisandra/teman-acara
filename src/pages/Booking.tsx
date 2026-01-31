import { useState, useEffect, useMemo } from "react";
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
  QrCode,
  Building2,
  Upload,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { talents, bookingPurposes } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  addBooking, 
  getBookingById, 
  getBookings, 
  subscribeToBookings, 
  updateBookingPayment, 
  SharedBooking, 
  updateBookingRating,
  getCurrentUserOrMitra // 🔥 PERBAIKAN: Typo 'Mita' menjadi 'Mitra'
} from "@/lib/bookingStore";
import { getCurrentUser } from "@/lib/userStore";
import { createBooking } from "@/lib/bookings";
// Fungsi isTimeSlotBooked tidak lagi digunakan di sini karena sudah digantikan dengan logika client-side
import { getAllVerifiedTalents } from "@/lib/mitraStore";

type BookingStatus = "draft" | "pending_payment" | "pending_approval" | "approved" | "completed" | "rejected";

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getRandomizedAmount = (amount: number): number => {
  const amountStr = amount.toString();
  if (amount < 1000) return amount;
  const prefix = amountStr.slice(0, -3);
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return parseInt(prefix + randomSuffix);
};

const maskBankAccount = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.length < 3) return accountNumber;
  return accountNumber;
};

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State untuk menyimpan data booking saat ini
  const [currentBooking, setCurrentBooking] = useState<SharedBooking | null>(null);
  
  // State untuk loading talent
  const [isLoadingTalent, setIsLoadingTalent] = useState(true);
  const [allTalents, setAllTalents] = useState<any[]>([]);
  
  // Pindahkan deklarasi bookingStatus ke atas
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("draft");
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  
  // State untuk data talent yang akan ditampilkan
  const [displayTalent, setDisplayTalent] = useState<any>(null);
  
  // State untuk menangani apakah data sedang dimuat
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // State untuk tujuan kustom
  const [customPurpose, setCustomPurpose] = useState("");

  // 🔥 PERBAIKAN PERFORMA: State untuk menyimpan booking yang sudah disetujui di tanggal tertentu
  const [approvedBookingsForDate, setApprovedBookingsForDate] = useState<SharedBooking[]>([]);
  const [isLoadingBookedSlots, setIsLoadingBookedSlots] = useState(false);

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState({
    duration: 2,
    purpose: "",
    type: "offline" as "online" | "offline",
    date: "",
    time: "",
    notes: "",
  });
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bca" | "bri" | "mandiri" | null>(null);
  const [paymentCode, setPaymentCode] = useState<string>("");
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProof, setPaymentProof] = useState<string>("");
  const [paymentNote, setPaymentNote] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [transferTime, setTransferTime] = useState<string>("");
  
  // State for admin-configured payment settings
  const [qrisCode, setQrisCode] = useState<string>("");
  const [bankAccounts, setBankAccounts] = useState({
    bca: { number: "1234567890", holder: "PT RentMate Indonesia" },
    bri: { number: "9876543210", holder: "PT RentMate Indonesia" },
    mandiri: { number: "5555666677", holder: "PT RentMate Indonesia" },
  });

  // Load payment settings from localStorage
  useEffect(() => {
    const savedQris = localStorage.getItem("rentmate_admin_qris_code");
    if (savedQris) {
      setQrisCode(savedQris);
    }

    const savedBanks = localStorage.getItem("rentmate_bank_accounts");
    if (savedBanks) {
      try {
        setBankAccounts(JSON.parse(savedBanks));
      } catch (error) {
        console.error("Failed to parse bank accounts from localStorage:", error);
      }
    }
  }, []);

  const staticQrisUrl = import.meta.env.VITE_STATIC_QRIS_URL

  // Fungsi untuk membuat kunci localStorage yang unik
  const getPaymentCodeStorageKey = (userId: string, talentId: string, date: string, time: string) => {
    return `rentmate_payment_code_${userId}_${talentId}_${date}_${time}`;
  };

  // Fungsi untuk mendapatkan atau membuat payment code yang stabil
  const getOrCreateStablePaymentCode = () => {
    const currentUser = getCurrentUserOrMitra();
    if (!currentUser || !id || !bookingData.date || !bookingData.time) {
      return "";
    }

    const storageKey = getPaymentCodeStorageKey(currentUser.data.id, id, bookingData.date, bookingData.time);
    let code = localStorage.getItem(storageKey);
    if (!code) {
      const year = new Date().getFullYear();
      const random = Math.random().toString(36).substr(2, 5).toUpperCase();
      code = `PAY-${year}-${random}`;
      localStorage.setItem(storageKey, code);
    }
    
    return code;
  };

  // 🔥 PERFORMA: Gunakan useMemo agar daftar jam tidak dihitung ulang setiap render
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  }, []); // Kosong karena tidak bergantung pada props/state

  // 🔥 PERFORMA: Fungsi helper untuk mengecek overlap, dijalankan di client-side
  const isTimeSlotBookedClientSide = (time: string) => {
    if (!approvedBookingsForDate.length || !bookingData.date) return false;

    const newStartTime = new Date(`${bookingData.date}T${time}`);
    const newEndTime = new Date(newStartTime.getTime() + bookingData.duration * 60 * 60 * 1000);
    
    return approvedBookingsForDate.some(booking => {
      const bookingStartTime = new Date(`${booking.date}T${booking.time}`);
      const bookingEndTime = new Date(bookingStartTime.getTime() + booking.duration * 60 * 60 * 1000);
      
      return (
        (newStartTime >= bookingStartTime && newStartTime < bookingEndTime) ||
        (newEndTime > bookingStartTime && newEndTime <= bookingEndTime) ||
        (newStartTime <= bookingStartTime && newEndTime >= bookingEndTime)
      );
    });
  };

  // 🔥 PERBAIKAN PERFORMA: useEffect untuk mengambil booking yang disetujui di satu tanggal
  useEffect(() => {
    const fetchApprovedBookings = async () => {
      if (!id || !bookingData.date) {
        setApprovedBookingsForDate([]);
        return;
      }

      setIsLoadingBookedSlots(true);
      try {
        const allBookings = await getBookings();
        const filtered = allBookings.filter(b => 
          b.talentId === id && 
          b.date === bookingData.date && 
          b.approvalStatus === 'approved'
        );
        setApprovedBookingsForDate(filtered);
      } catch (error) {
        console.error("Error fetching approved bookings:", error);
        setApprovedBookingsForDate([]);
      } finally {
        setIsLoadingBookedSlots(false);
      }
    };

    fetchApprovedBookings();
  }, [id, bookingData.date]); // Hanya bergantung pada id dan tanggal

  // Load semua talent saat komponen dimuat
  useEffect(() => {
    const loadTalents = async () => {
      try {
        const talents = await getAllVerifiedTalents();
        setAllTalents(talents);
        const foundTalent = talents.find((t) => t.id === id);
        setDisplayTalent(foundTalent);
      } catch (error) {
        console.error("Error loading talents:", error);
        const foundTalent = talents.find((t) => t.id === id);
        setDisplayTalent(foundTalent);
      } finally {
        setIsLoadingTalent(false);
        setIsInitialLoading(false);
      }
    };
    
    if (id) {
      loadTalents();
    } else {
      setIsInitialLoading(false);
    }
  }, [id]);

  // 🔥 PERBAIKAN: useEffect untuk memeriksa booking yang ada
  useEffect(() => {
    const fetchAndProcessBookings = async () => {
      if (!id) return;

      const currentUser = getCurrentUserOrMitra();
      if (!currentUser) {
        navigate("/login");
        return;
      }
      
      // 🔥 PERBAIKAN: Tambahkan await saat memanggil getBookings()
      const allBookings = await getBookings(); 
      const now = new Date();

      const existingBooking = allBookings.find((b) => {
        if (b.bookerId !== currentUser.data.id || b.talentId !== id || b.approvalStatus === "rejected") {
          return false;
        }
        
        const startTime = new Date(`${b.date}T${b.time}`);
        const endTime = new Date(startTime.getTime() + b.duration * 60 * 60 * 1000);
        
        return endTime > now;
      });

      if (!existingBooking) {
        setCurrentBookingId(null);
        setBookingStatus("draft");
        setStep(1);
        
        const potentialCode = getOrCreateStablePaymentCode();
        if (potentialCode) {
          setPaymentCode(potentialCode);
        } else {
          setPaymentCode("");
        }
        return;
      }

      setCurrentBooking(existingBooking);
      setCurrentBookingId(existingBooking.id);
      setBookingData({
        duration: existingBooking.duration,
        purpose: existingBooking.purpose,
        type: existingBooking.type,
        date: existingBooking.date,
        time: existingBooking.time,
        notes: existingBooking.notes || "",
      });

      if (existingBooking.paymentCode) {
        setPaymentCode(existingBooking.paymentCode);
      } else {
        const fallbackCode = getOrCreateStablePaymentCode();
        setPaymentCode(fallbackCode);
      }

      if (existingBooking.paymentStatus === "pending" && !existingBooking.paymentProof) {
        setBookingStatus("pending_payment");
        setStep(3);
        return;
      }

      if (existingBooking.approvalStatus === "pending_approval") {
        setBookingStatus("pending_approval");
        setStep(4);
        return;
      }

      if (existingBooking.approvalStatus === "approved") {
        setBookingStatus("approved");
        setStep(5);
        return;
      }
      
      if (existingBooking.date && existingBooking.time && existingBooking.duration) {
        const startTime = new Date(`${existingBooking.date}T${existingBooking.time}`);
        const endTime = new Date(startTime.getTime() + existingBooking.duration * 60 * 60 * 1000);
        
        if (endTime < now && existingBooking.approvalStatus === "approved") {
          setBookingStatus("completed");
          setStep(5);
          return;
        }
      }
    };

    fetchAndProcessBookings();
  }, [id, navigate]);

  useEffect(() => {
    const currentUser = getCurrentUserOrMitra();
    if (!currentUser || !id || !bookingData.date || !bookingData.time) return;

    const storageKey = getPaymentCodeStorageKey(currentUser.data.id, id, bookingData.date, bookingData.time);

    if (bookingStatus === 'completed' || bookingStatus === 'rejected' || (bookingStatus === 'draft' && currentBookingId)) {
      localStorage.removeItem(storageKey);
    }
  }, [bookingStatus, currentBookingId, id, bookingData.date, bookingData.time]);

  useEffect(() => {
    if (!currentBookingId) return;

    const checkStatus = async () => { // Buat async
      const booking = await getBookingById(currentBookingId); // Tambahkan await
      if (!booking) return;

      setCurrentBooking(booking);

      if (booking.paymentCode && booking.paymentCode !== paymentCode) {
        setPaymentCode(booking.paymentCode);
      }

      if (booking.approvalStatus === "approved" && bookingStatus !== "approved") {
        setBookingStatus("approved");
        setStep(5);
        toast({
          title: "Pemesanan Disetujui!",
          description: "Admin menyetujui pemesanan. Anda sekarang dapat mengobrol dengan talent.",
        });
      }

      if (booking.approvalStatus === "rejected" && bookingStatus !== "rejected") {
        setBookingStatus("rejected");
        setStep(4);
        toast({
          title: "Pemesanan Ditolak",
          description: "Admin menolak pemesanan Anda.",
          variant: "destructive",
        });
      }
    };

    const unsubscribe = subscribeToBookings(checkStatus);
    checkStatus();

    return () => {
      unsubscribe();
    };
  }, [currentBookingId, bookingStatus, paymentCode, toast]);

  const [qrisAmount, setQrisAmount] = useState<number>(0);

  useEffect(() => {
    if (displayTalent && displayTalent.pricePerHour) {
      const totalPrice = displayTalent.pricePerHour * bookingData.duration;
      setQrisAmount(getRandomizedAmount(totalPrice));
    }
  }, [displayTalent, bookingData.duration]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-warm pt-16 md:pt-24 pb-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!id) {
    navigate("/talents");
    return null;
  }

  const talentForDisplay = displayTalent || (currentBooking ? {
    id: currentBooking.talentId,
    name: currentBooking.talentName,
    photo: currentBooking.talentPhoto,
    pricePerHour: currentBooking.total / currentBooking.duration,
    city: "Unknown",
    skills: [],
    rating: "0"
  } : null);

  if (!talentForDisplay) {
    navigate("/talents");
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = talentForDisplay ? talentForDisplay.pricePerHour * bookingData.duration : 0;
  const displayAmount = talentForDisplay ? getRandomizedAmount(totalPrice) : 0;

  const handleNext = () => {
    if (bookingStatus !== "draft") return;
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (bookingStatus !== "draft") return;
    if (step <= 1) return;
    setStep(step - 1);
  };

  const handlePayment = async () => {
    const currentUser = getCurrentUserOrMitra();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Anda harus login untuk melakukan pemesanan",
        variant: "destructive",
      });
      return;
    }

    const newPaymentCode = getOrCreateStablePaymentCode();

    const bookerData = currentUser.type === "mitra" 
      ? {
          userName: currentUser.data.name,
          userPhoto: currentUser.data.photo,
          bookerType: "mitra",
          bookerId: currentUser.data.talentId,
        }
      : {
          userName: currentUser.data.name,
          userPhoto: currentUser.data.photo,
          bookerType: "user",
          bookerId: currentUser.data.id,
        };

    const booking = await addBooking({ 
      ...bookerData,
      talentId: talentForDisplay.id,
      talentName: talentForDisplay.name,
      talentPhoto: talentForDisplay.photo,
      purpose: bookingData.purpose,
      type: bookingData.type,
      date: bookingData.date,
      time: bookingData.time,
      duration: bookingData.duration,
      total: totalPrice,
      notes: bookingData.notes,
      paymentStatus: "pending",
      approvalStatus: "pending_approval",
      paymentCode: newPaymentCode,
    });

    setCurrentBookingId(booking.id);
    setPaymentCode(newPaymentCode);
    setBookingStatus("pending_payment");
    setStep(3);
  };

  const handleConfirmPayment = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (!paymentMethod) {
        toast({
          title: "Pilih metode pembayaran",
          variant: "destructive",
        });
        return;
      }

      if (
        (paymentMethod === "bca" ||
          paymentMethod === "bri" ||
          paymentMethod === "mandiri") &&
        !paymentProof
      ) {
        toast({
          title: "Bukti transfer wajib diupload",
          variant: "destructive",
        });
        return;
      }

      const currentUser = getCurrentUserOrMitra();
      const autoTransferAmount = totalPrice;
      const autoTransferTime = new Date().toISOString();

      let booking: SharedBooking;

      // KODE YANG SUDAH DIPERBAIKI
if (currentBookingId) {
  // Jika booking sudah ada, update pembayarannya
  const updated = await updateBookingPayment(currentBookingId, {
    paymentMethod,
    paymentCode,
    paymentProof,
    transferAmount: autoTransferAmount,
    transferTime: autoTransferTime,
  });

  if (!updated) {
    throw new Error("Booking tidak ditemukan");
  }

  booking = updated;
} else {
  // Jika ini booking baru, gunakan SATU fungsi addBooking yang sudah benar
  booking = await addBooking({
    userName: currentUser.data.name,
    userPhoto: currentUser.data.photo,
    bookerType: currentUser.type === "mitra" ? "mitra" : "user",
    bookerId: currentUser.data.id,
    talentId: talentForDisplay.id,
    talentName: talentForDisplay.name,
    talentPhoto: talentForDisplay.photo,
    purpose: bookingData.purpose,
    type: bookingData.type,
    date: bookingData.date,
    time: bookingData.time,
    duration: bookingData.duration,
    total: totalPrice,
    notes: bookingData.notes,
    paymentStatus: "paid",
    approvalStatus: "pending_approval",
    paymentMethod,
    paymentCode,
    paymentProof,
    transferAmount: autoTransferAmount,
    transferTime: autoTransferTime,
  });
}

      setCurrentBookingId(booking.id);
      setBookingStatus("pending_approval");
      setStep(4);

      toast({
        title: "Pembayaran berhasil",
        description: "Menunggu persetujuan admin",
      });
    } catch (error) {
      console.error("CONFIRM PAYMENT ERROR:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal mengirim bukti pembayaran",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentProofUpload = async (file: File) => {
    setPaymentProofFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentProof(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        if (bookingData.purpose.startsWith("Lainnya:")) {
          return bookingData.duration > 0 && customPurpose.trim().length > 0;
        } else {
          return bookingData.duration > 0 && bookingData.purpose.trim().length > 0;
        }
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
      case "completed":
        return <Badge variant="default">Selesai</Badge>;
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
            <h1 className="text-2xl font-bold">Pesan Teman</h1>
            <p className="text-muted-foreground">Lengkapi detail pemesanan kamu</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
          {[
            { num: 1, label: "Detail" },
            { num: 2, label: "Jadwal" },
            { num: 3, label: "Bayar" },
            { num: 4, label: "Approval" },
            { num: 5, label: "Chat" },
          ].map((s, i) => {
            const stepCompleted = 
              step > s.num || 
              (s.num <= 3 && bookingStatus !== "draft") ||
              (s.num === 4 && (bookingStatus === "pending_approval" || bookingStatus === "approved" || bookingStatus === "rejected")) ||
              (s.num === 5 && bookingStatus === "approved");
            
            const stepActive = 
              step === s.num || 
              (s.num === 4 && (bookingStatus === "pending_approval" || bookingStatus === "rejected")) ||
              (s.num === 5 && bookingStatus === "approved");
            
            const isPending = s.num === 4 && bookingStatus === "pending_approval";
            const isRejected = s.num === 4 && bookingStatus === "rejected";
            const isApproved = bookingStatus === "approved";
            
            return (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all text-sm",
                      stepCompleted || stepActive
                        ? "bg-primary text-primary-foreground shadow-orange"
                        : "bg-muted text-muted-foreground",
                      s.num === 4 && isApproved && "bg-green-500",
                      s.num === 5 && isApproved && "bg-green-500",
                      isRejected && "bg-red-500"
                    )}
                  >
                    {stepCompleted ? (
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
                      (step > s.num || 
                       (s.num <= 3 && bookingStatus !== "draft") || 
                       (s.num === 4 && (bookingStatus === "pending_approval" || bookingStatus === "approved" || bookingStatus === "rejected")) ||
                       (s.num === 5 && bookingStatus === "approved"))
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
                  <div>
                    <label className="text-sm font-medium mb-3 block">Durasi (jam)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6].map((h) => (
                        <Button
                          key={h}
                          variant={bookingData.duration === h ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBookingData({ ...bookingData, duration: h })}
                        >
                          {h} jam
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">Tujuan Pemesanan</label>
                    <div className="grid grid-cols-2 gap-2">
                      {bookingPurposes.map((purpose) => (
                        <Button
                          key={purpose}
                          variant={
                            (bookingData.purpose === purpose && purpose !== "Lainnya") || 
                            (purpose === "Lainnya" && bookingData.purpose.startsWith("Lainnya:")) 
                              ? "default" : "outline"
                          }
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            if (purpose === "Lainnya") {
                              setBookingData({ ...bookingData, purpose: "Lainnya:" });
                            } else {
                              setBookingData({ ...bookingData, purpose });
                              setCustomPurpose("");
                            }
                          }}
                        >
                          {purpose}
                        </Button>
                      ))}
                    </div>
                    {bookingData.purpose.startsWith("Lainnya:") && (
                      <div className="mt-3">
                        <Input
                          placeholder="Tuliskan tujuan pemesanan Anda..."
                          value={customPurpose}
                          onChange={(e) => {
                            setCustomPurpose(e.target.value);
                            setBookingData({ 
                              ...bookingData, 
                              purpose: `Lainnya: ${e.target.value}` 
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">Tipe Pertemuan</label>
                    <div className="grid grid-cols-2 gap-4">
                      <Card
                        hover
                        className={cn(
                          "p-4 text-center cursor-pointer",
                          bookingData.type === "offline" && "border-primary ring-2 ring-primary/20"
                        )}
                        onClick={() => setBookingData({ ...bookingData, type: "offline" })}
                      >
                        <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-semibold">Offline</h4>
                        <p className="text-xs text-muted-foreground">Bertemu langsung</p>
                      </Card>
                      <Card
                        hover
                        className={cn(
                          "p-4 text-center cursor-pointer",
                          bookingData.type === "online" && "border-primary ring-2 ring-primary/20"
                        )}
                        onClick={() => setBookingData({ ...bookingData, type: "online" })}
                      >
                        <Video className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-semibold">Online</h4>
                        <p className="text-xs text-muted-foreground">Video call</p>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && bookingStatus === "draft" && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Jadwal & Waktu</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tanggal</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="date"
                          className="pl-11"
                          value={bookingData.date}
                          onChange={(e) => {
                            setBookingData({
                              ...bookingData,
                              date: e.target.value,
                              time: "",
                            });
                          }}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Waktu Mulai</label>
                      {!bookingData.date ? (
                        <div className="h-10 rounded-xl border-2 border-dashed flex items-center justify-center text-xs text-muted-foreground">
                          Pilih tanggal terlebih dahulu
                        </div>
                      ) : isLoadingBookedSlots ? (
                        <div className="h-48 rounded-xl border-2 border-dashed flex items-center justify-center text-xs text-muted-foreground">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memeriksa ketersediaan jam...
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border rounded-xl">
                          {timeSlots.map((time) => {
                            const isBooked = isTimeSlotBookedClientSide(time);
                            const [hour] = time.split(":").map(Number);
                            const isOutsideWorkingHours = hour < 8 || hour >= 22;
                            return (
                              <Button
                                key={time}
                                variant={bookingData.time === time ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                  "text-xs",
                                  (isBooked || isOutsideWorkingHours) &&
                                    "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                                )}
                                disabled={isBooked || isOutsideWorkingHours}
                                onClick={() => setBookingData({ ...bookingData, time })}
                              >
                                {time}
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Jam yang dinonaktifkan sudah dipesan atau di luar jam operasional (08.00–22.00).
                  </p>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Catatan Tambahan (opsional)</label>
                    <textarea
                      className="w-full h-24 rounded-xl border-2 border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                      placeholder="Tuliskan catatan atau permintaan khusus..."
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {step === 3 && bookingStatus === "draft" && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Konfirmasi & Pembayaran</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b"><span className="text-muted-foreground">Durasi</span><span className="font-medium">{bookingData.duration} jam</span></div>
                    <div className="flex justify-between py-3 border-b"><span className="text-muted-foreground">Tujuan</span><span className="font-medium">{bookingData.purpose.startsWith("Lainnya:") ? customPurpose || bookingData.purpose : bookingData.purpose}</span></div>
                    <div className="flex justify-between py-3 border-b"><span className="text-muted-foreground">Tipe</span><Badge variant={bookingData.type === "online" ? "accent" : "secondary"}>{bookingData.type === "online" ? "Online" : "Offline"}</Badge></div>
                    <div className="flex justify-between py-3 border-b"><span className="text-muted-foreground">Tanggal & Waktu</span><span className="font-medium">{bookingData.date && new Date(bookingData.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", })} - {bookingData.time}</span></div>
                    <div className="flex justify-between py-3 border-b"><span className="text-muted-foreground">Harga per jam</span><span className="font-medium">{formatPrice(talentForDisplay.pricePerHour)}</span></div>
                    <div className="flex justify-between py-3 text-lg font-bold"><span>Total</span><span className="text-primary">{formatPrice(totalPrice)}</span></div>
                  </div>
                  <Card className="p-4 bg-accent/50 flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <div><p className="font-medium">Metode Pembayaran</p><p className="text-sm text-muted-foreground">Transfer Bank / E-Wallet</p></div>
                  </Card>
                </div>
              )}

              {bookingStatus === "pending_payment" && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Metode Pembayaran</h2>
                  <Card className="p-4 bg-muted/50">
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Total Pembayaran</span><span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span></div>
                    {paymentCode && (<div className="mt-3 pt-3 border-t"><div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Kode Konfirmasi</span><span className="text-sm font-mono font-semibold">{paymentCode}</span></div></div>)}
                  </Card>
                  <div>
                    <label className="text-sm font-medium mb-3 block">Pilih Metode Pembayaran</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["qris", "bca", "bri", "mandiri"].map((method) => (
                        <Card
                          key={method}
                          hover
                          className={cn("p-4 text-center cursor-pointer border-2 transition-all", paymentMethod === method ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-input hover:border-primary/50")}
                          onClick={() => setPaymentMethod(method as any)}
                        >
                          {method === "qris" ? <QrCode className="w-8 h-8 mx-auto mb-2 text-primary" /> : <Building2 className="w-8 h-8 mx-auto mb-2 text-primary" />}
                          <h4 className="font-semibold text-sm">{method.toUpperCase()}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{method === "qris" ? "Scan QR Code" : "Transfer Bank"}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                  {paymentMethod === "qris" && (
                    <Card className="p-6 bg-accent/50">
                      <h3 className="font-semibold mb-4 text-center">Scan QR Code untuk Pembayaran</h3>
                      {qrisCode ? (<div className="flex justify-center mb-4"><img src={qrisCode} alt="QRIS Payment" className="w-90 h-90 md:w-100 md:h-100 rounded-lg border max-w-sm md:max-w-md" /></div>) : (<div className="text-center text-sm text-red-500">QRIS Code belum diset oleh admin.</div>)}
                      <div className="bg-background rounded-lg p-4 mb-4 border"><div className="flex justify-between items-center"><span className="text-sm font-medium">Total Pembayaran</span><span className="text-xl font-bold text-primary">{formatPrice(qrisAmount)}</span></div></div>
                      <div className="text-center space-y-2"><p className="text-sm font-medium">Kode Konfirmasi Pembayaran</p><p className="text-lg font-mono font-bold text-primary">{paymentCode}</p><p className="text-xs text-muted-foreground">Gunakan kode ini untuk pembayaran.</p></div>
                    </Card>
                  )}
                  {(paymentMethod === "bca" || paymentMethod === "bri" || paymentMethod === "mandiri") && (
                    <Card className="p-6 bg-accent/50">
                      <h3 className="font-semibold mb-4 text-center">Informasi Rekening</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b"><span className="text-muted-foreground">Nama Bank</span><span className="font-semibold">{`Bank ${paymentMethod.toUpperCase()}`}</span></div>
                        <div className="flex justify-between items-center py-2 border-b"><span className="text-muted-foreground">Nomor Rekening</span><span className="font-mono font-semibold">{maskBankAccount(bankAccounts[paymentMethod as keyof typeof bankAccounts].number)}</span></div>
                        <div className="flex justify-between items-center py-2 border-b"><span className="text-muted-foreground">Nama Penerima</span><span className="font-semibold">{bankAccounts[paymentMethod as keyof typeof bankAccounts].holder}</span></div>
                        <div className="pt-4 border-t"><p className="text-sm font-medium mb-2">Nominal Transfer</p><p className="text-lg font-bold text-primary text-center">{formatPrice(displayAmount)}</p><p className="text-xs text-muted-foreground text-center mt-1">Nominal ini akan tercatat otomatis saat Anda konfirmasi pembayaran</p></div>
                        <div className="pt-4 border-t"><p className="text-sm font-medium mb-2">Kode Konfirmasi Pembayaran</p><p className="text-lg font-mono font-bold text-primary text-center">{paymentCode}</p><p className="text-xs text-muted-foreground text-center mt-2">Cantumkan kode ini saat transfer.</p></div>
                      </div>
                    </Card>
                  )}
                  {paymentMethod && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Upload Bukti Pembayaran <span className="text-red-500">*</span></label>
                        <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
                          <input type="file" id="payment-proof" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; setPaymentProofFile(file); const reader = new FileReader(); reader.onloadend = () => { setPaymentProof(reader.result as string); }; reader.readAsDataURL(file); }} />
                          <label htmlFor="payment-proof" className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{paymentProofFile ? paymentProofFile.name : "Klik untuk upload gambar"}</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Pesan untuk Admin (Opsional)</label>
                        <textarea className="w-full h-24 rounded-xl border-2 border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary resize-none" placeholder="Tuliskan catatan tambahan untuk admin..." value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} />
                      </div>
                    </div>
                  )}
                  {paymentMethod && (
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => { setBookingStatus("draft"); setPaymentMethod(null); setTransferAmount(0); setTransferTime(""); setPaymentProof(""); }} className="flex-1">Batal</Button>
                      <Button variant="hero" onClick={handleConfirmPayment} disabled={isProcessing || !paymentProof} className="flex-1">
                        {isProcessing ? (<> <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses... </>) : ("Saya Sudah Transfer")}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {(bookingStatus === "pending_approval" || bookingStatus === "rejected") && (
                <div className="py-8 text-center animate-fade-in">
                  <div className={cn("w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4", bookingStatus === "rejected" ? "bg-red-100 dark:bg-red-900/30" : "bg-accent")}>
                    {bookingStatus === "rejected" ? (<ShieldCheck className="w-10 h-10 text-red-500" />) : (<ShieldCheck className="w-10 h-10 text-primary" />)}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{bookingStatus === "rejected" ? "Pemesanan Ditolak" : "Menunggu Persetujuan Admin"}</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">{bookingStatus === "rejected" ? "Maaf, admin menolak pemesanan Anda. Silakan hubungi admin untuk informasi lebih lanjut." : "⏳ Menunggu verifikasi pembayaran oleh admin"}</p>
                  <Card className="p-4 bg-muted/50 max-w-sm mx-auto mb-6">
                    <div className="flex items-center gap-3 text-left">
                      <img src={talentForDisplay.photo} alt={talentForDisplay.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold">{talentForDisplay.name}</p>
                        <p className="text-sm text-muted-foreground">{bookingData.purpose.startsWith("Lainnya:") ? customPurpose || bookingData.purpose : bookingData.purpose}</p>
                      </div>
                    </div>
                  </Card>
                  {bookingStatus === "pending_approval" && (<div className="border-t pt-6"><div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-4"><Loader2 className="w-4 h-4 animate-spin" /><span>Menunggu admin menyetujui pemesanan...</span></div><p className="text-xs text-center text-muted-foreground mt-3">Kamu akan menerima notifikasi setelah pemesanan disetujui</p></div>)}
                  {bookingStatus === "rejected" && (<div className="border-t pt-6"><div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4"><p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Informasi Refund</p><p className="text-xs text-red-600 dark:text-red-400">Jika pembayaran sudah dilakukan, dana akan dikembalikan dalam 1-3 hari kerja. Silakan hubungi admin untuk informasi lebih lanjut.</p></div></div>)}
                  <div className="flex gap-3 mt-6"><Button variant="outline" onClick={() => navigate('/bookings')} className="flex-1">Lihat Pemesanan Saya</Button></div>
                </div>
              )}

              {bookingStatus === "approved" && currentBookingId && step === 5 && (
                <div className="py-8 text-center animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Pemesanan Disetujui!</h2>
                  <p className="text-muted-foreground mb-6">Percakapan dengan {talentForDisplay.name} sudah aktif</p>
                  <Link to={`/chat/${currentBookingId}`}>
                    <Button variant="hero" size="lg" className="gap-2"><MessageCircle className="w-5 h-5" /> Buka Percakapan</Button>
                  </Link>
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"><p className="text-sm text-green-700 dark:text-green-300">✅ Langkah 5: Percakapan Aktif - Kamu bisa mulai ngobrol sekarang!</p></div>
                </div>
              )}

              {bookingStatus === "draft" && (
                <div className="flex gap-3 mt-8">
                  {step > 1 && (<Button variant="outline" onClick={handleBack} className="flex-1">Kembali</Button>)}
                  {step < 3 ? (<Button variant="hero" onClick={handleNext} disabled={!isStepValid()} className="flex-1">Lanjutkan</Button>) : (<Button variant="hero" onClick={handlePayment} disabled={isProcessing} className="flex-1">{isProcessing ? (<> <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses... </>) : ("Bayar Sekarang")}</Button>)}
                </div>
              )}
            </Card>
          </div>

          {/* Talent Summary */}
          <div className="hidden md:block">
            <Card className="p-5 sticky top-24">
              <div className="flex gap-4 mb-4">
                <img src={talentForDisplay.photo} alt={talentForDisplay.name} className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold">{talentForDisplay.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="w-3 h-3" />{talentForDisplay.city}</div>
                  <div className="flex gap-1 mt-2">{talentForDisplay.skills?.slice(0, 2).map((skill: string) => (<Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>))}</div>
                </div>
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Harga per jam</span><span className="font-medium">{formatPrice(talentForDisplay.pricePerHour)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Durasi</span><span className="font-medium">{bookingData.duration} jam</span></div>
                <div className="flex justify-between font-bold pt-3 border-t"><span>Total</span><span className="text-primary">{formatPrice(totalPrice)}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs font-medium mb-2">Alur Pemesanan:</p>
                <ol className="text-xs text-muted-foreground space-y-1">
                  <li className={cn(step >= 1 && "text-primary font-medium")}>1. Pilih detail</li>
                  <li className={cn(step >= 2 && "text-primary font-medium")}>2. Atur jadwal</li>
                  <li className={cn(step >= 3 && "text-primary font-medium")}>3. Bayar</li>
                  <li className={cn(bookingStatus === "pending_approval" && "text-primary font-medium", bookingStatus === "approved" && "text-green-500 font-medium")}>4. Tunggu approval admin {bookingStatus === "approved" && "✓"}</li>
                  <li className={cn(bookingStatus === "approved" && "text-green-500 font-medium")}>5. Percakapan aktif {bookingStatus === "approved" && "✓"}</li>
                </ol>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}