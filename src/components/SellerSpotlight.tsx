import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Star,
  PackageCheck,
  CheckCircle2,
  ExternalLink,
  Award,
} from "lucide-react";
import { SELLER_SPOTLIGHTS } from "../data/mockData";

interface SellerSpotlightProps {
  onSelectSeller: (shopName: string) => void;
}

export const SellerSpotlight: React.FC<SellerSpotlightProps> = ({
  onSelectSeller,
}) => {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Verified Campus Merchants</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Top Student Sellers
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SELLER_SPOTLIGHTS.map((seller, idx) => (
          <motion.div
            key={seller.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl glass-card p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Badge & Rating */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {seller.badge}
                </span>

                <div className="flex items-center gap-1 text-sm font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{seller.rating}</span>
                  <span className="text-slate-400 font-semibold text-xs">({seller.reviewsCount})</span>
                </div>
              </div>

              {/* Seller Avatar & Title */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={seller.avatar}
                  alt={seller.owner}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
                    {seller.shopName}
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    {seller.owner} • {seller.hall}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                    {seller.faculty}
                  </p>
                </div>
              </div>

              {/* Specialty */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 mb-4">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Focus:</span>
                {seller.specialty}
              </div>
            </div>

            {/* Bottom Sales count & Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <PackageCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{seller.salesCount}+ Meetups</span>
              </div>

              <button
                onClick={() => onSelectSeller(seller.shopName)}
                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Items</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
