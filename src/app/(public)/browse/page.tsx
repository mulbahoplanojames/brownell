"use client";

import { useState, useMemo } from "react";
import { PuppyCard } from "@/components/puppy-card";
import { mockPuppies, popularBreeds } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [ageRange, setAgeRange] = useState([0, 16]);
  const [sortBy, setSortBy] = useState("newest");

  const filteredPuppies = useMemo(() => {
    let filtered = [...mockPuppies];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (puppy) =>
          puppy.name.toLowerCase().includes(query) ||
          puppy.breed.toLowerCase().includes(query) ||
          puppy.location.toLowerCase().includes(query)
      );
    }

    // Breed filter
    if (selectedBreeds.length > 0) {
      filtered = filtered.filter((puppy) =>
        selectedBreeds.includes(puppy.breed)
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((puppy) => selectedSizes.includes(puppy.size));
    }

    // Gender filter
    if (selectedGenders.length > 0) {
      filtered = filtered.filter((puppy) =>
        selectedGenders.includes(puppy.gender)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (puppy) => puppy.price >= priceRange[0] && puppy.price <= priceRange[1]
    );

    // Age filter
    filtered = filtered.filter(
      (puppy) => puppy.age >= ageRange[0] && puppy.age <= ageRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "age-young":
        filtered.sort((a, b) => a.age - b.age);
        break;
      case "age-old":
        filtered.sort((a, b) => b.age - a.age);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return filtered;
  }, [
    searchQuery,
    selectedBreeds,
    selectedSizes,
    selectedGenders,
    priceRange,
    ageRange,
    sortBy,
  ]);

  const toggleBreed = (breed: string) => {
    setSelectedBreeds((prev) =>
      prev.includes(breed) ? prev.filter((b) => b !== breed) : [...prev, breed]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleGender = (gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBreeds([]);
    setSelectedSizes([]);
    setSelectedGenders([]);
    setPriceRange([0, 3000]);
    setAgeRange([0, 16]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedBreeds.length > 0 ||
    selectedSizes.length > 0 ||
    selectedGenders.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 3000 ||
    ageRange[0] !== 0 ||
    ageRange[1] !== 16;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Breed Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Breed</Label>
        <div className="space-y-2">
          {popularBreeds.map((breed) => (
            <div key={breed} className="flex items-center space-x-2">
              <Checkbox
                id={`breed-${breed}`}
                checked={selectedBreeds.includes(breed)}
                onCheckedChange={() => toggleBreed(breed)}
              />
              <label
                htmlFor={`breed-${breed}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {breed}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Size</Label>
        <div className="space-y-2">
          {["small", "medium", "large"].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={() => toggleSize(size)}
              />
              <label
                htmlFor={`size-${size}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
              >
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Gender</Label>
        <div className="space-y-2">
          {["male", "female"].map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={selectedGenders.includes(gender)}
                onCheckedChange={() => toggleGender(gender)}
              />
              <label
                htmlFor={`gender-${gender}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
              >
                {gender}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider
          min={0}
          max={3000}
          step={100}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
      </div>

      {/* Age Range */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Age: {ageRange[0]} - {ageRange[1]} weeks
        </Label>
        <Slider
          min={0}
          max={16}
          step={1}
          value={ageRange}
          onValueChange={setAgeRange}
          className="w-full"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="container mx-auto py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Browse Puppies
          </h1>
          <p className="text-muted-foreground">
            Find your perfect companion from our verified breeders
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by breed, name, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="age-young">Age: Youngest</SelectItem>
              <SelectItem value="age-old">Age: Oldest</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden bg-transparent">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {selectedBreeds.map((breed) => (
              <Button
                key={breed}
                variant="secondary"
                size="sm"
                onClick={() => toggleBreed(breed)}
                className="h-7 text-xs"
              >
                {breed}
                <X className="h-3 w-3 ml-1" />
              </Button>
            ))}
            {selectedSizes.map((size) => (
              <Button
                key={size}
                variant="secondary"
                size="sm"
                onClick={() => toggleSize(size)}
                className="h-7 text-xs capitalize"
              >
                {size}
                <X className="h-3 w-3 ml-1" />
              </Button>
            ))}
            {selectedGenders.map((gender) => (
              <Button
                key={gender}
                variant="secondary"
                size="sm"
                onClick={() => toggleGender(gender)}
                className="h-7 text-xs capitalize"
              >
                {gender}
                <X className="h-3 w-3 ml-1" />
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPuppies.length}{" "}
                {filteredPuppies.length === 1 ? "puppy" : "puppies"}
              </p>
            </div>

            {filteredPuppies.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPuppies.map((puppy) => (
                  <PuppyCard key={puppy.id} puppy={puppy} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No puppies found matching your criteria
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
