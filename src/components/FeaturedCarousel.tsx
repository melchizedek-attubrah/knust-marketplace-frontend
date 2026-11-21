import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  ArrowRight,
} from "lucide-react";
import type { Product } from "../types";
import { useAuth } from "../context/AuthContext";

interface FeaturedCarouselProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  products,
  onSelectProduct,
  onViewAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { wishlist, toggleWishlist } = useAuth();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const formatPrice = (pesewas: number) => {
    const cedis = pesewas / 100;
    return `GH₵ ${cedis.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header - Concise & Big Fonts */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Featured Listings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Top Deals on Campus
          </h2>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={onViewAll}
            className="ml-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.slice(0, 8).map((product, index) => {
          const isFavorited = wishlist.includes(product.id);
          const firstImage =
            product.images && product.images.length > 0
              ? product.images[0].imageUrl
              : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="flex-shrink-0 w-80 sm:w-88 snap-start group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Product Image Box */}
              <div
                onClick={() => onSelectProduct(product)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <img
                  src={firstImage}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Badge Tag */}
                <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-blue-700 dark:text-blue-300 backdrop-blur-md shadow-sm">
                    {product.badge || product.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
                    {product.condition === "NEW" ? "Brand New" : "Used"}
                  </span>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-3.5 right-3.5 p-3 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 backdrop-blur-md shadow-sm hover:scale-110 active:scale-90 transition-transform focus:outline-none"
                  aria-label="Save item"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFavorited ? "fill-rose-500 text-rose-500" : "hover:text-rose-500"
                    }`}
                  />
                </button>
              </div>

              {/* Product Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Location */}
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 font-semibold">
                    <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">
                      {product.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="truncate max-w-[130px]">{product.location || "Campus"}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {product.title}
                  </h3>
                </div>

                {/* Bottom Row: Price & Seller */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      Price
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  {/* Seller Snippet */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      <span>{product.vendor?.shopName?.split(" ")[0] || "Student"}</span>
                      {product.sellerVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-xs text-amber-500 font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.sellerRating || 5.0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
