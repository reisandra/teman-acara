import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ← PENTING untuk navigate
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, UserPlus, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/lib/userStore";
import { useAuth } from "@/hooks/useAuth";
import bcrypt from 'bcryptjs'; 

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const profileImageRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    description: "",
    birthDate: "",
    hobby: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setFormData(prev => ({ ...prev, phone: numericValue }));
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Upload Gagal",
        description: "Ukuran foto maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.match("image.*")) {
      toast({
        title: "Upload Gagal",
        description: "Hanya file gambar yang diperbolehkan",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setProfileImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
    toast({ title: "Register Gagal", description: "Password tidak cocok", variant: "destructive" });
    setIsLoading(false); 
    return;
  }

    if (!formData.birthDate) {
      toast({ title: "Register Gagal", description: "Tanggal lahir wajib diisi", variant: "destructive" });
      return;
    }

    const age = calculateAge(formData.birthDate);

    if (age < 17 || age > 65) {
      toast({ title: "Register Gagal", description: "Umur harus 17-65 tahun", variant: "destructive" });
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
      toast({ title: "Register Gagal", description: "Semua field wajib diisi", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);

      const newUser: UserProfile = {
        id: Date.now().toString(),
        name: formData.name,
        username: formData.email.split("@")[0],
        email: formData.email,
        password: hashedPassword,
        phone: formData.phone,
        bio: formData.description || "",
        city: formData.address || "",
        hobbies: formData.hobby || "",
        preference: "both",
        photo: profileImagePreview || "",
        wallet: 0,
        notifications: [],
        joinDate: new Date().toLocaleDateString(),
      };

      await registerUser(newUser);

      toast({ title: "Register Berhasil 🎉", description: "Akun Anda telah dibuat." });
      navigate("/login");
    } catch (err: any) {
      toast({ title: "Register Gagal", description: err.message || "Terjadi kesalahan", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.phone &&
    formData.address &&
    formData.birthDate &&
    formData.password === formData.confirmPassword;

  // ← pastikan return JSX di luar handleRegister
  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
            {profileImagePreview ? (
              <img src={profileImagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : formData.name ? (
              <span className="text-white text-xl font-bold">{getInitials(formData.name)}</span>
            ) : (
              <UserPlus className="w-8 h-8 text-white" />
            )}
          </div>

          <h1 className="text-2xl font-bold">Daftar User Baru</h1>
          <p className="text-muted-foreground text-sm mt-2">Buat akun untuk mulai menggunakan platform</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Upload Foto Opsional */}
          <div className="text-center">
            <input type="file" accept="image/*" ref={profileImageRef} className="hidden" onChange={handleProfileImageUpload} />
            <Button type="button" variant="outline" size="sm" onClick={() => profileImageRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" /> Pilih Foto
            </Button>
            <p className="text-xs text-muted-foreground mt-1">Jika tidak upload, avatar akan menggunakan inisial nama</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input value={formData.name} onChange={e => handleInputChange("name", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => handleInputChange("password", e.target.value)} required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Konfirmasi Password</Label>
            <div className="relative">
              <Input type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={e => handleInputChange("confirmPassword", e.target.value)} required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tanggal Lahir</Label>
            <Input type="date" value={formData.birthDate} onChange={e => handleInputChange("birthDate", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Hobi</Label>
            <Input value={formData.hobby} onChange={e => handleInputChange("hobby", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Nomor Telepon</Label>
            <Input type="tel" value={formData.phone} onChange={handlePhoneChange} required />
          </div>

          <div className="space-y-2">
            <Label>Alamat</Label>
            <Input value={formData.address} onChange={e => handleInputChange("address", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi Diri</Label>
            <Textarea value={formData.description} onChange={e => handleInputChange("description", e.target.value)} rows={3} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Mendaftar..." : "Daftar User"}
          </Button>

          <div className="pt-6 border-t text-center">
            <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
              Kembali ke Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}