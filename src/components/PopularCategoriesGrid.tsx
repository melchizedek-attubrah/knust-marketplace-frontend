import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Laptop,
  Home,
  Wrench,
  Shirt,
  Coffee,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES } from "../data/mockData";

interface PopularCategoriesGridProps {
  onSelectCategory: (categoryId: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  All: LayoutGrid,
  Textbooks: BookOpen,
  Electronics: Laptop,
  Accommodations: Home,
  Services: Wrench,
  Fashion: Shirt,
  Essentials: Coffee,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; darkBg: string }> = {
  Textbooks: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", darkBg: "dark:bg-blue-900/30" },
  Electronics: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", darkBg: "dark:bg-indigo-900/30" },
  Accommodations: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", darkBg: "dark:bg-emerald-900/30" },
  Services: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", darkBg: "dark:bg-amber-900/30" },
  Fashion: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", darkBg: "dark:bg-rose-900/30" },
  Essentials: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", darkBg: "dark:bg-purple-900/30" },
};

export const PopularCategoriesGrid: React.FC<PopularCategoriesGridProps> = ({
  onSelectCategory,
}) => {
  const displayCategories = CATEGORIES.filter((c) => c.id !== "All");

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Explore Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Browse by Department
          </h2>
        </div>

        <button
          onClick={() => onSelectCategory("All")}
          className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 group self-end sm:self-auto cursor-pointer"
        >
          <span>View all listings</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {displayCategories.map((cat, idx) => {
          const IconComponent = CATEGORY_ICONS[cat.id] || BookOpen;
          const styling = CATEGORY_COLORS[cat.id] || {
            bg: "bg-blue-500/10",
            text: "text-blue-600",
            darkBg: "dark:bg-blue-900/30",
          };

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(cat.id)}
              className="cursor-pointer rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${styling.bg} ${styling.darkBg} ${styling.text} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-inner`}
              >
                <IconComponent className="w-8 h-8" />
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h3>

              <span className="mt-1 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                {cat.count} items
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
