import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  ShoppingBag,
  Sparkles,
  Heart,
  MessageSquare,
  Sun,
  Moon,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  Store,
  Compass,
  Package,
  Layers,
  ShieldCheck,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export type NavTab = "landing" | "marketplace" | "vendor" | "orders" | "profile" | "admin";

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth: (mode: "login" | "register") => void;
  onOpenChat: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenChat,
  unreadCount = 2,
}) => {
  const {
    user,
    isGuest,
    isAdmin,
    isVendor,
    logout,
    showLoginScreen,
    isDarkMode,
    toggleDarkMode,
    wishlist,
    switchDemoUser,
    availableDemoUsers,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: "landing", label: "Home", icon: Compass },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "vendor", label: "Sell", icon: Store },
    { id: "orders", label: "Orders", icon: Package },
    { id: "profile", label: "Profile", icon: UserIcon },
    ...(isAdmin ? [{ id: "admin", label: "Admin Panel", icon: Layers }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-colors duration-300">
      {/* Top Banner - Clear & Crisp */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-600 text-white text-xs sm:text-sm font-semibold py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span>KNUST Campus Marketplace</span>
            <span className="hidden sm:inline text-white/85">• Safe meetups at Library & Halls</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-white/95">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Free for Students
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onSelectTab("landing");
            setMobileMenuOpen(false);
          }}
          className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <img
              src="/images/knust-crest.jpg"
              alt="KNUST Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">
                KNUST<span className="text-blue-600 dark:text-blue-400">Hub</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                CAMPUS
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              Campus Marketplace
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavTab)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "text-blue-700 dark:text-white"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-700"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Wishlist Button */}
          <button
            onClick={() => onSelectTab("profile")}
            title="Saved Wishlist"
            className="relative p-3 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shadow">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Chat Messages Drawer Trigger */}
          <button
            onClick={onOpenChat}
            title="Campus Chat"
            className="relative p-3 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
            className="p-3 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform active:rotate-45"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* User Account / Profile Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {user.fullName.split(" ")[0]}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-80 rounded-3xl glass-card shadow-2xl p-5 z-50 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                      {user.avatarUrl && (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500"
                        />
                      )}
                      <div className="overflow-hidden">
                        <p className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {user.hallOrHostel || "Unity Hall"}
                        </span>
                      </div>
                    </div>

                    {/* Switch Account */}
                    <div className="py-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Switch Account
                      </p>
                      <div className="space-y-1.5">
                        {availableDemoUsers.map((demo) => (
                          <button
                            key={demo.id}
                            onClick={() => {
                              switchDemoUser(demo.id);
                              setProfileDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              user.id === demo.id
                                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span>{demo.fullName}</span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {demo.isSeller ? "Seller" : "Buyer"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <button
                        onClick={() => {
                          onSelectTab("profile");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" /> Profile & Wishlist
                      </button>
                      <button
                        onClick={() => {
                          onSelectTab("vendor");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Store className="w-4 h-4 text-slate-400" /> Sell Item
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={showLoginScreen}
                className="px-5 py-2.5 rounded-full text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4 space-y-2"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id as NavTab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
