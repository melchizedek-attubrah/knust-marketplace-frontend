import React from "react";
import { motion, useInView } from "framer-motion";
import { Users, Coins, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { CAMPUS_STATS } from "../data/mockData";

const STAT_ICONS = [Users, Coins, ShieldCheck, MapPin];

export const CampusStats: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-sm font-bold mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Campus Numbers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            KNUST Impact at a Glance
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CAMPUS_STATS.map((stat, idx) => {
            const IconComponent = STAT_ICONS[idx] || Users;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-3xl bg-slate-800/80 backdrop-blur-md p-6 border border-slate-700/80 shadow-xl flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-4">
                  <IconComponent className="w-7 h-7" />
                </div>

                <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
                  {stat.value}
                </div>

                <p className="text-sm sm:text-base font-bold text-slate-300">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
