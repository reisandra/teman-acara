const STORAGE_KEY = "rentmate_current_user";

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

// ✅ GET CURRENT USER
export function getCurrentUser(): UserProfile | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

// ✅ REGISTER USER (BARU)
export function registerUser(user: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("userUpdated"));
}

// ✅ UPDATE USER
export function updateCurrentUser(
  updates: Partial<UserProfile>
): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;

  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("userUpdated"));
  return updated;
}

// ✅ LOGOUT
export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("userUpdated"));
}

// ✅ NOTIFICATION
export function markAllNotificationsRead(): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;

  const notifications = (current.notifications || []).map((n) => ({
    ...n,
    read: true,
  }));

  return updateCurrentUser({ notifications });
}

export function getUnreadNotificationCount(): number {
  const current = getCurrentUser();
  return (current?.notifications || []).filter((n) => !n.read).length;
}

export function subscribeToUser(callback: () => void): () => void {
  window.addEventListener("userUpdated", callback);
  return () => window.removeEventListener("userUpdated", callback);
}