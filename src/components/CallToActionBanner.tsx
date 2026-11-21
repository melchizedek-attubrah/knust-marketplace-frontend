import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface CallToActionBannerProps {
  onStartSelling: () => void;
  onExplore: () => void;
}

export const CallToActionBanner: React.FC<CallToActionBannerProps> = ({
  onStartSelling,
  onExplore,
}) => {
  const handleSellClick = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
    onStartSelling();
  };

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 sm:p-12 shadow-2xl">
        {/* KNUST Entrance Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 scale-105 pointer-events-none filter blur-[1px]"
          style={{ backgroundImage: `url('/images/knust-campus-entrance.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-indigo-900/90 to-slate-950/95 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs sm:text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Zero Fees for Students</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Have Textbooks or Tech to Sell?
          </h2>

          <p className="mt-3 text-base sm:text-lg text-blue-100 font-medium">
            List in under 60 seconds and meet buyers safely on campus.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-blue-100 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" /> Free Student Listings
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" /> Campus Library Meetups
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" /> Cash or MoMo on Spot
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={handleSellClick}
              className="px-8 py-4 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-black text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>List Your Item (Free)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onExplore}
              className="px-7 py-4 rounded-2xl bg-blue-800/70 hover:bg-blue-800 text-white font-bold text-base border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
            >
              Browse Items First
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
