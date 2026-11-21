import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Order, Product, ProductCondition } from "./types";
import { api } from "./services/api";
import { useAuth } from "./context/AuthContext";
import { Navbar, type NavTab } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import { PopularCategoriesGrid } from "./components/PopularCategoriesGrid";
import { SellerSpotlight } from "./components/SellerSpotlight";
import { CampusStats } from "./components/CampusStats";
import { CallToActionBanner } from "./components/CallToActionBanner";
import { MarketplaceView } from "./components/MarketplaceView";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { SellerDashboard } from "./components/SellerDashboard";
import { ProfileView } from "./components/ProfileView";
import { ChatDrawer } from "./components/ChatDrawer";
import { OrderStepper } from "./components/OrderStepper";
import { AuthModal } from "./components/AuthModal";
import { ReviewModal } from "./components/ReviewModal";
import { ReportModal } from "./components/ReportModal";
import { Footer } from "./components/Footer";
import { AlertBanner, type AlertMessage } from "./components/AlertBanner";
import { LoginScreen } from "./components/LoginScreen";
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from "./data/mockData";

export const App: React.FC = () => {
  const { user, isGuest } = useAuth();

  // Navigation Tab: default to "landing"
  const [currentTab, setCurrentTab] = useState<NavTab>("landing");

  // Global Toast Alert
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  // Products State (initialized with comprehensive KNUST dataset)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [marketplaceCategory, setMarketplaceCategory] = useState<string>("All");
  const [marketplaceSearch, setMarketplaceSearch] = useState<string>("");
  const [marketplaceLocation, setMarketplaceLocation] = useState<string>("All Campus Zones");

  // Orders State (initialized with realistic KNUST orders)
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetProduct, setChatTargetProduct] = useState<Product | null>(null);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | "verify" | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [reportTarget, setReportTarget] = useState<{ productId?: string; userId?: string } | null>(null);

  // Try fetching live backend products if available
  useEffect(() => {
    api.products
      .list({ limit: 50 })
      .then((res) => {
        if (res.data.products && res.data.products.length > 0) {
          // Merge backend products with mock data so full campus categories remain rich
          const backendIds = new Set(res.data.products.map((p) => p.id));
          const mockFiltered = INITIAL_PRODUCTS.filter((p) => !backendIds.has(p.id));
          setProducts([...res.data.products, ...mockFiltered]);
        }
      })
      .catch(() => {
        // Fallback already in place with INITIAL_PRODUCTS
      });
  }, []);

  // Handle Search from Hero
  const handleHeroSearch = (query: string, category: string, location: string) => {
    setMarketplaceSearch(query);
    setMarketplaceCategory(category);
    setMarketplaceLocation(location);
    setCurrentTab("marketplace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Quick Category Selection
  const handleSelectCategory = (categoryId: string) => {
    setMarketplaceCategory(categoryId);
    setMarketplaceSearch("");
    setCurrentTab("marketplace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Seller Spotlight Selection
  const handleSelectSeller = (shopName: string) => {
    setMarketplaceSearch(shopName);
    setCurrentTab("marketplace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add Product (from Seller Studio)
  const handleAddProduct = (newProductData: Partial<Product>) => {
    const newProd: Product = {
      id: `knust-prod-${Date.now()}`,
      vendorId: user?.id ? `vendor-${user.id}` : "vendor-1",
      title: newProductData.title || "Untitled Item",
      description: newProductData.description || "",
      price: newProductData.price || 5000,
      category: newProductData.category || "Textbooks",
      condition: newProductData.condition || "USED",
      status: "ACTIVE",
      location: newProductData.location || "Brunei Complex & Hall 7",
      sellerRating: 5.0,
      sellerReviewCount: 1,
      sellerVerified: true,
      isStudentSeller: true,
      viewsCount: 1,
      badge: "Newly Listed",
      targetAudience: newProductData.targetAudience || "STUDENTS",
      createdAt: new Date().toISOString(),
      vendor: {
        id: `vendor-${Date.now()}`,
        shopName: user?.fullName ? `${user.fullName}'s Shop` : "Kwame's Scholar Shelf",
        description: "Verified KNUST student seller",
        user: {
          id: user?.id || "u-new",
          fullName: user?.fullName || "Kwame Mensah",
          email: user?.email || "student@st.knust.edu.gh",
          isStudentVerified: true,
        },
      },
      images: newProductData.images || [
        {
          id: `img-${Date.now()}`,
          productId: `knust-prod-${Date.now()}`,
          imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        },
      ],
    };

    setProducts((prev) => [newProd, ...prev]);
  };

  // Update Product Status
  const handleUpdateProductStatus = (productId: string, status: "ACTIVE" | "SOLD") => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status } : p)),
    );
    showAlert("success", `Listing marked as ${status.toLowerCase()}.`);
  };

  // Delete Product
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showAlert("info", "Listing removed from campus marketplace.");
  };

  // Handle Safe Meetup Request (Creates Order in tracking)
  const handleMeetupRequestSubmit = (details: {
    productId: string;
    pickupPoint: string;
    meetupAt: string;
  }) => {
    const target = products.find((p) => p.id === details.productId);
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerId: user?.id || "user-kofi",
      vendorId: target?.vendorId || "vendor-1",
      productId: details.productId,
      pickupPoint: details.pickupPoint,
      meetupAt: details.meetupAt,
      buyerConfirmedMeetup: false,
      vendorConfirmedMeetup: false,
      status: "REQUESTED",
      paymentMethod: "IN_PERSON",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buyer: {
        id: user?.id || "user-kofi",
        fullName: user?.fullName || "Kofi Boateng",
        email: user?.email || "kboateng88@st.knust.edu.gh",
        isStudentVerified: true,
      },
      vendor: target?.vendor,
      product: target,
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  // Show Login Screen before anything else
  if (!user && !isGuest) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Global Alert Notification */}
      <AlertBanner alert={alert} onClose={() => setAlert(null)} />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onOpenChat={() => {
          setChatTargetProduct(null);
          setIsChatOpen(true);
        }}
        unreadCount={2}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: LANDING PAGE */}
        {currentTab === "landing" && (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <Hero
              onSearch={handleHeroSearch}
              onExplore={() => {
                setCurrentTab("marketplace");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onStartSelling={() => {
                setCurrentTab("vendor");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />

            {/* Featured Deals Carousel */}
            <FeaturedCarousel
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onViewAll={() => {
                setCurrentTab("marketplace");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />

            {/* Popular Categories Grid */}
            <PopularCategoriesGrid
              onSelectCategory={handleSelectCategory}
            />

            {/* Seller Spotlight Cards */}
            <SellerSpotlight
              onSelectSeller={handleSelectSeller}
            />

            {/* Campus Impact Statistics (Count-up) */}
            <CampusStats />

            {/* Call To Action Banner */}
            <CallToActionBanner
              onStartSelling={() => {
                setCurrentTab("vendor");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onExplore={() => {
                setCurrentTab("marketplace");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </motion.div>
        )}

        {/* VIEW 2: MARKETPLACE PAGE */}
        {currentTab === "marketplace" && (
          <motion.div
            key="marketplace-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MarketplaceView
              products={products}
              onOpenProduct={(p) => setSelectedProduct(p)}
              initialCategory={marketplaceCategory}
              initialSearch={marketplaceSearch}
              initialLocation={marketplaceLocation}
            />
          </motion.div>
        )}

        {/* VIEW 3: SELLER DASHBOARD */}
        {currentTab === "vendor" && (
          <motion.div
            key="seller-dashboard-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SellerDashboard
              products={products}
              orders={orders}
              onAddProduct={handleAddProduct}
              onUpdateProductStatus={handleUpdateProductStatus}
              onDeleteProduct={handleDeleteProduct}
              onOpenChatWithBuyer={(buyerName) => {
                setIsChatOpen(true);
              }}
              onShowAlert={showAlert}
            />
          </motion.div>
        )}

        {/* VIEW 4: ORDERS & TRACKING */}
        {currentTab === "orders" && (
          <motion.div
            key="orders-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Order Tracking & Campus Escrow
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Track your meetup progress step-by-step from request to inspection and completion.
              </p>
            </div>

            <div className="space-y-6">
              {orders.map((ord) => (
                <OrderStepper
                  key={ord.id}
                  order={ord}
                  onRefresh={() => {}}
                  onOpenReview={(o) => setReviewOrder(o)}
                  onOpenReport={(pId, uId) => setReportTarget({ productId: pId, userId: uId })}
                  onShowAlert={showAlert}
                  onOpenChat={() => setIsChatOpen(true)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* VIEW 5: STUDENT PROFILE PAGE */}
        {currentTab === "profile" && (
          <motion.div
            key="profile-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileView
              products={products}
              orders={orders}
              onOpenProduct={(p) => setSelectedProduct(p)}
              onRefreshOrders={() => {}}
              onOpenReview={(o) => setReviewOrder(o)}
              onOpenReport={(pId, uId) => setReportTarget({ productId: pId, userId: uId })}
              onShowAlert={showAlert}
              onOpenChat={() => setIsChatOpen(true)}
            />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Details Modal (Page 3) */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            allProducts={products}
            onClose={() => setSelectedProduct(null)}
            onOpenChatWithSeller={(p) => {
              setChatTargetProduct(p);
              setIsChatOpen(true);
            }}
            onSelectRelatedProduct={(rel) => setSelectedProduct(rel)}
            onRequestMeetupSubmit={handleMeetupRequestSubmit}
            onShowAlert={showAlert}
          />
        )}
      </AnimatePresence>

      {/* In-App Messaging Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        targetProduct={chatTargetProduct}
        onShowAlert={showAlert}
      />

      {/* Auth Modal (Login / Register / Demo Switcher) */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onShowAlert={showAlert}
        />
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <ReviewModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSuccess={() => {
            setReviewOrder(null);
            showAlert("success", "Review submitted! Thank you for supporting the campus community.");
          }}
          onShowAlert={showAlert}
        />
      )}

      {/* Safety Report Modal */}
      {reportTarget && (
        <ReportModal
          productId={reportTarget.productId}
          reportedUserId={reportTarget.userId}
          onClose={() => setReportTarget(null)}
          onShowAlert={showAlert}
        />
      )}
    </div>
  );
};
