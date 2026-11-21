import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  ShieldCheck,
  Heart,
  Package,
  Star,
  MapPin,
  GraduationCap,
  CheckCircle2,
  Lock,
  ExternalLink,
  Trash2,
  Calendar,
  Sparkles,
  Award,
} from "lucide-react";
import type { Product, Order } from "../types";
import { useAuth } from "../context/AuthContext";
import { SAFE_MEETUP_SPOTS } from "../data/mockData";
import { OrderStepper } from "./OrderStepper";

interface ProfileViewProps {
  products: Product[];
  orders: Order[];
  onOpenProduct: (product: Product) => void;
  onRefreshOrders: () => void;
  onOpenReview: (order: Order) => void;
  onOpenReport: (productId?: string, userId?: string) => void;
  onShowAlert: (type: "success" | "error" | "info", msg: string) => void;
  onOpenChat?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  products,
  orders,
  onOpenProduct,
  onRefreshOrders,
  onOpenReview,
  onOpenReport,
  onShowAlert,
  onOpenChat,
}) => {
  const { user, wishlist, toggleWishlist, switchDemoUser, availableDemoUsers } = useAuth();
  const [activeTab, setActiveTab] = useState<"wishlist" | "orders" | "verification" | "safety">("wishlist");

  // Filter wishlisted products
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // Buyer orders
  const myOrders = orders.filter((o) => o.buyerId === user?.id || !user);

  if (!user) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Sign In to Access Your Student Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Use your KNUST student credentials or switch to a demo role to view saved items and tracked orders.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Student Profile Header Card */}
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {user.fullName.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Verified KNUST Student
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
                {user.email} • ID: <span className="font-mono font-bold text-slate-900 dark:text-white">{user.studentId || "20849120"}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  {user.program || "BSc Mechanical Engineering"} ({user.level || "Level 400"})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {user.hallOrHostel || "Unity Hall (Conti)"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-center px-4 border-r border-slate-200 dark:border-slate-700">
              <span className="text-xs uppercase font-extrabold text-slate-400 block">Wishlist</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {wishlist.length}
              </span>
            </div>
            <div className="text-center px-4 border-r border-slate-200 dark:border-slate-700">
              <span className="text-xs uppercase font-extrabold text-slate-400 block">Orders</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {myOrders.length + 3}
              </span>
            </div>
            <div className="text-center px-4">
              <span className="text-xs uppercase font-extrabold text-slate-400 block">Trust</span>
              <div className="flex items-center gap-1 text-base font-black text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === "wishlist"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Saved Wishlist ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === "orders"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>My Orders & Tracking ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("verification")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === "verification"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Student ID Verification</span>
        </button>

        <button
          onClick={() => setActiveTab("safety")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === "safety"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Safe Meetup Zones</span>
        </button>
      </div>

      {/* TAB 1: SAVED WISHLIST */}
      {activeTab === "wishlist" && (
        <div>
          {wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => {
                const img = p.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80";
                return (
                  <div
                    key={p.id}
                    className="rounded-3xl glass-card p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
                        <img src={img} alt={p.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 shadow"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                        {p.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-0.5">
                        {p.title}
                      </h4>
                      <p className="text-base font-black text-slate-900 dark:text-white mt-1">
                        GH₵ {(p.price / 100).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => onOpenProduct(p)}
                      className="mt-4 w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View Details & Request Meetup</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl glass-card p-12 text-center border border-slate-200/80 dark:border-slate-800">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Click the heart icon on any product in the marketplace to save it for later.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ORDERS & TRACKING */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {myOrders.map((ord) => (
            <OrderStepper
              key={ord.id}
              order={ord}
              onRefresh={onRefreshOrders}
              onOpenReview={onOpenReview}
              onOpenReport={onOpenReport}
              onShowAlert={onShowAlert}
              onOpenChat={onOpenChat}
            />
          ))}
        </div>
      )}

      {/* TAB 3: STUDENT ID VERIFICATION */}
      {activeTab === "verification" && (
        <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 max-w-2xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                KNUST Institutional Verification Badge
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Identity Authenticated via @st.knust.edu.gh
              </p>
            </div>
          </div>

          {/* Official KNUST Student ID Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-800 via-indigo-900 to-slate-950 text-white shadow-2xl relative overflow-hidden border border-white/20">
            {/* Crest Watermark Background */}
            <div
              className="absolute -right-8 -bottom-8 w-60 h-60 opacity-15 pointer-events-none bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url('/images/knust-crest.jpg')` }}
            />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <span className="text-xs uppercase font-extrabold text-blue-200 tracking-wider">
                  KNUST Student Identity Card
                </span>
                <p className="text-xl font-black mt-1">{user.fullName}</p>
                <p className="text-sm font-semibold text-blue-200">{user.program}</p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-lg flex items-center justify-center flex-shrink-0">
                <img
                  src="/images/knust-crest.jpg"
                  alt="KNUST Crest"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex justify-between items-end text-sm text-blue-100 relative z-10 pt-4 border-t border-white/15">
              <div>
                <p className="text-xs text-blue-300 uppercase font-bold">Student Reference</p>
                <p className="font-mono font-black text-white text-base">{user.studentId || "20849120"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-300 uppercase font-bold">Hall of Residence</p>
                <p className="font-bold text-white text-base">{user.hallOrHostel || "Unity Hall"}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">
              Why Verification Matters:
            </p>
            <p className="leading-relaxed">
              Verified students enjoy zero listing limits, instant buyer trust badges, and access to peer meetup points across all campus zones.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: SAFE MEETUP ZONES */}
      {activeTab === "safety" && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-card p-6 border border-slate-200/80 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
              Official Monitored Campus Meetup Points
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              To prevent scams and guarantee physical safety, all transactions must take place at one of the following university locations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAFE_MEETUP_SPOTS.map((spot) => (
                <div
                  key={spot.name}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {spot.name}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {spot.safetyScore}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hours: <span className="font-semibold text-slate-700 dark:text-slate-300">{spot.hours}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {spot.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
