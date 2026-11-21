import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Tag,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import type { Product, ProductCondition } from "../types";
import { CATEGORIES, CAMPUS_LOCATIONS } from "../data/mockData";
import { ProductCard } from "./ProductCard";

interface MarketplaceViewProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  initialCategory?: string;
  initialSearch?: string;
  initialLocation?: string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  onOpenProduct,
  initialCategory = "All",
  initialSearch = "",
  initialLocation = "All Campus Zones",
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | "ALL">("ALL");
  const [selectedAudience, setSelectedAudience] = useState<"ALL" | "STUDENTS" | "LECTURERS" | "CAMPUS_BUSINESS">("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [sortOrder, setSortOrder] = useState<"newest" | "price_asc" | "price_desc" | "rating" | "popular">("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const audienceTabs = [
    { id: "ALL", label: "All Items" },
    { id: "STUDENTS", label: "Student Listings" },
    { id: "CAMPUS_BUSINESS", label: "Campus Shops" },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchLocation = (p.location || "").toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCategory && !matchLocation) return false;
        }

        if (selectedCategory !== "All" && p.category !== selectedCategory) {
          return false;
        }

        if (selectedLocation !== "All Campus Zones" && p.location !== selectedLocation) {
          return false;
        }

        if (selectedCondition !== "ALL" && p.condition !== selectedCondition) {
          return false;
        }

        if (selectedAudience !== "ALL") {
          if (p.targetAudience && p.targetAudience !== "ALL" && p.targetAudience !== selectedAudience) {
            return false;
          }
        }

        if (verifiedOnly && !p.sellerVerified) {
          return false;
        }

        const priceCedi = p.price / 100;
        if (priceCedi > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "price_asc") return a.price - b.price;
        if (sortOrder === "price_desc") return b.price - a.price;
        if (sortOrder === "rating") return (b.sellerRating || 0) - (a.sellerRating || 0);
        if (sortOrder === "popular") return (b.viewsCount || 0) - (a.viewsCount || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    products,
    search,
    selectedCategory,
    selectedLocation,
    selectedCondition,
    selectedAudience,
    verifiedOnly,
    maxPrice,
    sortOrder,
  ]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedLocation("All Campus Zones");
    setSelectedCondition("ALL");
    setSelectedAudience("ALL");
    setVerifiedOnly(false);
    setMaxPrice(12000);
    setSortOrder("newest");
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Target Audience Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          {audienceTabs.map((tab) => {
            const isActive = selectedAudience === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedAudience(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Filters & Zones</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="rounded-3xl glass-card p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <span>Filters</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Search Items
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Title, seller, keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Categories
              </label>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs font-bold text-slate-400">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Campus Location */}
            <div>
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Campus Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="dark:bg-slate-900">
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Condition
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                {(["ALL", "NEW", "USED"] as const).map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`py-2 rounded-lg text-xs font-bold capitalize transition-colors ${
                      selectedCondition === cond
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {cond === "ALL" ? "All" : cond === "NEW" ? "New" : "Used"}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Max Price
                </label>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                  GH₵ {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="12000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Verified Sellers Toggle */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Verified Sellers Only
                </span>
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedCategory === "All" ? "All Items" : selectedCategory}
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Showing <span className="font-black text-blue-600 dark:text-blue-400">{filteredProducts.length}</span> campus listings
              </p>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Sort by:</span>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="pl-3.5 pr-8 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white appearance-none focus:outline-none shadow-sm cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={onOpenProduct}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="rounded-3xl glass-card p-12 text-center border border-slate-200 dark:border-slate-800 mt-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-2">
                No listings found
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Try clearing or loosening your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-sm shadow-md"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="relative w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full p-6 overflow-y-auto shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-sm font-bold block mb-2 dark:text-white">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-semibold dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-bold block mb-2 dark:text-white">Campus Zone</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-semibold dark:text-white"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-md"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
