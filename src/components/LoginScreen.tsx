import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LogIn,
  UserPlus,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LoginScreen: React.FC = () => {
  const { login, register, continueAsGuest, isDarkMode, toggleDarkMode } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch {
      setErrorMsg("Unable to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.endsWith("@st.knust.edu.gh") && !trimmed.endsWith("@knust.edu.gh")) {
      setErrorMsg("Must use a KNUST email (@st.knust.edu.gh or @knust.edu.gh).");
      return;
    }

    setIsLoading(true);
    try {
      await register(fullName.trim(), trimmed, password);
    } catch {
      setErrorMsg("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillSampleLogin = () => {
    setEmail("kmensah14@st.knust.edu.gh");
    setPassword("password123");
    setErrorMsg(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* KNUST Campus Entrance Monument Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-[1.5px] opacity-25 dark:opacity-30 pointer-events-none transition-opacity duration-300"
        style={{ backgroundImage: `url('/images/knust-campus-entrance.jpg')` }}
      />
      {/* Cinematic Responsive Tint & Blur Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/85 via-white/80 to-slate-100/90 dark:from-slate-950/90 dark:via-slate-950/85 dark:to-slate-950/95 backdrop-blur-[2px] pointer-events-none transition-colors duration-300" />

      {/* Top Bar */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <img
              src="/images/knust-crest.jpg"
              alt="KNUST Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              KNUST<span className="text-blue-600 dark:text-blue-400">Hub</span>
            </span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Campus Marketplace
            </p>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      {/* Main Centered Authentication Card */}
      <div className="relative z-10 max-w-lg w-full mx-auto my-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-2xl"
        >
          {/* Subtle Watermark of the KNUST Crest in Card Background */}
          <div
            className="absolute -right-10 -bottom-10 w-64 h-64 opacity-[0.04] dark:opacity-[0.06] pointer-events-none bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url('/images/knust-crest.jpg')` }}
          />

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
              <img
                src="/images/knust-crest.jpg"
                alt="KNUST Crest"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome to KNUST Hub
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Buy and sell safely on campus
            </p>
          </div>

          {/* Segmented Mode Selector: Simple Sign In vs Register */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-6 border border-slate-200 dark:border-slate-700 relative z-10">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMsg(null);
              }}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "login"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMsg(null);
              }}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "register"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-sm text-rose-600 dark:text-rose-300 font-semibold relative z-10">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 relative z-10">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                  KNUST Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kmensah14@st.knust.edu.gh"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={fillSampleLogin}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use sample student login</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 btn-primary-glow flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? "Signing in..." : "Sign In"}</span>
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4 relative z-10">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Kwame Mensah"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                  KNUST Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="username@st.knust.edu.gh"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 btn-primary-glow flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
              </button>
            </form>
          )}

          {/* Bottom Guest Option */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center relative z-10">
            <button
              onClick={continueAsGuest}
              className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue as Guest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer Note */}
      <div className="relative z-10 max-w-6xl w-full mx-auto text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-3">
        KNUST Marketplace • Kwame Nkrumah University of Science and Technology
      </div>
    </div>
  );
};
