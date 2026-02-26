import bcrypt from 'bcryptjs';

export function getAllUsers(): UserProfile[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string; // ← TAMBAHKAN INI
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

const STORAGE_KEY = "rentmate_current_user";
const USERS_KEY = "rentmate_users";
const CURRENT_USER_KEY = "rentmate_current_user";

// ✅ GET CURRENT USER
export function getCurrentUser(): UserProfile | null {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

// ✅ REGISTER USER (BARU)
export function registerUser(user: UserProfile) {
  const users = getAllUsers();

  const emailExists = users.some(u => u.email === user.email);
  if (emailExists) {
    throw new Error("Email sudah terdaftar");
  }

  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ✅ UPDATE USER
export function updateCurrentUser(
  updates: Partial<UserProfile>
): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;

  const users = getAllUsers();

  const updatedUser = { ...current, ...updates };

  // 🔥 update di array users juga
  const updatedUsers = users.map(u =>
    u.id === current.id ? updatedUser : u
  );

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  window.dispatchEvent(new CustomEvent("userUpdated"));

  return updatedUser;
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  console.log("=== DEBUG LOGIN START ===");
  console.log("Email yang dimasukkan:", email);
  console.log("Password yang dimasukkan:", `"${password}"`); // Pakai tanda kutip untuk melihat spasi

  const users = getAllUsers();
  const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!foundUser) {
    console.log("ERROR: User dengan email tersebut tidak ditemukan.");
    throw new Error("Email atau password salah");
  }

  console.log("User ditemukan:", foundUser.name);
  console.log("Password yang tersimpan di localStorage (mentah):", `"${foundUser.password}"`);

  const isHashed = foundUser.password.startsWith('$2');
  console.log("Apakah password sudah di-hash?", isHashed);

  let isMatch = false;

  if (isHashed) {
    console.log("Membandingkan dengan bcrypt.compare...");
    isMatch = await bcrypt.compare(password, foundUser.password);
    console.log("Hasil bcrypt.compare:", isMatch);
  } else {
    console.log("Membandingkan password plain text...");
    // 🔥 TAMBAHKAN .trim() UNTUK MENGHILANGKAN SPASI DI AWAL/AKHIR
    const storedPassword = foundUser.password.trim();
    const inputPassword = password.trim();
    
    console.log("Password tersimpan (setelah trim):", `"${storedPassword}"`);
    console.log("Password input (setelah trim):", `"${inputPassword}"`);
    
    isMatch = storedPassword === inputPassword;
    console.log("Hasil perbandingan plain text:", isMatch);

    if (isMatch) {
      console.warn("Mendeteksi user lama. Meng-upgrade password ke hash yang aman...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updatedUsers = users.map(u => u.id === foundUser.id ? { ...u, password: hashedPassword } : u);
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      console.log("Password berhasil di-upgrade.");
    }
  }

  if (!isMatch) {
    console.log("ERROR: Password tidak cocok.");
    console.log("=== DEBUG LOGIN END (GAGAL) ===");
    throw new Error("Email atau password salah");
  }

  console.log("LOGIN BERHASIL!");
  console.log("=== DEBUG LOGIN END (BERHASIL) ===");

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
  window.dispatchEvent(new CustomEvent("userUpdated"));
  return foundUser;
}

// ✅ LOGOUT
export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
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