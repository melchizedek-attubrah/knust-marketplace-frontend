import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  Share2,
  ShieldCheck,
  MapPin,
  Star,
  CheckCircle2,
  MessageSquare,
  ZoomIn,
  ArrowRight,
  Eye,
  GraduationCap,
} from "lucide-react";
import type { Product } from "../types";
import { useAuth } from "../context/AuthContext";
import { SAFE_MEETUP_SPOTS } from "../data/mockData";
import confetti from "canvas-confetti";

interface ProductDetailModalProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onOpenChatWithSeller: (product: Product) => void;
  onSelectRelatedProduct: (product: Product) => void;
  onRequestMeetupSubmit?: (orderDetails: {
    productId: string;
    pickupPoint: string;
    meetupAt: string;
  }) => void;
  onShowAlert: (type: "success" | "error" | "info", msg: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts,
  onClose,
  onOpenChatWithSeller,
  onSelectRelatedProduct,
  onRequestMeetupSubmit,
  onShowAlert,
}) => {
  const { user, wishlist, toggleWishlist } = useAuth();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showMeetupModal, setShowMeetupModal] = useState(false);
  const [pickupSpot, setPickupSpot] = useState(SAFE_MEETUP_SPOTS[0].name);
  const [meetupDate, setMeetupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [meetupTime, setMeetupTime] = useState("14:30");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFavorited = wishlist.includes(product.id);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          {
            id: "img-default",
            productId: product.id,
            imageUrl:
              "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
          },
        ];

  const currentImageUrl = images[selectedImgIdx]?.imageUrl || images[0].imageUrl;

  const priceGhs = (product.price / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleCreateMeetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onShowAlert("info", "Please log in to request a campus meetup.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowMeetupModal(false);
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      if (onRequestMeetupSubmit) {
        onRequestMeetupSubmit({
          productId: product.id,
          pickupPoint: pickupSpot,
          meetupAt: `${meetupDate} at ${meetupTime}`,
        });
      }

      onShowAlert(
        "success",
        `Meetup requested at ${pickupSpot.split("(")[0]}!`,
      );
    }, 600);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowAlert("success", "Listing link copied!");
    } else {
      onShowAlert("info", "Link copied!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 p-6 sm:p-10"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              onClick={() => setIsZoomed((prev) => !prev)}
              className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-zoom-in group"
            >
              <img
                src={currentImageUrl}
                alt={product.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isZoomed ? "scale-150" : "group-hover:scale-105"
                }`}
              />

              <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-bold backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-4 h-4" />
                <span>{isZoomed ? "Click to reset" : "Click to zoom"}</span>
              </div>

              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
                  {product.badge || product.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
                  {product.condition === "NEW" ? "Brand New" : "Used"}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => {
                      setSelectedImgIdx(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative w-22 h-22 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                      selectedImgIdx === idx
                        ? "border-blue-600 ring-2 ring-blue-500/40 scale-105"
                        : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Safety Banner - Short & Readable */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-extrabold text-emerald-900 dark:text-emerald-200">
                  Campus In-Person Safety
                </p>
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  Inspect item in person before paying. No advance deposits.
                </p>
              </div>
            </div>
          </div>

          {/* Product Info & Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2 font-bold">
                <span className="text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  {product.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{product.location || "Campus Zone"}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  GH₵ {priceGhs}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                  Pay at Meetup
                </span>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
                  Listing Details
                </h4>
                <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Seller Box */}
              <div className="mt-6 p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-base">
                      {product.vendor?.shopName?.charAt(0) || "S"}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                        {product.vendor?.shopName || "Student Seller"}
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        {product.vendor?.user?.email || "Verified KNUST Student"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-black text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.sellerRating || 5.0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowMeetupModal(true)}
                  className="py-4 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/25 btn-primary-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Request Meetup</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenChatWithSeller(product);
                  }}
                  className="py-4 px-4 rounded-2xl bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Message Seller</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex-1 py-3 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isFavorited
                      ? "border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-600"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{isFavorited ? "Saved in Wishlist" : "Save to Wishlist"}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">
              Similar {product.category} Items
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedProduct(rel)}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3.5 cursor-pointer hover:border-blue-500/50 transition-all group"
                >
                  <img
                    src={rel.images?.[0]?.imageUrl || currentImageUrl}
                    alt={rel.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600">
                      {rel.title}
                    </p>
                    <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">
                      GH₵ {(rel.price / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {rel.location || "Campus"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Meetup Submodal */}
      <AnimatePresence>
        {showMeetupModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMeetupModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-2xl z-20 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Choose Safe Meetup Spot</span>
                </h3>
                <button
                  onClick={() => setShowMeetupModal(false)}
                  className="p-1 rounded-full text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateMeetup} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Monitored Campus Location
                  </label>
                  <select
                    value={pickupSpot}
                    onChange={(e) => setPickupSpot(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-semibold dark:text-white"
                  >
                    {SAFE_MEETUP_SPOTS.map((spot) => (
                      <option key={spot.name} value={spot.name}>
                        {spot.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={meetupDate}
                      onChange={(e) => setMeetupDate(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-semibold dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={meetupTime}
                      onChange={(e) => setMeetupTime(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-semibold dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md btn-primary-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? "Sending Request..." : "Confirm & Send Request"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
