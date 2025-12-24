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
}

// Default logged-in user (simulated)
const defaultUser: UserProfile = {
  id: "user_001",
  name: "Budi Santoso",
  username: "budisantoso",
  email: "budi@email.com",
  phone: "+62 812 3456 7890",
  bio: "Suka traveling dan ngobrol santai",
  city: "Jakarta",
  hobbies: "Traveling, Fotografi, Kuliner",
  preference: "offline",
  photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  joinDate: "Januari 2024",
  wallet: 500000,
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

// Subscribe to user updates
export function subscribeToUser(callback: () => void): () => void {
  window.addEventListener("userUpdated", callback);
  return () => window.removeEventListener("userUpdated", callback);
}
