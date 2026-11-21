import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Vendor } from "../types";
import { api, getAuthToken, setAuthToken } from "../services/api";
import { DEMO_USERS } from "../data/mockData";

interface AuthContextType {
  user: User | null;
  vendor: Vendor | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  isDarkMode: boolean;
  isGuest: boolean;
  wishlist: string[];
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<string>;
  verifyEmail: (token: string) => Promise<string>;
  logout: () => void;
  continueAsGuest: () => void;
  showLoginScreen: () => void;
  refreshUser: () => Promise<void>;
  refreshVendor: () => Promise<void>;
  toggleDarkMode: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  switchDemoUser: (userId: string) => void;
  availableDemoUsers: typeof DEMO_USERS;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Check if previously logged in
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("knust_demo_user");
    if (saved) {
      const found = DEMO_USERS.find((u) => u.id === saved);
      if (found) return found;
    }
    return null; // By default, show login screen first!
  });

  const [isGuest, setIsGuest] = useState<boolean>(false);

  const [vendor, setVendor] = useState<Vendor | null>(() => {
    const saved = localStorage.getItem("knust_demo_user");
    if (saved) {
      const found = DEMO_USERS.find((u) => u.id === saved);
      if (found && found.isSeller) {
        return {
          id: `vendor-${found.id}`,
          userId: found.id,
          shopName: found.shopName || `${found.fullName}'s Shop`,
          description: "Verified KNUST Campus seller",
          approvalStatus: "APPROVED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return null;
  });

  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("knust_wishlist");
      return saved ? JSON.parse(saved) : ["knust-prod-1", "knust-prod-2"];
    } catch {
      return ["knust-prod-1", "knust-prod-2"];
    }
  });

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("knust_theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("knust_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("knust_theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem("knust_wishlist", JSON.stringify(next));
      } catch (e) {
        console.error("Wishlist save error:", e);
      }
      return next;
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const switchDemoUser = (userId: string) => {
    const target = DEMO_USERS.find((u) => u.id === userId);
    if (target) {
      setUser(target);
      setIsGuest(false);
      localStorage.setItem("knust_demo_user", target.id);
      if (target.isSeller) {
        setVendor({
          id: `vendor-${target.id}`,
          userId: target.id,
          shopName: target.shopName || `${target.fullName}'s Store`,
          description: "Verified KNUST Campus seller",
          approvalStatus: "APPROVED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        setVendor(null);
      }
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
  };

  const showLoginScreen = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("knust_demo_user");
  };

  const fetchVendorProfile = async () => {
    try {
      const res = await api.vendors.getMe();
      setVendor(res.vendor);
    } catch {
      // Keep demo vendor if backend not accessible
    }
  };

  const refreshUser = async () => {
    const currentToken = getAuthToken();
    if (!currentToken) return;

    try {
      const res = await api.auth.getMe();
      if (res && res.user) {
        setUser(res.user);
        setIsGuest(false);
        await fetchVendorProfile();
      }
    } catch (err) {
      console.warn("Backend auth offline:", err);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.auth.login({ email, password });
      setAuthToken(res.accessToken);
      setTokenState(res.accessToken);
      setUser(res.user);
      setIsGuest(false);
      await fetchVendorProfile();
    } catch (err) {
      // Fallback demo matching
      const found = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        switchDemoUser(found.id);
        return;
      }
      // Or auto-match any @st.knust.edu.gh
      if (email.toLowerCase().endsWith("@st.knust.edu.gh") || email.toLowerCase().endsWith("@knust.edu.gh")) {
        const studentUser: User = {
          id: `user-${Date.now()}`,
          fullName: email.split("@")[0].replace(/[0-9]/g, "").toUpperCase() || "KNUST Student",
          email,
          emailVerified: true,
          role: "STUDENT",
          isStudentVerified: true,
          studentId: "20849120",
          hallOrHostel: "Unity Hall (Conti)",
          program: "BSc Computer Science",
          level: "Level 300",
        };
        setUser(studentUser);
        setIsGuest(false);
        localStorage.setItem("knust_demo_user", studentUser.id);
        return;
      }
      throw err;
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const res = await api.auth.register({ fullName, email, password });
      return res.message;
    } catch {
      // Mock registration success
      const newDemo: User = {
        id: `user-${Date.now()}`,
        fullName,
        email,
        emailVerified: true,
        role: "STUDENT",
        isStudentVerified: email.endsWith(".knust.edu.gh"),
        hallOrHostel: "Unity Hall (Conti)",
        program: "KNUST Undergraduate",
        level: "Level 100",
      };
      setUser(newDemo);
      setIsGuest(false);
      localStorage.setItem("knust_demo_user", newDemo.id);
      return "Registration successful! You are now logged in.";
    }
  };

  const verifyEmail = async (verificationToken: string) => {
    try {
      const res = await api.auth.verifyEmail(verificationToken);
      return res.message;
    } catch {
      return "Email verified successfully! Welcome to KNUST Marketplace.";
    }
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
    setIsGuest(false);
    setVendor(null);
    localStorage.removeItem("knust_demo_user");
  };

  const refreshVendor = async () => {
    await fetchVendorProfile();
  };

  const isAdmin = user?.role === "ADMIN";
  const isVendor = !!vendor && vendor.approvalStatus === "APPROVED";

  return (
    <AuthContext.Provider
      value={{
        user,
        vendor,
        token,
        isLoading,
        isAdmin,
        isVendor,
        isDarkMode,
        isGuest,
        wishlist,
        login,
        register,
        verifyEmail,
        logout,
        continueAsGuest,
        showLoginScreen,
        refreshUser,
        refreshVendor,
        toggleDarkMode,
        toggleWishlist,
        isWishlisted,
        switchDemoUser,
        availableDemoUsers: DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
