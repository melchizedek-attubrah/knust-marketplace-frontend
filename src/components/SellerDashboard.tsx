import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Package,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Star,
  MapPin,
  Calendar,
  Clock,
  MessageSquare,
  ShieldCheck,
  X,
  Sparkles,
  BarChart3,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import type { Product, Order, ProductCondition } from "../types";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES, CAMPUS_LOCATIONS } from "../data/mockData";
import confetti from "canvas-confetti";

interface SellerDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (newProduct: Partial<Product>) => void;
  onUpdateProductStatus: (productId: string, status: "ACTIVE" | "SOLD") => void;
  onDeleteProduct: (productId: string) => void;
  onOpenChatWithBuyer: (buyerName: string) => void;
  onShowAlert: (type: "success" | "error" | "info", msg: string) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProductStatus,
  onDeleteProduct,
  onOpenChatWithBuyer,
  onShowAlert,
}) => {
  const { user, vendor } = useAuth();
  const [activeTab, setActiveTab] = useState<"listings" | "orders" | "analytics">("listings");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Listing Form State
  const [title, setTitle] = useState("");
  const [priceGhs, setPriceGhs] = useState("");
  const [category, setCategory] = useState("Textbooks");
  const [location, setLocation] = useState<string>(CAMPUS_LOCATIONS[2]);
  const [condition, setCondition] = useState<ProductCondition>("USED");
  const [targetAudience, setTargetAudience] = useState<"STUDENTS" | "LECTURERS" | "CAMPUS_BUSINESS" | "ALL">("STUDENTS");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80");

  // Sample Sales Chart Data
  const monthlyData = [
    { month: "Aug", sales: 1200, count: 6 },
    { month: "Sep", sales: 3400, count: 14 },
    { month: "Oct", sales: 4800, count: 20 },
    { month: "Nov", sales: 6200, count: 28 },
    { month: "Dec", sales: 2900, count: 11 },
  ];

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceGhs) {
      onShowAlert("error", "Please fill in title and price.");
      return;
    }

    const priceInPesewas = Math.round(parseFloat(priceGhs) * 100);

    onAddProduct({
      title,
      price: priceInPesewas,
      category,
      condition,
      location,
      targetAudience,
      description,
      status: "ACTIVE",
      sellerVerified: true,
      sellerRating: 4.9,
      sellerReviewCount: 1,
      images: [
        {
          id: `img-${Date.now()}`,
          productId: `p-${Date.now()}`,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        },
      ],
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    onShowAlert("success", `Listing "${title}" published live on campus!`);
    setShowAddModal(false);
    setTitle("");
    setPriceGhs("");
    setDescription("");
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Seller Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Seller Hub & Studio
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified Student Merchant
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Shop: <span className="font-bold text-slate-700 dark:text-slate-200">{vendor?.shopName || "Kwame's Scholar Shelf"}</span> • Unity Hall (Conti) • College of Engineering
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 btn-primary-glow flex items-center gap-2 cursor-pointer transition-all self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Campus Listing</span>
        </button>
      </div>

      {/* 4 Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="rounded-3xl glass-card p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Total Sales Value</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            GH₵ 12,450.00
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% from last semester</span>
          </div>
        </div>

        {/* Active Listings */}
        <div className="rounded-3xl glass-card p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Active Listings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {products.length} Items Live
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            0% listing fees for students
          </p>
        </div>

        {/* Orders Completed */}
        <div className="rounded-3xl glass-card p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Orders & Meetups</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {orders.length + 31} Completed
          </p>
          <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            100% In-Person Safe Meetup Rate
          </p>
        </div>

        {/* Seller Rating */}
        <div className="rounded-3xl glass-card p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Campus Reputation</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              4.9 / 5.0
            </span>
            <span className="text-xs text-slate-400">(42 peer reviews)</span>
          </div>
          <p className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">
            Top 5% Student Merchant
          </p>
        </div>
      </div>

      {/* Interactive Sales & Revenue Chart */}
      <div className="rounded-3xl glass-card p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Revenue Trend by Semester Month</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Income generated through campus textbook and gadget exchanges (GH₵)
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            Semester 1 (2026)
          </span>
        </div>

        {/* CSS/SVG Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4 border-b border-slate-100 dark:border-slate-800">
          {monthlyData.map((d) => {
            const heightPercent = (d.sales / 7000) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip on Hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-lg">
                  GH₵ {d.sales} ({d.count} sales)
                </div>

                {/* Animated Bar */}
                <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800/80 rounded-t-2xl overflow-hidden h-40 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-xl group-hover:from-blue-500 group-hover:to-emerald-400 transition-colors"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2">
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dashboard Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "listings"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          My Listed Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Customer Meetup Orders ({orders.length})
        </button>
      </div>

      {/* VIEW: LISTINGS MANAGEMENT */}
      {activeTab === "listings" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => {
              const priceGhs = (p.price / 100).toFixed(2);
              const imgUrl = p.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80";

              return (
                <div
                  key={p.id}
                  className="rounded-3xl glass-card p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex gap-4 mb-3">
                    <img
                      src={imgUrl}
                      alt={p.title}
                      className="w-22 h-22 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                          {p.category}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            p.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {p.title}
                      </h4>
                      <p className="text-base font-black text-slate-900 dark:text-white mt-1">
                        GH₵ {priceGhs}
                      </p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" /> {p.location || "Campus"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        onUpdateProductStatus(
                          p.id,
                          p.status === "ACTIVE" ? "SOLD" : "ACTIVE",
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {p.status === "ACTIVE" ? "Mark as Sold" : "Reactivate"}
                    </button>

                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="rounded-3xl glass-card overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Order ID & Item</th>
                  <th className="px-6 py-4">Student Buyer</th>
                  <th className="px-6 py-4">Meetup Spot</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {ord.product?.title || "Course Material"}
                      </p>
                      <p className="text-[10px] text-slate-400">Order #{ord.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {ord.buyer?.fullName || "Student Buyer"}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        {ord.pickupPoint}
                      </p>
                      <p className="text-[10px] text-slate-400">{ord.meetupAt}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {ord.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onOpenChatWithBuyer(ord.buyer?.fullName || "Buyer")}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 flex items-center gap-1.5 ml-auto"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Listing Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl z-20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Post Campus Listing</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Listing Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Casio FX-991EX Calculator / Hall 7 Bedframe"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Price (GH₵)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 250"
                      value={priceGhs}
                      onChange={(e) => setPriceGhs(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium dark:text-white"
                    >
                      {CATEGORIES.filter((c) => c.id !== "All").map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Pickup Campus Zone
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium dark:text-white"
                    >
                      {CAMPUS_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium dark:text-white"
                    >
                      <option value="USED">Used Condition</option>
                      <option value="NEW">Brand New</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Description & Coursework Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention edition, course code, condition, accessories included..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium dark:text-white"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 btn-primary-glow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Publish Listing Instantly</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
