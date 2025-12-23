import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  talentName: string;
  talentPhoto: string;
  bookingId: string;
  onSubmit: (rating: number, comment: string) => void;
}

export function RatingModal({
  isOpen,
  onClose,
  talentName,
  talentPhoto,
  bookingId,
  onSubmit,
}: RatingModalProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Wajib",
        description: "Silakan pilih rating bintang terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSubmit(rating, comment);
    
    toast({
      title: "Terima kasih atas penilaian Anda! 🎉",
      description: "Rating telah ditambahkan ke profil talent",
    });

    setIsSubmitting(false);
    setRating(0);
    setComment("");
    onClose();
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md p-6 animate-fade-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <img
            src={talentPhoto}
            alt={talentName}
            className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 ring-4 ring-primary/20"
          />
          <h2 className="text-xl font-bold">Beri Rating untuk</h2>
          <p className="text-primary font-semibold">{talentName}</p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="transition-transform hover:scale-110 focus:outline-none"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  star <= displayRating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Rating Display */}
        <div className="text-center mb-6">
          <span className="text-2xl font-bold text-primary">
            {displayRating > 0 ? displayRating : "-"}
          </span>
          <span className="text-muted-foreground"> dari 5</span>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {rating === 1 && "Sangat Buruk"}
              {rating === 2 && "Buruk"}
              {rating === 3 && "Cukup"}
              {rating === 4 && "Baik"}
              {rating === 5 && "Sangat Baik"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">
            Komentar (opsional)
          </label>
          <textarea
            className="w-full min-h-[100px] p-3 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Ceritakan pengalaman kamu bersama talent ini..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Mengirim...</span>
            </div>
          ) : (
            "Kirim Rating"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Rating tidak dapat diubah setelah dikirim
        </p>
      </Card>
    </div>
  );
}
