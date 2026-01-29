import { Navigate } from "react-router-dom";
import { getCurrentUser, getCurrentMitra } from "@/lib/userStore"; // Sesuaikan dengan lokasi store Anda

interface ProtectedRouteProps {
  children: React.ReactNode;
  type: "user" | "mitra";
}

export function ProtectedRoute({ children, type }: ProtectedRouteProps) {
  let isLoggedIn = false;

  if (type === "user") {
    isLoggedIn = !!getCurrentUser();
  } else if (type === "mitra") {
    isLoggedIn = !!getCurrentMitra();
  }

  if (!isLoggedIn) {
    // Arahkan ke halaman login yang sesuai jika belum login
    const loginPath = type === "mitra" ? "/mitra/login" : "/login";
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
}