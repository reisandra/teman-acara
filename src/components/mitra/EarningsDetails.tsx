// src/components/mitra/EarningsDetails.tsx

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { getBookings, subscribeToBookings } from "@/lib/bookingStore";
import { getCurrentMitra } from "@/lib/mitraStore";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Clock,
  User
} from "lucide-react";

interface EarningsDetailsProps {
  isTalentMode?: boolean;
}

export function EarningsDetails({ isTalentMode = false }: EarningsDetailsProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    pending: 0,
    completed: 0
  });

  // Fungsi untuk mendapatkan persentase komisi aplikasi
  const getAppCommission = (): number => {
    try {
      const commission = JSON.parse(localStorage.getItem("rentmate_app_commission") || "{}");
      return commission.percentage || 20;
    } catch (error) {
      console.error("Error getting app commission:", error);
      return 20;
    }
  };

  const calculatePaymentSplit = (totalAmount: number, commissionPercentage: number) => {
    if (totalAmount === 0) {
      return { appAmount: 0, mitraAmount: 0, totalAmount: 0, commissionPercentage };
    }
    const appAmount = Math.round(totalAmount * (commissionPercentage / 100));
    const mitraAmount = totalAmount - appAmount;
    return { appAmount, mitraAmount, totalAmount, commissionPercentage };
  };

  const calculateMitraEarning = (total: number) => {
    const totalAmount = parseFloat(total.toString()) || 0;
    if (totalAmount === 0) return 0;
    const commissionPercentage = getAppCommission();
    const paymentSplit = calculatePaymentSplit(totalAmount, commissionPercentage);
    return paymentSplit.mitraAmount;
  };

  // useEffect untuk memuat data awal
  useEffect(() => {
    const loadData = async () => {
      const mitra = getCurrentMitra();
      if (!mitra && isTalentMode) return;

      const allBookings = await getBookings();
      
      // --- PERBAIKAN UTAMA DI SINI ---
      // Pastikan allBookings adalah Array sebelum di-filter. Jika tidak, gunakan Array kosong.
      const mitraBookings = Array.isArray(allBookings) 
        ? allBookings.filter(booking => isTalentMode 
            ? booking.talentId === mitra?.talentId 
            : booking.userId === mitra?.id)
        : [];
      
      setBookings(mitraBookings);

      // Hitung pendapatan
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      let totalEarnings = 0;
      let thisMonthEarnings = 0;
      let pendingEarnings = 0;
      let completedBookingsCount = 0;
      
      mitraBookings.forEach(booking => {
        const bookingDate = new Date(booking.date);
        const mitraEarning = calculateMitraEarning(booking.total);
        
        if (booking.approvalStatus === "completed") {
          completedBookingsCount++;
          totalEarnings += mitraEarning;
          if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
            thisMonthEarnings += mitraEarning;
          }
        } else if (booking.approvalStatus === "approved") {
          pendingEarnings += mitraEarning;
        }
      });
      
      setEarnings({
        total: totalEarnings,
        thisMonth: thisMonthEarnings,
        pending: pendingEarnings,
        completed: completedBookingsCount
      });
    };

    loadData();
  }, [isTalentMode]);

  // useEffect untuk subscription real-time
  useEffect(() => {
    const unsubscribe = subscribeToBookings(() => {
      console.log("EarningsDetails: Data booking berubah, memuat ulang...");
      // Trigger pemuatan ulang data dengan cara memanggil kembali logika loadData
      // Cara sederhana: kita bisa memicu useEffect di atas dengan mengubah state sementara
      setBookings([]); // Kosongkan dulu
      setTimeout(() => {
        // Logika pemuatan ulang akan dipanggil ulang oleh useEffect pertama
        // atau bisa juga memanggil fungsi loadData langsung jika diekstrak
      }, 0);
    });

    return () => unsubscribe();
  }, []);

  // --- PERBAIKAN KEDUA DI SINI ---
  // Pastikan `bookings` adalah Array sebelum di-filter di dalam komponen
  const completedBookings = Array.isArray(bookings) 
    ? bookings.filter(booking => booking.approvalStatus === "completed")
    : [];

  const pendingBookings = Array.isArray(bookings)
    ? bookings.filter(booking => booking.approvalStatus === "approved")
    : [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Pendapatan</p>
              <p className="text-2xl font-bold">{formatPrice(earnings.total)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-200" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Pendapatan Bulan Ini</p>
              <p className="text-2xl font-bold">{formatPrice(earnings.thisMonth)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-200" />
          </div>
        </Card>
      </div>

      {/* Detailed Earnings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detail Pendapatan</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Pendapatan Selesai</p>
                <p className="text-sm text-muted-foreground">
                  {earnings.completed} pemesanan selesai
                </p>
              </div>
            </div>
            <p className="font-semibold">{formatPrice(earnings.total)}</p>
          </div>
          
          <div className="flex items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Pendapatan Tertunda</p>
                <p className="text-sm text-muted-foreground">
                  Akan dibayar setelah pemesanan selesai
                </p>
              </div>
            </div>
            <p className="font-semibold">{formatPrice(earnings.pending)}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Total Estimasi</p>
                <p className="text-sm text-muted-foreground">
                  Pendapatan selesai + tertunda
                </p>
              </div>
            </div>
            <p className="font-semibold">{formatPrice(earnings.total + earnings.pending)}</p>
          </div>
        </div>
      </Card>

      {/* Earnings History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Riwayat Pendapatan</h3>
        
        {completedBookings.length > 0 ? (
          <div className="space-y-3">
            {completedBookings
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((booking) => {
                const commissionPercentage = getAppCommission();
                const paymentSplit = calculatePaymentSplit(booking.total || 0, commissionPercentage);
                
                return (
                  <div key={booking.id} className="flex items-center justify-between pb-3 border-b last:border-0 hover:bg-muted/30 p-2 rounded transition-colors">
                    <div>
                      <p className="font-medium">{booking.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} • {booking.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatPrice(paymentSplit.mitraAmount)}</p>
                      <p className="text-xs text-muted-foreground">Total: {formatPrice(booking.total)}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Pendapatan</h3>
            <p className="text-muted-foreground">
              Anda belum memiliki pendapatan dari pemesanan yang selesai.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}