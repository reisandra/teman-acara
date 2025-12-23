import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  BadgeCheck,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { talents, reviews } from "@/data/mockData";

export default function TalentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const talent = talents.find((t) => t.id === id);
  const talentReviews = reviews.filter((r) => r.talentId === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!talent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Pendamping tidak ditemukan</h2>
          <Link to="/talents">
            <Button>Kembali ke Daftar Pendamping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [talent.photo, ...talent.gallery];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-32 md:pb-8">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-lg border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLiked(!liked)}
            >
              <Heart
                className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container pt-16 md:pt-24">
        {/* Desktop Back Button */}
        <div className="hidden md:block mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card">
              <img
                src={allImages[currentImageIndex]}
                alt={talent.name}
                className="w-full h-full object-cover"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-primary-foreground w-6"
                        : "bg-primary-foreground/50"
                    }`}
                  />
                ))}
              </div>

              {talent.verified && (
                <div className="absolute top-4 left-4">
                  <Badge className="gap-1">
                    <BadgeCheck className="w-4 h-4" />
                    Terverifikasi
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Talent Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{talent.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <span>{talent.age} tahun</span>
                    <span>•</span>
                    <span>{talent.gender}</span>
                  </div>
                </div>
                <div className="hidden md:flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart
                      className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{talent.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{talent.rating}</span>
                  <span className="text-muted-foreground">
                    ({talent.reviewCount} ulasan)
                  </span>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <Card className="p-6 bg-accent/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mulai dari</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(talent.pricePerHour)}
                    </span>
                    <span className="text-muted-foreground">/jam</span>
                  </div>
                </div>
                <Badge variant={talent.availability === "online" ? "accent" : talent.availability === "offline" ? "secondary" : "success"} className="text-sm px-4 py-2">
                  {talent.availability === "online" ? "Hanya Online" : talent.availability === "offline" ? "Hanya Offline" : "Online & Offline"}
                </Badge>
              </div>
            </Card>

            {/* Skills */}
            <div>
              <h3 className="font-semibold mb-3">Keahlian & Hobi</h3>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-4 py-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="font-semibold mb-3">Tentang Saya</h3>
              <p className="text-muted-foreground leading-relaxed">{talent.bio}</p>
            </div>

            {/* Rules */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Aturan & Preferensi
              </h3>
              <ul className="space-y-2">
                {talent.rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="hidden md:block">
              <Link to={`/booking/${talent.id}`}>
                <Button variant="hero" size="xl" className="w-full">
                  Pesan Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Ulasan */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Ulasan ({talentReviews.length})
          </h2>
          {talentReviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {talentReviews.map((review) => (
                <Card key={review.id} className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={review.userPhoto}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{review.userName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Belum ada ulasan</p>
            </Card>
          )}
        </div>
      </div>

      {/* Mobile Fixed CTA */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Mulai dari</p>
            <p className="text-xl font-bold text-primary">
              {formatPrice(talent.pricePerHour)}
              <span className="text-sm font-normal text-muted-foreground">/jam</span>
            </p>
          </div>
          <Link to={`/booking/${talent.id}`}>
            <Button variant="hero" size="lg">
              Pesan Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
