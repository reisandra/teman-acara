// src/lib/bookingStore.ts

import { getOrCreateChatSession } from "./chatStore";
import { getCurrentMitra } from "./mitraStore";
import { getCurrentUser } from "./userStore";
import { getAppCommission, calculatePaymentSplit } from "./paymentUtils";

export interface SharedBooking {
  id: string;

  userName: string;
  userPhoto: string;
  
  // Field untuk membedakan pemesan
  bookerType: "user" | "mitra";
  bookerId: string;

  talentId: string;
  talentName: string;
  talentPhoto: string;

  purpose: string;
  type: "online" | "offline";
  date: string;
  time: string;
  duration: number;
  total: number;
  notes?: string;

  paymentStatus: "pending" | "paid";
  // PERBAIKAN: Menambahkan status "completed"
  approvalStatus: "pending_approval" | "approved" | "rejected" | "completed";

  paymentMethod?: "qris" | "bca" | "bri" | "mandiri";
  paymentCode?: string;
  paymentProof?: string;
  transferAmount?: number;
  transferTime?: string;

  // Informasi pembagian pembayaran
  paymentSplit?: {
    appAmount: number;
    mitraAmount: number;
    totalAmount: number;
    commissionPercentage: number;
  };

  createdAt: string;

  rating?: number;
  ratingComment?: string;
}

const STORAGE_KEY = "rentmate_bookings";

/* ======================
   INTERNAL HELPERS
====================== */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function read(): SharedBooking[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(data: SharedBooking[]) {
  if (!isBrowser()) return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("bookingsUpdated"));
  } catch (error) {
    if (error instanceof QuotaExceededError) {
      console.error("Error: Kuota penyimpanan localStorage penuh.");
      alert("Maaf, ruang penyimpanan browser Anda penuh. Silakan hapus data yang tidak penting di pengaturan browser dan coba lagi.");
    } else {
      console.error("Gagal menyimpan data booking:", error);
    }
  }
}

function pruneOldBookings(days = 30) {
  const now = Date.now();
  const limit = days * 24 * 60 * 60 * 1000;
  const fresh = read().filter(b => {
    return now - new Date(b.createdAt).getTime() < limit;
  });
  write(fresh);
}

/* ======================
   PUBLIC API
====================== */

// GET ALL
export function getBookings(): SharedBooking[] {
  const bookings = read();
  
  // Pastikan semua booking memiliki field baru untuk backward compatibility
  return bookings.map(booking => ({
    ...booking,
    bookerType: booking.bookerType || "user",
    bookerId: booking.bookerId || "",
  }));
}

// GET BY ID
export function getBookingById(id: string): SharedBooking | undefined {
  return read().find(b => b.id === id);
}

// ADD (USER/MITRA)
export function addBooking(
  booking: Omit<SharedBooking, "id" | "createdAt" | "paymentSplit">
): SharedBooking {
  const all = read();
  const newBooking: SharedBooking = {
    ...booking,
    id: `booking_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    // Default values untuk field baru
    bookerType: booking.bookerType || "user",
    bookerId: booking.bookerId || "",
  };
  all.unshift(newBooking);

  const MAX_BOOKINGS = 100;
  if (all.length > MAX_BOOKINGS) {
    console.log(`Jumlah booking melebihi ${MAX_BOOKINGS}, menghapus booking terlama.`);
    all.splice(MAX_BOOKINGS); 
  }

  write(all);
  return newBooking;
}

// USER PAYMENT SUBMIT
export function updateBookingPayment(
  id: string,
  data: {
    paymentMethod: "qris" | "bca" | "bri" | "mandiri";
    paymentCode: string;
    paymentProof?: string;
    transferAmount?: number;
    transferTime: string;
  }
): SharedBooking | undefined {
  const all = read();
  const idx = all.findIndex(b => b.id === id);
  if (idx === -1) return undefined;

  const commissionPercentage = getAppCommission();
  const paymentSplit = calculatePaymentSplit(all[idx].total || 0, commissionPercentage);

  all[idx] = {
    ...all[idx],
    ...data,
    paymentStatus: "paid",
    approvalStatus: "pending_approval",
    paymentSplit,
  };

  const updatedBooking = all[idx];

  write(all);
  return updatedBooking;
}

// FUNGSI UNTUK MENDAPATKAN USER ATAU MITRA YANG SEDANG LOGIN
export function getCurrentUserOrMitra() {
  const isMitraAuthenticated = localStorage.getItem("mitraAuthenticated");
  const currentMitra = getCurrentMitra();
  
  if (isMitraAuthenticated && currentMitra) {
    return { type: "mitra", data: currentMitra };
  }
  
  const currentUser = getCurrentUser();
  if (currentUser) {
    return { type: "user", data: currentUser };
  }
  
  return null;
}

// UPDATE BOOKING APPROVAL
export function updateBookingApproval(
  id: string,
  status: "approved" | "rejected"
): SharedBooking | undefined {
  const all = read();
  const idx = all.findIndex(b => b.id === id);
  if (idx === -1) return undefined;

  const commissionPercentage = getAppCommission();
  const paymentSplit = calculatePaymentSplit(all[idx].total || 0, commissionPercentage);

  all[idx] = {
    ...all[idx],
    approvalStatus: status,
    paymentSplit,
  };

  const updatedBooking = all[idx];

  if (status === 'approved') {
    console.log(`Booking ${id} telah disetujui. Pembagian: Aplikasi ${paymentSplit.appAmount}, Talent ${paymentSplit.mitraAmount}`);
    
    // Buat sesi chat untuk booking yang disetujui
    getOrCreateChatSession(updatedBooking);
    
    // Kirim notifikasi ke semua browser yang terbuka
    window.dispatchEvent(new CustomEvent("bookingApproved", { 
      detail: { 
        booking: updatedBooking,
        timestamp: new Date().toISOString()
      } 
    }));
  }

  write(all);
  return updatedBooking;
}

// PERBAIKAN: Fungsi baru untuk menandai booking sebagai selesai
export function markBookingAsCompleted(id: string): SharedBooking | undefined {
  const all = read();
  const idx = all.findIndex(b => b.id === id);
  if (idx === -1) return undefined;

  // Hanya boleh menandai sebagai selesai jika statusnya "approved"
  if (all[idx].approvalStatus !== "approved") {
    console.warn(`Attempted to complete booking ${id} which is not approved. Current status: ${all[idx].approvalStatus}`);
    return undefined;
  }

  all[idx] = {
    ...all[idx],
    approvalStatus: "completed",
  };

  const updatedBooking = all[idx];
  write(all);

  console.log(`Booking ${id} telah ditandai sebagai selesai.`);
  
  // Kirim notifikasi spesifik bahwa booking telah selesai
  window.dispatchEvent(new CustomEvent("bookingCompleted", { 
    detail: { 
      booking: updatedBooking,
      timestamp: new Date().toISOString()
    } 
  }));

  return updatedBooking;
}

// ADMIN LIST
export function getPendingBookings(): SharedBooking[] {
  return read().filter(
    b =>
      b.paymentStatus === "paid" &&
      b.approvalStatus === "pending_approval"
  );
}

// TALENT ACTIVE BOOKING
export function getActiveBookingByTalent(
  talentId: string
): SharedBooking | undefined {
  const now = new Date();
  return read().find(b => {
    if (b.talentId !== talentId) return false;
    if (b.approvalStatus !== "approved") return false;
    const t = new Date(`${b.date}T${b.time}`);
    return t > now;
  });
}

// SUBSCRIBE
export function subscribeToBookings(cb: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener("bookingsUpdated", cb);
  return () => window.removeEventListener("bookingsUpdated", cb);
}

// UPDATE RATING
export function updateBookingRating(
  id: string,
  rating: number,
  comment?: string
): SharedBooking | undefined {
  const all = read();
  const idx = all.findIndex(b => b.id === id);
  if (idx === -1) return undefined;

  const updatedBooking = {
    ...all[idx],
    rating,
    ratingComment: comment,
  };

  all[idx] = updatedBooking;
  write(all);
  
  window.dispatchEvent(new CustomEvent("bookingUpdated", { detail: updatedBooking }));
  
  return updatedBooking;
}

// PERBAIKAN: Fungsi untuk menghitung pendapatan mitra yang sudah selesai
export function calculateMitraEarnings(mitraId: string, isTalentMode: boolean = true): number {
  const allBookings = getBookings();
  const commissionPercentage = getAppCommission();
  
  let mitraBookings: SharedBooking[];
  
  if (isTalentMode) {
    // Filter di mana mitra ini adalah TALENT yang di-booking
    mitraBookings = allBookings.filter(
      (booking) => booking.talentId === mitraId
    );
  } else {
    // Filter di mana mitra ini adalah USER yang melakukan pemesanan
    mitraBookings = allBookings.filter(
      (booking) => 
        booking.bookerId === mitraId && 
        booking.bookerType === "mitra"
    );
  }
  
  // PERBAIKAN: Filter hanya booking yang sudah benar-benar selesai
  const completedBookings = mitraBookings.filter((booking) => {
    return booking.approvalStatus === "completed";
  });
  
  // Hitung total pendapatan mitra (setelah dipotong komisi)
  const totalRevenue = completedBookings.reduce((sum, booking) => {
    const totalAmount = booking.total || 0;
    const mitraAmount = Math.round(totalAmount * ((100 - commissionPercentage) / 100));
    return sum + mitraAmount;
  }, 0);
  
  return totalRevenue;
}

// PERBAIKAN: Event listener untuk booking yang selesai
export function subscribeToCompletedBookings(mitraId: string, callback: () => void, isTalentMode: boolean = true): () => void {
  if (!isBrowser()) return () => {};
  
  // Simpan ID booking yang sudah selesai untuk mencegah notifikasi ganda
  let completedBookingsIds: Set<string> = new Set();
  
  const initializeCompletedIds = () => {
    const allBookings = getBookings();
    allBookings.forEach(booking => {
      const isRelevant = isTalentMode 
        ? booking.talentId === mitraId && booking.approvalStatus === "completed"
        : booking.bookerId === mitraId && booking.bookerType === "mitra" && booking.approvalStatus === "completed";

      if (isRelevant) {
        completedBookingsIds.add(booking.id);
      }
    });
  };

  const checkForNewCompletedBookings = () => {
    const allBookings = getBookings();
    let hasNewCompletedBooking = false;
    
    allBookings.forEach(booking => {
      const isRelevant = isTalentMode 
        ? booking.talentId === mitraId
        : booking.bookerId === mitraId && booking.bookerType === "mitra";

      if (isRelevant && booking.approvalStatus === "completed") {
        // Jika ID ini belum ada di set kita, ini adalah booking baru yang selesai
        if (!completedBookingsIds.has(booking.id)) {
          completedBookingsIds.add(booking.id);
          hasNewCompletedBooking = true;
        }
      }
    });
    
    if (hasNewCompletedBooking) {
      callback();
    }
  };
  
  // Inisialisasi daftar booking yang sudah selesai saat pertama kali subscribe
  initializeCompletedIds();

  // Cek setiap menit untuk booking yang baru selesai
  const intervalId = setInterval(checkForNewCompletedBookings, 60000);
  
  // Cek saat ada update booking
  const handleBookingUpdate = (event: CustomEvent) => {
    // Jika event spesifik "bookingCompleted", langsung periksa
    if (event.type === 'bookingCompleted' && event.detail?.booking) {
      const booking = event.detail.booking;
      const isRelevant = isTalentMode 
        ? booking.talentId === mitraId
        : booking.bookerId === mitraId && booking.bookerType === "mitra";
      
      if (isRelevant) {
        callback();
      }
    } else {
      // Untuk event lain, beri jeda singkat sebelum memeriksa
      setTimeout(checkForNewCompletedBookings, 1000);
    }
  };
  
  window.addEventListener("bookingsUpdated", handleBookingUpdate as EventListener);
  window.addEventListener("bookingCompleted", handleBookingUpdate as EventListener);
  
  return () => {
    clearInterval(intervalId);
    window.removeEventListener("bookingsUpdated", handleBookingUpdate as EventListener);
    window.removeEventListener("bookingCompleted", handleBookingUpdate as EventListener);
  };
}

// PERBAIKAN: Fungsi untuk menandai booking yang sudah selesai secara otomatis
export function checkAndUpdateCompletedBookings(): void {
  if (!isBrowser()) return;
  
  const allBookings = getBookings();
  const now = new Date();
  let hasUpdates = false;
  
  const updatedBookings = allBookings.map(booking => {
    // Skip jika sudah ditandai selesai, ditolak, atau masih menunggu persetujuan
    if (booking.approvalStatus === "completed" || booking.approvalStatus === "rejected" || booking.approvalStatus === "pending_approval") {
      return booking;
    }
    
    // Hanya proses booking yang sudah disetujui
    if (booking.approvalStatus !== "approved") {
      return booking;
    }
    
    // Hitung waktu selesai booking
    const endTime = new Date(`${booking.date}T${booking.time}`);
    endTime.setHours(endTime.getHours() + booking.duration);
    
    // Jika waktu selesai sudah lewat, tandai sebagai selesai
    if (endTime < now) {
      console.log(`Automatically completing booking ${booking.id} as its end time has passed.`);
      hasUpdates = true;
      return {
        ...booking,
        approvalStatus: "completed"
      };
    }
    
    return booking;
  });
  
  // Jika ada update, simpan perubahan
  if (hasUpdates) {
    write(updatedBookings);
    
    // Kirim notifikasi untuk setiap booking yang baru selesai
    allBookings.forEach(originalBooking => {
      const updatedBooking = updatedBookings.find(b => b.id === originalBooking.id);
      if (updatedBooking && updatedBooking.approvalStatus === "completed" && originalBooking.approvalStatus === "approved") {
        window.dispatchEvent(new CustomEvent("bookingCompleted", { 
          detail: { 
            booking: updatedBooking,
            timestamp: new Date().toISOString()
          } 
        }));
      }
    });
  }
}

// Fungsi lainnya yang tidak terkait chat tetap bisa dipertahankan
export function getBookingByUserAndTalent(userId: string, talentId: string): SharedBooking | undefined { 
  return read().find(b => b.bookerId === userId && b.talentId === talentId); 
}

export function getBookingsByUser(userId: string): SharedBooking[] { 
  return read().filter(b => b.bookerId === userId); 
}

// PERBAIKAN: Gunakan status "completed" yang baru
export function getCompletedBookings(): SharedBooking[] { 
  return read().filter(b => b.approvalStatus === "completed");
}

export function getActiveBookings(): SharedBooking[] { 
  const now = new Date();
  return read().filter(b => {
    if (b.approvalStatus !== "approved") return false;
    const startTime = new Date(`${b.date}T${b.time}`);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + b.duration);
    return startTime <= now && now < endTime;
  });
}

export function getPendingPaymentBookings(): SharedBooking[] { 
  return read().filter(b => b.paymentStatus === "pending"); 
}

export function getPendingApprovalBookings(): SharedBooking[] { 
  return read().filter(b => b.approvalStatus === "pending_approval"); 
}

export function deleteBooking(id: string): boolean { 
  const all = read();
  const idx = all.findIndex(b => b.id === id);
  if (idx === -1) return false;
  
  all.splice(idx, 1);
  write(all);
  return true;
}

export function updateBooking(id: string, data: Partial<SharedBooking>): SharedBooking | undefined { 
  const all = read();
  const idx = all.findIndex(b => b.id === id);
  if (idx === -1) return undefined;
  
  all[idx] = { ...all[idx], ...data };
  write(all);
  return all[idx];
}

export function isTimeSlotBooked(talentId: string, date: string, time: string, duration: number, excludeBookingId?: string): boolean { 
  const allBookings = read();
  
  return allBookings.some(booking => {
    if (booking.id === excludeBookingId) return false;
    if (booking.talentId !== talentId) return false;
    if (booking.approvalStatus !== "approved") return false;
    if (booking.date !== date) return false;
    
    const bookingStartTime = new Date(`${date}T${booking.time}`);
    const bookingEndTime = new Date(bookingStartTime);
    bookingEndTime.setHours(bookingEndTime.getHours() + booking.duration);
    
    const newStartTime = new Date(`${date}T${time}`);
    const newEndTime = new Date(newStartTime);
    newEndTime.setHours(newEndTime.getHours() + duration);
    
    return (
      (newStartTime >= bookingStartTime && newStartTime < bookingEndTime) ||
      (newEndTime > bookingStartTime && newEndTime <= bookingEndTime) ||
      (newStartTime <= bookingStartTime && newEndTime >= bookingEndTime)
    );
  });
}

// Inisialisasi saat halaman dimuat
if (typeof window !== "undefined") {
  // Bersihkan booking lama setelah halaman dimuat
  setTimeout(() => {
    pruneOldBookings();
  }, 1000);

  // PERBAIKAN: Jalankan pemeriksaan booking selesai setiap 5 menit
  setInterval(checkAndUpdateCompletedBookings, 5 * 60 * 1000);
  
  // Juga jalankan sekali saat halaman dimuat untuk menangkap booking yang mungkin selesai saat aplikasi tertutup
  setTimeout(checkAndUpdateCompletedBookings, 2000);
}