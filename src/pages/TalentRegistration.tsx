import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  MapPin,
  DollarSign,
  FileText,
  Monitor,
  Users,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const cities = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar",
  "Palembang", "Depok", "Tangerang", "Bekasi", "Yogyakarta", "Malang",
  "Solo", "Denpasar", "Batam", "Bogor", "Pekanbaru", "Bandar Lampung",
];

const hobbies = [
  "Traveling", "Fotografi", "Musik", "Olahraga", "Gaming", "Memasak",
  "Membaca", "Menonton Film", "Seni & Kerajinan", "Menari", "Hiking",
  "Yoga", "Kuliner", "Fashion", "Teknologi", "Bisnis",
];

export default function TalentRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bio: "",
    city: "",
    hobbies: [] as string[],
    pricePerHour: "",
    serviceType: [] as string[],
    rules: "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleHobby = (hobby: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter((h) => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
  };

  const toggleServiceType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: prev.serviceType.includes(type)
        ? prev.serviceType.filter((t) => t !== type)
        : [...prev.serviceType, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photoPreview) {
      toast({
        title: "Foto Profil Wajib",
        description: "Silakan upload foto profil kamu",
        variant: "destructive",
      });
      return;
    }

    if (formData.hobbies.length === 0) {
      toast({
        title: "Hobi Wajib Dipilih",
        description: "Pilih minimal satu hobi",
        variant: "destructive",
      });
      return;
    }

    if (formData.serviceType.length === 0) {
      toast({
        title: "Tipe Layanan Wajib",
        description: "Pilih minimal satu tipe layanan (online/offline)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Pendaftaran Talent Berhasil! 🎉",
      description: "Profil Anda sedang disiapkan",
    });

    setIsLoading(false);
    setTimeout(() => {
      navigate("/talent-dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-warm pt-20 md:pt-24 pb-24 md:pb-8">
      <div className="container max-w-2xl">
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <Card className="p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-orange">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Daftar sebagai Talent RentMate
            </h1>
            <p className="text-muted-foreground">
              Jadilah teman pendamping profesional dan dapatkan penghasilan tambahan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Foto Profil <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-2xl object-cover ring-4 ring-primary/20"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Upload foto profil yang jelas</p>
                  <p>Format: JPG, PNG (Maks. 5MB)</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Bio Singkat <span className="text-destructive">*</span>
              </label>
              <textarea
                className="w-full min-h-[100px] p-3 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ceritakan tentang dirimu... (misal: Halo! Aku suka ngobrol dan menemani jalan-jalan)"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Kota <span className="text-destructive">*</span>
              </label>
              <select
                className="w-full p-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                disabled={isLoading}
              >
                <option value="">Pilih kota</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Hobbies */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Hobi & Skill <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby) => (
                  <Badge
                    key={hobby}
                    variant={formData.hobbies.includes(hobby) ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => !isLoading && toggleHobby(hobby)}
                  >
                    {hobby}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Harga per Jam <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  Rp
                </span>
                <Input
                  type="number"
                  placeholder="150000"
                  className="pl-12"
                  value={formData.pricePerHour}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerHour: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Rekomendasi: Rp 100.000 - Rp 300.000 per jam
              </p>
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Tipe Layanan <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Card
                  hover
                  className={`p-4 cursor-pointer transition-all ${
                    formData.serviceType.includes("online")
                      ? "ring-2 ring-primary bg-accent"
                      : ""
                  }`}
                  onClick={() => !isLoading && toggleServiceType("online")}
                >
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Online</p>
                      <p className="text-xs text-muted-foreground">Video call, chat</p>
                    </div>
                  </div>
                </Card>
                <Card
                  hover
                  className={`p-4 cursor-pointer transition-all ${
                    formData.serviceType.includes("offline")
                      ? "ring-2 ring-primary bg-accent"
                      : ""
                  }`}
                  onClick={() => !isLoading && toggleServiceType("offline")}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Offline</p>
                      <p className="text-xs text-muted-foreground">Bertemu langsung</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Rules */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Rules / Batasan Pribadi
              </label>
              <textarea
                className="w-full min-h-[80px] p-3 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Contoh: Tidak menerima kontak fisik, hanya bertemu di tempat umum, dll."
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                disabled={isLoading}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 p-4 bg-accent rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Dengan mendaftar, saya menyetujui bahwa RentMate adalah platform
                teman pendamping <strong>non-seksual</strong> dan akan mematuhi
                semua aturan yang berlaku.
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Memproses Pendaftaran...</span>
                </div>
              ) : (
                "Kirim Pendaftaran Talent"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
