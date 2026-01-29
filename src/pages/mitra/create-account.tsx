// src/pages/mitra/create-account.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createAccountForExistingTalent, loginMitra } from "@/lib/mitraStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { talents } from "@/data/mockData";

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [talentId, setTalentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!talentId) {
      toast({
        title: "Error",
        description: "Silakan pilih profil talent Anda.",
        variant: "destructive",
      });
      return;
    }

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email dan password harus diisi.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak cocok.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Buat akun untuk talent yang sudah ada
      await createAccountForExistingTalent(talentId, email, password);
      
      toast({
        title: "Berhasil",
        description: "Akun berhasil dibuat. Anda bisa langsung login.",
      });

      // Langsung login setelah membuat akun
      await loginMitra({ email, password });
      
      navigate("/mitra/dashboard");
    } catch (error: any) {
      toast({
        title: "Gagal Membuat Akun",
        description: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Buat Akun Talent</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Buat akun login untuk profil talent Anda yang sudah ada
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="talent" className="text-sm font-medium">Pilih Profil Talent Anda</Label>
            <Select value={talentId} onValueChange={setTalentId}>
              <SelectTrigger>
                <SelectValue placeholder="Cari nama Anda di daftar..." />
              </SelectTrigger>
              <SelectContent>
                {talents.map((talent) => (
                  <SelectItem key={talent.id} value={talent.id}>
                    {talent.name} - {talent.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ketik ulang password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleCreateAccount}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Buat Akun"}
          </Button>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Sudah punya akun?
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate("/mitra/login")}>
              Masuk di sini
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}