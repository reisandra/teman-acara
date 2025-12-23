import { useState } from "react";
import { X, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cities, hobbies } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    cities: string[];
    hobbies: string[];
    gender: string;
    minAge: number;
    maxAge: number;
  };
  onApply: (filters: FilterModalProps["filters"]) => void;
}

export function FilterModal({ isOpen, onClose, filters, onApply }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [citySearch, setCitySearch] = useState("");
  const [hobbySearch, setHobbySearch] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>("city");

  if (!isOpen) return null;

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredHobbies = hobbies.filter((hobby) =>
    hobby.toLowerCase().includes(hobbySearch.toLowerCase())
  );

  const toggleCity = (city: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter((c) => c !== city)
        : [...prev.cities, city],
    }));
  };

  const toggleHobby = (hobby: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter((h) => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({
      cities: [],
      hobbies: [],
      gender: "",
      minAge: 18,
      maxAge: 40,
    });
  };

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      onClick={() => setExpandedSection(expandedSection === section ? null : section)}
      className="flex items-center justify-between w-full py-3 font-semibold text-foreground"
    >
      {title}
      {expandedSection === section ? (
        <ChevronUp className="w-5 h-5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center">
        <div className="bg-card rounded-t-3xl md:rounded-2xl max-h-[85vh] md:max-h-[80vh] md:max-w-lg md:w-full overflow-hidden shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold">Filter Talent</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh] p-4 space-y-4">
            {/* City Filter */}
            <div className="border-b pb-4">
              <SectionHeader title="Kota" section="city" />
              {expandedSection === "city" && (
                <div className="space-y-3 animate-fade-in">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari kota..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <Badge
                        key={city}
                        variant={localFilters.cities.includes(city) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all",
                          localFilters.cities.includes(city) && "shadow-orange"
                        )}
                        onClick={() => toggleCity(city)}
                      >
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hobby Filter */}
            <div className="border-b pb-4">
              <SectionHeader title="Hobi & Skill" section="hobby" />
              {expandedSection === "hobby" && (
                <div className="space-y-3 animate-fade-in">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari hobi..."
                      value={hobbySearch}
                      onChange={(e) => setHobbySearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {filteredHobbies.map((hobby) => (
                      <Badge
                        key={hobby}
                        variant={localFilters.hobbies.includes(hobby) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all",
                          localFilters.hobbies.includes(hobby) && "shadow-orange"
                        )}
                        onClick={() => toggleHobby(hobby)}
                      >
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gender Filter */}
            <div className="border-b pb-4">
              <SectionHeader title="Jenis Kelamin" section="gender" />
              {expandedSection === "gender" && (
                <div className="flex gap-2 animate-fade-in">
                  {["", "Pria", "Wanita"].map((gender) => (
                    <Badge
                      key={gender || "all"}
                      variant={localFilters.gender === gender ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all px-4 py-2",
                        localFilters.gender === gender && "shadow-orange"
                      )}
                      onClick={() => setLocalFilters((prev) => ({ ...prev, gender }))}
                    >
                      {gender || "Semua"}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Age Filter */}
            <div>
              <SectionHeader title="Usia" section="age" />
              {expandedSection === "age" && (
                <div className="flex items-center gap-3 animate-fade-in">
                  <Input
                    type="number"
                    min={18}
                    max={60}
                    value={localFilters.minAge}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({ ...prev, minAge: Number(e.target.value) }))
                    }
                    className="w-20 text-center"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    min={18}
                    max={60}
                    value={localFilters.maxAge}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({ ...prev, maxAge: Number(e.target.value) }))
                    }
                    className="w-20 text-center"
                  />
                  <span className="text-muted-foreground text-sm">tahun</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-4 border-t bg-card">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="hero" className="flex-1" onClick={handleApply}>
              Terapkan Filter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
