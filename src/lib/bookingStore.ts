// Shared booking store using localStorage for UI simulation
// This allows User UI and Admin Dashboard to share the same booking data

export interface SharedBooking {
  id: string;
  userName: string;
  userPhoto: string;
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
  approvalStatus: "pending_approval" | "approved" | "rejected";
  createdAt: string;
}

const STORAGE_KEY = "rentmate_bookings";

// Get all bookings from localStorage
export function getBookings(): SharedBooking[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save bookings to localStorage
export function saveBookings(bookings: SharedBooking[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent("bookingsUpdated"));
}

// Add a new booking
export function addBooking(booking: Omit<SharedBooking, "id" | "createdAt">): SharedBooking {
  const bookings = getBookings();
  const newBooking: SharedBooking = {
    ...booking,
    id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(newBooking); // Add to beginning (newest first)
  saveBookings(bookings);
  return newBooking;
}

// Get a specific booking by ID
export function getBookingById(id: string): SharedBooking | undefined {
  const bookings = getBookings();
  return bookings.find((b) => b.id === id);
}

// Update booking status
export function updateBookingStatus(
  id: string,
  approvalStatus: SharedBooking["approvalStatus"]
): SharedBooking | undefined {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookings[index].approvalStatus = approvalStatus;
    saveBookings(bookings);
    return bookings[index];
  }
  return undefined;
}

// Get pending bookings (for Admin)
export function getPendingBookings(): SharedBooking[] {
  return getBookings().filter((b) => b.approvalStatus === "pending_approval");
}

// Get bookings by status
export function getBookingsByStatus(status: SharedBooking["approvalStatus"]): SharedBooking[] {
  return getBookings().filter((b) => b.approvalStatus === status);
}

// Hook helper to subscribe to booking updates
export function subscribeToBookings(callback: () => void): () => void {
  window.addEventListener("bookingsUpdated", callback);
  return () => window.removeEventListener("bookingsUpdated", callback);
}
