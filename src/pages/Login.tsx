import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/lib/userStore";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await new Promise((r) => setTimeout(r, 1000));

    const storedUser = localStorage.getItem("rentmate_user");

    if (!storedUser) {
      throw new Error("User tidak ditemukan");
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.email !== formData.email) {
      throw new Error("Email tidak cocok");
    }

    toast({ title: "Login Berhasil! 🎉" });

    navigate("/profile", { replace: true });
  } catch (err) {
    toast({
      title: "Login Gagal",
      description: "Email atau password salah",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4 pt-20 md:pt-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-card-hover animate-fade-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center shadow-orange">
                <span className="text-primary-foreground font-bold text-xl">R</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold">Selamat Datang Kembali!</h1>
            <p className="text-muted-foreground mt-2">
              Masuk ke akun RentMate kamu
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-11"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  className="pl-11 pr-11"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Lupa kata sandi?
              </Link>
            </div>

            <Button variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}