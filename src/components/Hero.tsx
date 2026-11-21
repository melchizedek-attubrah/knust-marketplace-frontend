import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Tag,
} from "lucide-react";
import { CATEGORIES, CAMPUS_LOCATIONS } from "../data/mockData";

interface HeroProps {
  onSearch: (query: string, category: string, location: string) => void;
  onExplore: () => void;
  onStartSelling: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onExplore,
  onStartSelling,
}) => {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All Campus Zones");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, selectedCategory, selectedLocation);
  };

  const quickSearches = [
    { label: "Engineering Books", cat: "Textbooks" },
    { label: "MacBook & Laptops", cat: "Electronics" },
    { label: "Casio Calculators", cat: "Electronics" },
    { label: "Ayeduase Hostels", cat: "Accommodations" },
    { label: "Lab Coats", cat: "Essentials" },
  ];

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* KNUST Campus Entrance Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-25 scale-105 pointer-events-none filter blur-[1px]"
        style={{ backgroundImage: `url('/images/knust-campus-entrance.jpg')` }}
      />
      {/* Gradient & Mesh Overlays */}
      <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-white/75 dark:bg-slate-950/85 backdrop-blur-[1px] pointer-events-none" />

      {/* Decorative Floating Badges */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [-8, 10, -8], rotate: [0, 1.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex absolute top-12 right-[8%] glass-card rounded-2xl p-4 shadow-xl items-center gap-3 border border-white/60 dark:border-slate-700/60"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-left pr-2">
            <p className="font-bold text-sm text-slate-900 dark:text-white">Textbooks & Notes</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Save up to 60%</p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [8, -10, 8], rotate: [0, -1.5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden lg:flex absolute top-40 left-[6%] glass-card rounded-2xl p-4 shadow-xl items-center gap-3 border border-white/60 dark:border-slate-700/60"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-left pr-2">
            <p className="font-bold text-sm text-slate-900 dark:text-white">Verified Students</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">@st.knust.edu.gh</p>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100/80 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 text-sm font-bold shadow-sm mb-5"
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Official KNUST Student Marketplace</span>
        </motion.div>

        {/* Headline - Punchy & Crisp */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]"
        >
          Buy & Sell Safely Across{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            KNUST Campus
          </span>
        </motion.h1>

        {/* Subtitle - Short & Clear */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed"
        >
          Textbooks, electronics, and dorm essentials traded safely between verified students.
        </motion.p>

        {/* Large Accessible Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 max-w-4xl mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="glass-card p-3 sm:p-4 rounded-3xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-3 border border-white/90 dark:border-slate-700/80"
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <Search className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search books, MacBooks, calculators, rooms..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <Tag className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Campus Zone Dropdown */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <MapPin className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[160px] truncate"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 btn-primary-glow flex items-center justify-center gap-2 cursor-pointer transition-all flex-shrink-0"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </form>
        </motion.div>

        {/* Quick Search Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-semibold"
        >
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <TrendingUp className="w-4 h-4" /> Popular:
          </span>
          {quickSearches.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSearch(item.label, item.cat, "All Campus Zones")}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
            >
              {item.label}
            </button>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={onExplore}
            className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-base shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Browse Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onStartSelling}
            className="px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-base border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Sell an Item</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
