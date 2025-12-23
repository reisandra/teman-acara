import { Link } from "react-router-dom";
import { MapPin, Star, Clock, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Talent } from "@/data/mockData";

interface TalentCardProps {
  talent: Talent;
}

export function TalentCard({ talent }: TalentCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card hover className="overflow-hidden group">
      <div className="relative">
        <img
          src={talent.photo}
          alt={talent.name}
          className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
        
        {talent.verified && (
          <div className="absolute top-3 right-3">
            <Badge variant="default" className="gap-1">
              <BadgeCheck className="w-3 h-3" />
              Terverifikasi
            </Badge>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg">{talent.name}</h3>
            <span className="text-sm opacity-80">{talent.age} thn</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
            <MapPin className="w-3 h-3" />
            <span>{talent.city}</span>
            <span className="mx-1">•</span>
            <Star className="w-3 h-3 fill-current text-amber-400" />
            <span>{talent.rating}</span>
            <span className="opacity-70">({talent.reviewCount})</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {talent.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs bg-primary-foreground/20 text-primary-foreground border-0">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-primary font-bold">
            <Clock className="w-4 h-4" />
            <span>{formatPrice(talent.pricePerHour)}</span>
            <span className="text-muted-foreground font-normal text-sm">/jam</span>
          </div>
          <Badge variant={talent.availability === "online" ? "accent" : talent.availability === "offline" ? "secondary" : "success"}>
            {talent.availability === "online" ? "Online" : talent.availability === "offline" ? "Offline" : "Online & Offline"}
          </Badge>
        </div>

        <Link to={`/talent/${talent.id}`}>
          <Button variant="outline" className="w-full">
            Lihat Profil
          </Button>
        </Link>
      </div>
    </Card>
  );
}
