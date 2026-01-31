import { supabase } from './supabase';
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
  approvalStatus: "pending_approval" | "approved" | "rejected" | "completed";
  paymentMethod?: "qris" | "bca" | "bri" | "mandiri";
  paymentCode?: string;
  paymentProof?: string;
  transferAmount?: number;
  transferTime?: string;
  paymentSplit?: {
    appAmount: number;
    mitraAmount: number;
    totalAmount: number;
    commissionPercentage: number;
  };
  createdAt: string;
  updatedAt?: string;
  rating?: number;
  ratingComment?: string;
}

// Helper function to convert camelCase to snake_case
const camelToSnake = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Array) return obj.map(item => camelToSnake(item));
  
  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = camelToSnake(obj[key]);
    }
  }
  return result;
};

// Helper function to convert snake_case to camelCase
const snakeToCamel = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Array) return obj.map(item => snakeToCamel(item));

  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = snakeToCamel(obj[key]);
    }
  }
  return result;
};

// ======================
//   DATABASE FUNCTIONS
// ======================

// GET ALL FROM SUPABASE
export async function getBookings(): Promise<SharedBooking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
    return snakeToCamel(data) || [];
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
}

// GET BY ID FROM SUPABASE
export async function getBookingById(id: string): Promise<SharedBooking | null> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
    return snakeToCamel(data);
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return null;
  }
}

// ADD TO SUPABASE
export async function addBooking(
  booking: Omit<SharedBooking, "id" | "createdAt" | "updatedAt" | "paymentSplit">
): Promise<SharedBooking> {
  try {
    const dbBooking = camelToSnake({
      ...booking,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('Creating booking with data:', dbBooking);
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(dbBooking)
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }

    console.log('✅ Booking created in Supabase:', data);
    return snakeToCamel(data);
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
}

// UPDATE PAYMENT IN SUPABASE
export async function updateBookingPayment(
  id: string,
  data: {
    paymentMethod: "qris" | "bca" | "bri" | "mandiri";
    paymentCode: string;
    paymentProof?: string;
    transferAmount?: number;
    transferTime: string;
  }
): Promise<SharedBooking> {
  try {
    const commissionPercentage = getAppCommission();
    const paymentSplit = calculatePaymentSplit(data.transferAmount || 0, commissionPercentage);

    const dbData = camelToSnake({
      ...data,
      paymentStatus: "paid",
      approvalStatus: "pending_approval",
      paymentSplit,
      updatedAt: new Date().toISOString()
    });

    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment:', error);
      throw error;
    }

    console.log('✅ Payment updated in Supabase:', updatedBooking);
    return snakeToCamel(updatedBooking);
  } catch (error) {
    console.error('Failed to update payment:', error);
    throw error;
  }
}

// UPDATE APPROVAL IN SUPABASE
export async function updateBookingApproval(
  id: string,
  status: "approved" | "rejected"
): Promise<SharedBooking> {
  try {
    const { data: currentBooking } = await supabase
      .from('bookings')
      .select('total')
      .eq('id', id)
      .single();

    if (!currentBooking) {
      throw new Error('Booking not found');
    }

    const commissionPercentage = getAppCommission();
    const paymentSplit = calculatePaymentSplit(currentBooking.total || 0, commissionPercentage);

    const dbData = camelToSnake({
      approvalStatus: status,
      paymentSplit,
      updatedAt: new Date().toISOString()
    });

    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating approval:', error);
      throw error;
    }

    const camelCaseBooking = snakeToCamel(updatedBooking);

    if (status === 'approved') {
      console.log(`Booking ${id} telah disetujui.`);
      getOrCreateChatSession(camelCaseBooking);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("bookingApproved", { 
          detail: { booking: camelCaseBooking, timestamp: new Date().toISOString() } 
        }));
      }
    }

    return camelCaseBooking;
  } catch (error) {
    console.error('Failed to update approval:', error);
    throw error;
  }
}

// MARK AS COMPLETED IN SUPABASE
export async function markBookingAsCompleted(id: string): Promise<SharedBooking> {
  try {
    const { data: currentBooking } = await supabase
      .from('bookings')
      .select('approval_status')
      .eq('id', id)
      .single();

    if (!currentBooking) {
      throw new Error('Booking not found');
    }

    if (currentBooking.approval_status !== "approved") {
      throw new Error(`Cannot complete booking with status: ${currentBooking.approval_status}`);
    }

    const dbData = camelToSnake({
      approvalStatus: "completed",
      updatedAt: new Date().toISOString()
    });

    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error marking as completed:', error);
      throw error;
    }
    
    const camelCaseBooking = snakeToCamel(updatedBooking);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("bookingCompleted", { 
        detail: { booking: camelCaseBooking, timestamp: new Date().toISOString() } 
      }));
    }

    return camelCaseBooking;
  } catch (error) {
    console.error('Failed to mark as completed:', error);
    throw error;
  }
}

// GET PENDING BOOKINGS FROM SUPABASE
export async function getPendingBookings(): Promise<SharedBooking[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('payment_status', 'paid')
      .eq('approval_status', 'pending_approval')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pending bookings:', error);
      return [];
    }
    return snakeToCamel(data) || [];
  } catch (error) {
    console.error('Failed to fetch pending bookings:', error);
    return [];
  }
}

// GET ACTIVE BOOKINGS BY TALENT FROM SUPABASE
export async function getActiveBookingByTalent(talentId: string): Promise<SharedBooking | null> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('talent_id', talentId)
      .eq('approval_status', 'approved')
      .gt('date', now)
      .order('date', { ascending: true })
      .limit(1);
    
    if (error) {
      console.error('Error fetching active booking:', error);
      return null;
    }
    
    if (data && data.length > 0) {
      const booking = snakeToCamel(data[0]);
      const endTime = new Date(`${booking.date}T${booking.time}`);
      endTime.setHours(endTime.getHours() + booking.duration);
      if (endTime > new Date()) {
        return booking;
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch active booking:', error);
    return null;
  }
}

// REAL-TIME SUBSCRIPTION
export function subscribeToBookings(callback: (booking: SharedBooking) => void) {
  const channel = supabase
    .channel('bookings')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        callback(snakeToCamel(payload.new) as SharedBooking);
      }
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}

// ======================
//   LEGACY & HELPER FUNCTIONS
// ======================

export async function getBookingByUserAndTalent(userId: string, talentId: string): Promise<SharedBooking | null> { 
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booker_id', userId)
      .eq('talent_id', talentId)
      .single();
    
    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
    return snakeToCamel(data);
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return null;
  }
}

// SATU-SATUNYA FUNGSI getBookingsByUser YANG BENAR
export async function getBookingsByUser(userId: string): Promise<SharedBooking[]> { 
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booker_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
    return snakeToCamel(data) || [];
  } catch (error) {
    console.error('Failed to fetch user bookings:', error);
    return [];
  }
}

export async function getCompletedBookings(): Promise<SharedBooking[]> { 
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('approval_status', 'completed')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching completed bookings:', error);
      return [];
    }
    return snakeToCamel(data) || [];
  } catch (error) {
    console.error('Failed to fetch completed bookings:', error);
    return [];
  }
}

export async function getActiveBookings(): Promise<SharedBooking[]> { 
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('approval_status', 'approved')
      .lte('date', now)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching active bookings:', error);
      return [];
    }
    
    const camelCaseData = snakeToCamel(data) || [];
    const currentDateTime = new Date();
    return camelCaseData.filter(booking => {
      const startTime = new Date(`${booking.date}T${booking.time}`);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + booking.duration);
      return startTime <= currentDateTime && currentDateTime < endTime;
    });
  } catch (error) {
    console.error('Failed to fetch active bookings:', error);
    return [];
  }
}

export async function getPendingPaymentBookings(): Promise<SharedBooking[]> { 
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('payment_status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pending payment bookings:', error);
      return [];
    }
    return snakeToCamel(data) || [];
  } catch (error) {
    console.error('Failed to fetch pending payment bookings:', error);
    return [];
  }
}

export async function getPendingApprovalBookings(): Promise<SharedBooking[]> { 
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('approval_status', 'pending_approval')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pending approval bookings:', error);
      return [];
    }
    return snakeToCamel(data) || [];
  } catch (error) {
    console.error('Failed to fetch pending approval bookings:', error);
    return [];
  }
}

export async function deleteBooking(id: string): Promise<boolean> { 
  try {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) {
      console.error('Error deleting booking:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to delete booking:', error);
    return false;
  }
}

export async function updateBooking(id: string, data: Partial<SharedBooking>): Promise<SharedBooking | null> { 
  try {
    const dbData = camelToSnake({ ...data, updatedAt: new Date().toISOString() });
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating booking:', error);
      return null;
    }
    return snakeToCamel(updatedBooking);
  } catch (error) {
    console.error('Failed to update booking:', error);
    return null;
  }
}

export async function isTimeSlotBooked(talentId: string, date: string, time: string, duration: number, excludeBookingId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('talent_id', talentId)
      .eq('date', date)
      .eq('approval_status', 'approved');
    
    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId);
    }
    
    const { data, error } = await query;
    if (error || !data) return false;
    
    const camelCaseData = snakeToCamel(data) || [];
    const newStartTime = new Date(`${date}T${time}`);
    const newEndTime = new Date(newStartTime.getTime() + duration * 60 * 60 * 1000);
    
    return camelCaseData.some(booking => {
      const bookingStartTime = new Date(`${booking.date}T${booking.time}`);
      const bookingEndTime = new Date(bookingStartTime.getTime() + booking.duration * 60 * 60 * 1000);
      return (newStartTime >= bookingStartTime && newStartTime < bookingEndTime) ||
             (newEndTime > bookingStartTime && newEndTime <= bookingEndTime) ||
             (newStartTime <= bookingStartTime && newEndTime >= bookingEndTime);
    });
  } catch (error) {
    console.error('Failed to check time slot:', error);
    return false;
  }
}

export function getCurrentUserOrMitra() {
  const isMitraAuthenticated = typeof window !== "undefined" && localStorage.getItem("mitraAuthenticated");
  const currentMitra = getCurrentMitra();
  if (isMitraAuthenticated && currentMitra) return { type: "mitra", data: currentMitra };
  
  const currentUser = getCurrentUser();
  if (currentUser) return { type: "user", data: currentUser };
  
  return null;
}

export async function calculateMitraEarnings(mitraId: string, isTalentMode: boolean = true): Promise<number> {
  try {
    const allBookings = await getBookings();
    const commissionPercentage = getAppCommission();
    
    let mitraBookings: SharedBooking[];
    
    if (isTalentMode) {
      mitraBookings = allBookings.filter((booking) => booking.talentId === mitraId);
    } else {
      mitraBookings = allBookings.filter(
        (booking) => booking.bookerId === mitraId && booking.bookerType === "mitra"
      );
    }
    
    const completedBookings = mitraBookings.filter((booking) => booking.approvalStatus === "completed");
    
    const totalRevenue = completedBookings.reduce((sum, booking) => {
      const totalAmount = parseFloat(booking.total) || 0;
      const mitraAmount = Math.round(totalAmount * ((100 - commissionPercentage) / 100));
      return sum + mitraAmount;
    }, 0);
    
    return totalRevenue;
  } catch (error) {
    console.error('Failed to calculate mitra earnings:', error);
    return 0;
  }
}

export async function checkAndUpdateCompletedBookings(): Promise<void> {
  try {
    const allBookings = await getBookings();
    const currentDateTime = new Date();
    
    const approvedBookings = allBookings.filter(b => b.approvalStatus === 'approved');
    
    for (const booking of approvedBookings) {
      const endTime = new Date(`${booking.date}T${booking.time}`);
      endTime.setHours(endTime.getHours() + booking.duration);
      
      if (endTime < currentDateTime) {
        console.log(`Automatically completing booking ${booking.id} as its end time has passed.`);
        await markBookingAsCompleted(booking.id);
      }
    }
  } catch (error) {
    console.error('Failed to check and update completed bookings:', error);
  }
}  

export function subscribeToCompletedBookings(mitraId: string, callback: () => void, isTalentMode: boolean = true): () => void {
  if (typeof window === "undefined") return () => {};
  
  let completedBookingsIds: Set<string> = new Set();
  
  const initializeCompletedIds = async () => {
    const allBookings = await getBookings();
    allBookings.forEach(booking => {
      const isRelevant = isTalentMode 
        ? booking.talentId === mitraId && booking.approvalStatus === "completed"
        : booking.bookerId === mitraId && booking.bookerType === "mitra" && booking.approvalStatus === "completed";
      if (isRelevant) completedBookingsIds.add(booking.id);
    });
  };

  const checkForNewCompletedBookings = async () => {
    const allBookings = await getBookings();
    let hasNewCompletedBooking = false;
    
    allBookings.forEach(booking => {
      const isRelevant = isTalentMode 
        ? booking.talentId === mitraId
        : booking.bookerId === mitraId && booking.bookerType === "mitra";

      if (isRelevant && booking.approvalStatus === "completed" && !completedBookingsIds.has(booking.id)) {
        completedBookingsIds.add(booking.id);
        hasNewCompletedBooking = true;
      }
    });
    
    if (hasNewCompletedBooking) callback();
  };
  
  initializeCompletedIds();
  const intervalId = setInterval(checkForNewCompletedBookings, 60000);
  
  const handleBookingUpdate = (event: CustomEvent) => {
    if (event.type === 'bookingCompleted' && event.detail?.booking) {
      const booking = event.detail.booking;
      const isRelevant = isTalentMode 
        ? booking.talentId === mitraId
        : booking.bookerId === mitraId && booking.bookerType === "mitra";
      if (isRelevant) callback();
    } else {
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