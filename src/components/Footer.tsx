import React from "react";
import {
  GraduationCap,
  ShieldCheck,
  MapPin,
  Heart,
  Sparkles,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      {/* Safety & Trust Pillars */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                Verified Student Identity
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
                Sellers are authenticated using their official KNUST student email.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                Safe Campus Meetup Points
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
                Meet at Prempeh II Library or Commercial Area under campus security.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                Inspect Before You Pay
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
                Check item condition in person before paying with cash or MoMo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-black text-xl text-slate-900 dark:text-white">
              KNUST<span className="text-blue-600">Hub</span>
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            The official university marketplace for KNUST students and faculty.
          </p>
        </div>

        <div>
          <h5 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Top Categories
          </h5>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 font-semibold">
            <li>Textbooks & Notes</li>
            <li>Laptops & Tech</li>
            <li>Calculators & Tools</li>
            <li>Ayeduase Hostels</li>
            <li>Lab Coats & Essentials</li>
          </ul>
        </div>

        <div>
          <h5 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Campus Zones
          </h5>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 font-semibold">
            <li>Prempeh II Main Library</li>
            <li>Commercial Area (Bank ATM)</li>
            <li>Brunei Complex & Hall 7</li>
            <li>Unity Hall (Conti)</li>
            <li>Ayeduase Gate</li>
          </ul>
        </div>

        <div>
          <h5 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Trust & Security
          </h5>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 font-semibold">
            <li>Student Verification</li>
            <li>Meetup Guidelines</li>
            <li>Report Concern</li>
            <li>CSM399 Capstone</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm font-semibold text-slate-500">
        © 2026 KNUST Marketplace. Kwame Nkrumah University of Science and Technology, Kumasi.
      </div>
    </footer>
  );
};
