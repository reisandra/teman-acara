// User identity store for UI simulation
// This provides the logged-in user's profile data across the app

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  city: string;
  hobbies: string;
  preference: "online" | "offline" | "both";
  photo: string;
  joinDate: string;
  wallet: number;
  notifications?: NotificationItem[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "payment" | "booking" | "admin";
}

// Default logged-in user (simulated)
const defaultUser: UserProfile = {
  id: "user_001",
  name: "Jane Priscilla",
  username: "janepriscilla",
  email: "jane.priscilla@email.com",
  phone: "+62 812 3456 7890",
  bio: "Suka traveling dan ngobrol santai",
  city: "Jakarta",
  hobbies: "Traveling, Fotografi, Kuliner",
  preference: "online",
  photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  joinDate: "Januari 2024",
  wallet: 500000,
  notifications: [
    {
      id: 1,
      title: "Pembayaran Berhasil",
      message: "Pembayaran untuk booking #B123 telah diterima.",
      time: "Baru saja",
      read: false,
      type: "payment",
    },
    {
      id: 2,
      title: "Pemesanan Dikonfirmasi",
      message: "Talent menerima pesanan Anda untuk tanggal 25 Jan.",
      time: "1 jam yang lalu",
      read: true,
      type: "booking",
    },
    {
      id: 3,
      title: "Persetujuan Admin",
      message: "Verifikasi identitas Anda telah disetujui.",
      time: "1 hari yang lalu",
      read: true,
      type: "admin",
    },
  ],
};

const STORAGE_KEY = "rentmate_current_user";

// Get current logged-in user
export function getCurrentUser(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  } catch {
    return defaultUser;
  }
}

// Update current user profile
export function updateCurrentUser(updates: Partial<UserProfile>): UserProfile {
  const current = getCurrentUser();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("userUpdated"));
  return updated;
}

export function markAllNotificationsRead(): UserProfile {
  const current = getCurrentUser();
  const notifications = (current.notifications || []).map((n) => ({ ...n, read: true }));
  return updateCurrentUser({ notifications });
}

export function getUnreadNotificationCount(): number {
  const current = getCurrentUser();
  return (current.notifications || []).filter((n) => !n.read).length;
}

// Subscribe to user updates
export function subscribeToUser(callback: () => void): () => void {
  window.addEventListener("userUpdated", callback);
  return () => window.removeEventListener("userUpdated", callback);
}
