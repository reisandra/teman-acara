import { useState, useMemo } from "react";
import { SlidersHorizontal, Search, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TalentCard } from "@/components/TalentCard";
import { FilterModal } from "@/components/FilterModal";
import { talents } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Talents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    cities: [] as string[],
    hobbies: [] as string[],
    gender: "",
    minAge: 18,
    maxAge: 40,
  });

  const filteredTalents = useMemo(() => {
    let result = [...talents];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.city.toLowerCase().includes(query) ||
          t.skills.some((s) => s.toLowerCase().includes(query))
      );
    }

    // City filter
    if (filters.cities.length > 0) {
      result = result.filter((t) => filters.cities.includes(t.city));
    }

    // Hobby filter
    if (filters.hobbies.length > 0) {
      result = result.filter((t) =>
        t.skills.some((s) => filters.hobbies.includes(s))
      );
    }

    // Gender filter
    if (filters.gender) {
      result = result.filter((t) => t.gender === filters.gender);
    }

    // Age filter
    result = result.filter(
      (t) => t.age >= filters.minAge && t.age <= filters.maxAge
    );

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        result.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "price-high":
        result.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  const activeFiltersCount =
    filters.cities.length +
    filters.hobbies.length +
    (filters.gender ? 1 : 0) +
    (filters.minAge !== 18 || filters.maxAge !== 40 ? 1 : 0);

  const clearFilters = () => {
    setFilters({
      cities: [],
      hobbies: [],
      gender: "",
      minAge: 18,
      maxAge: 40,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-warm pt-20 md:pt-24 pb-24 md:pb-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Temukan <span className="text-gradient">Talent</span>
          </h1>
          <p className="text-muted-foreground">
            {filteredTalents.length} talent tersedia untuk menemani kamu
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari nama, kota, atau skill..."
              className="pl-12 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant={activeFiltersCount > 0 ? "default" : "outline"}
              className="gap-2 h-12"
              onClick={() => setFilterModalOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-primary-foreground text-primary">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-12">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
                <SelectItem value="price-low">Harga Terendah</SelectItem>
                <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                <SelectItem value="reviews">Review Terbanyak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
            {filters.cities.map((city) => (
              <Badge key={city} variant="secondary" className="gap-1 pr-1">
                {city}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      cities: filters.cities.filter((c) => c !== city),
                    })
                  }
                  className="ml-1 p-0.5 hover:bg-muted rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.hobbies.map((hobby) => (
              <Badge key={hobby} variant="secondary" className="gap-1 pr-1">
                {hobby}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      hobbies: filters.hobbies.filter((h) => h !== hobby),
                    })
                  }
                  className="ml-1 p-0.5 hover:bg-muted rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.gender && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {filters.gender}
                <button
                  onClick={() => setFilters({ ...filters, gender: "" })}
                  className="ml-1 p-0.5 hover:bg-muted rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Hapus Semua
            </Button>
          </div>
        )}

        {/* Talent Grid */}
        {filteredTalents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTalents.map((talent, index) => (
              <div
                key={talent.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TalentCard talent={talent} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tidak Ada Hasil</h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah filter atau kata kunci pencarian
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Reset Filter
            </Button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  );
}
