import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  Star,
  ShieldCheck,
  Eye,
} from "lucide-react";
import type { Product } from "../types";
import { useAuth } from "../context/AuthContext";

interface ProductCardProps {
  product: Product;
  onOpen: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpen }) => {
  const { wishlist, toggleWishlist } = useAuth();
  const isFavorited = wishlist.includes(product.id);

  const priceGhs = (product.price / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const firstImage =
    product.images && product.images.length > 0
      ? product.images[0].imageUrl
      : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Product Image Area */}
      <div
        onClick={() => onOpen(product)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
      >
        <img
          src={firstImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
          {product.badge && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
              {product.badge}
            </span>
          )}
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${
              product.condition === "NEW"
                ? "bg-emerald-500 text-white"
                : "bg-slate-900/80 text-white"
            }`}
          >
            {product.condition === "NEW" ? "Brand New" : "Used"}
          </span>
        </div>

        {/* Wishlist Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3.5 right-3.5 p-3 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 backdrop-blur-md shadow-md focus:outline-none"
          aria-label="Save to wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorited ? "fill-rose-500 text-rose-500" : "hover:text-rose-500"
            }`}
          />
        </motion.button>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white shadow-xl flex items-center gap-2">
            <Eye className="w-4 h-4" /> Quick View
          </span>
        </div>
      </div>

      {/* Card Content - Clean, Readable, Big Text */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Location */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 font-semibold">
            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wide">
              {product.category}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="truncate max-w-[130px]">{product.location || "Campus"}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpen(product)}
            className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
          >
            {product.title}
          </h3>
        </div>

        {/* Bottom Price & Seller Row */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Price
            </span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              GH₵ {priceGhs}
            </p>
          </div>

          {/* Seller Info */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              <span className="truncate max-w-[100px]">
                {product.vendor?.shopName || "Student"}
              </span>
              {product.sellerVerified && (
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center justify-end gap-1 text-xs text-amber-500 font-bold mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.sellerRating || 5.0}</span>
              <span className="text-slate-400 font-medium">({product.sellerReviewCount || 12})</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
