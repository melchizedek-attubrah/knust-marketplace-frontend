import React, { useEffect, useState } from "react";
import type { Order, Product, ProductCondition } from "../types";
import { api, ApiError } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { OrderStepper } from "./OrderStepper";

interface VendorViewProps {
  onShowAlert: (type: "success" | "error" | "info", msg: string) => void;
  onOpenReview: (order: Order) => void;
  onOpenReport: (productId?: string, userId?: string) => void;
}

export const VendorView: React.FC<VendorViewProps> = ({
  onShowAlert,
  onOpenReview,
  onOpenReport,
}) => {
  const { user, vendor, refreshVendor, isVendor } = useAuth();

  // Application form state
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Add Product form state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [prodTitle, setProdTitle] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPriceGhs, setProdPriceGhs] = useState("");
  const [prodCat, setProdCat] = useState("Textbooks");
  const [prodCond, setProdCond] = useState<ProductCondition>("USED");
  const [prodImages, setProdImages] = useState<File[]>([]);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Vendor's products & orders
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myVendorOrders, setMyVendorOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const loadVendorData = async () => {
    if (!isVendor || !vendor) return;
    setIsLoadingData(true);
    try {
      // Load products belonging to this vendor
      const prodRes = await api.products.list({ limit: 50 });
      const owned = prodRes.data.products.filter((p) => p.vendorId === vendor.id);
      setMyProducts(owned);

      // Load vendor's orders
      const orderRes = await api.orders.list({ limit: 50 });
      const vendorOrders = orderRes.data.orders.filter(
        (o) =>
          o.vendorId === vendor.id ||
          o.vendor?.userId === user?.id ||
          o.vendor?.user?.id === user?.id,
      );
      setMyVendorOrders(vendorOrders);
    } catch (err: any) {
      console.error("Failed to load vendor data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (vendor) {
      setShopName(vendor.shopName);
      setDescription(vendor.description);
      if (isVendor) {
        loadVendorData();
      }
    }
  }, [vendor, isVendor]);

  const handleApplyVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    try {
      await api.vendors.apply({ shopName, description });
      onShowAlert(
        "success",
        "Vendor application submitted! An admin will review and approve your shop.",
      );
      await refreshVendor();
    } catch (err: any) {
      onShowAlert("error", err instanceof ApiError ? err.message : "Application failed.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.vendors.updateMe({ shopName, description });
      onShowAlert("success", "Shop profile updated successfully.");
      await refreshVendor();
    } catch (err: any) {
      onShowAlert("error", err instanceof ApiError ? err.message : "Failed to update shop.");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(prodPriceGhs);
    if (isNaN(priceNum) || priceNum <= 0) {
      onShowAlert("error", "Please enter a valid price.");
      return;
    }
    const pricePesewas = Math.round(priceNum * 100);

    setIsCreatingProduct(true);
    try {
      const res = await api.products.create({
        title: prodTitle.trim(),
        description: prodDesc.trim(),
        price: pricePesewas,
        category: prodCat,
        condition: prodCond,
      });

      // If user selected image files, upload them
      if (prodImages.length > 0) {
        try {
          await api.products.uploadImages(res.product.id, prodImages);
        } catch (imgErr) {
          console.warn("Image upload failed, product created without images:", imgErr);
        }
      }

      onShowAlert("success", "Product published to marketplace successfully!");
      setShowAddProduct(false);
      setProdTitle("");
      setProdDesc("");
      setProdPriceGhs("");
      setProdImages([]);
      loadVendorData();
    } catch (err: any) {
      onShowAlert("error", err instanceof ApiError ? err.message : "Failed to publish product.");
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to remove this product listing?")) return;
    try {
      await api.products.delete(productId);
      onShowAlert("success", "Product removed.");
      loadVendorData();
    } catch (err: any) {
      onShowAlert("error", err instanceof ApiError ? err.message : "Failed to remove product.");
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "80px 48px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Student Authentication Required</h2>
        <p style={{ color: "#5F5F5F", marginTop: "8px" }}>
          Log in with your KNUST student account to open a campus vendor shop.
        </p>
      </div>
    );
  }

  // Case 1: No Vendor Profile Yet
  if (!vendor) {
    return (
      <div style={{ maxWidth: "640px", margin: "48px auto", padding: "0 24px" }}>
        <div style={{ borderLeft: "4px solid #F26A21", paddingLeft: "16px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 800 }}>Open a Student Vendor Shop</h2>
          <p style={{ color: "#5F5F5F", marginTop: "4px" }}>
            Sell your textbooks, electronics, thrift clothes, or food to peers safely on campus.
          </p>
        </div>

        <form
          onSubmit={handleApplyVendor}
          style={{
            background: "#fff",
            border: "1px solid #E2E2E2",
            borderRadius: "6px",
            padding: "28px",
          }}
        >
          <div>
            <label style={{ fontSize: "14px", fontWeight: 700 }}>Shop or Seller Name</label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={80}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. Conti Books Corner, Katanga Tech Hub"
              style={{
                width: "100%",
                height: "44px",
                padding: "0 14px",
                borderRadius: "4px",
                border: "1px solid #CFCFCF",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginTop: "18px" }}>
            <label style={{ fontSize: "14px", fontWeight: 700 }}>Shop Description & Items Sold</label>
            <textarea
              required
              minLength={5}
              maxLength={1000}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you sell and your typical campus pickup availability..."
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "4px",
                border: "1px solid #CFCFCF",
                marginTop: "6px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isApplying}
            style={{
              width: "100%",
              height: "48px",
              marginTop: "24px",
              background: "#C94F0D",
              color: "#fff",
              border: 0,
              borderRadius: "4px",
              fontWeight: 700,
              fontSize: "15px",
              cursor: isApplying ? "not-allowed" : "pointer",
            }}
          >
            {isApplying ? "Submitting Application..." : "Submit Vendor Application"}
          </button>
        </form>
      </div>
    );
  }

  // Case 2: Application Pending
  if (vendor.approvalStatus === "PENDING") {
    return (
      <div style={{ maxWidth: "680px", margin: "48px auto", padding: "0 24px" }}>
        <div
          style={{
            background: "#FFF8F2",
            border: "1px solid #FDE3D3",
            borderLeft: "6px solid #F26A21",
            borderRadius: "6px",
            padding: "24px",
          }}
        >
          <span
            style={{
              background: "#FDE3D3",
              color: "#B8460A",
              padding: "4px 10px",
              borderRadius: "4px",
              fontWeight: 800,
              fontSize: "12px",
            }}
          >
            APPLICATION STATUS: PENDING APPROVAL
          </span>
          <h2 style={{ fontSize: "24px", fontWeight: 800, marginTop: "12px" }}>
            {vendor.shopName}
          </h2>
          <p style={{ color: "#5F5F5F", marginTop: "8px", lineHeight: 1.6 }}>
            Your student vendor application has been submitted and is currently awaiting verification
            by a KNUST Marketplace administrator. Once approved, you will be able to list items for
            sale and accept meetup requests.
          </p>

          <form onSubmit={handleUpdateShop} style={{ marginTop: "24px" }}>
            <h4 style={{ fontSize: "15px", fontWeight: 700 }}>Update Shop Details</h4>
            <div style={{ marginTop: "10px" }}>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "0 12px",
                  border: "1px solid #CFCFCF",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginTop: "10px" }}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #CFCFCF",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                marginTop: "12px",
                padding: "8px 18px",
                background: "#2B2B2B",
                color: "#fff",
                border: 0,
                borderRadius: "4px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Case 3: Application Rejected
  if (vendor.approvalStatus === "REJECTED") {
    return (
      <div style={{ maxWidth: "600px", margin: "64px auto", textAlign: "center" }}>
        <div style={{ fontSize: "40px" }}>⚠️</div>
        <h2 style={{ fontSize: "24px", fontWeight: 800, marginTop: "12px", color: "#9B1C1C" }}>
          Vendor Application Not Approved
        </h2>
        <p style={{ color: "#5F5F5F", marginTop: "8px" }}>
          Your application for "{vendor.shopName}" was reviewed and declined by administration. Please
          contact campus marketplace support for details.
        </p>
      </div>
    );
  }

  // Case 4: APPROVED VENDOR DASHBOARD
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 48px" }}>
      {/* Top Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          background: "#2B2B2B",
          color: "#fff",
          padding: "24px 32px",
          borderRadius: "6px",
        }}
      >
        <div>
          <span
            style={{
              background: "#DEF7EC",
              color: "#03543F",
              padding: "3px 8px",
              borderRadius: "4px",
              fontWeight: 800,
              fontSize: "11px",
            }}
          >
            APPROVED VENDOR
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, marginTop: "6px" }}>{vendor.shopName}</h1>
          <p style={{ color: "#D1D5DB", fontSize: "14px", marginTop: "4px" }}>
            {vendor.description}
          </p>
        </div>

        <button
          onClick={() => setShowAddProduct(true)}
          style={{
            height: "48px",
            padding: "0 24px",
            background: "#C94F0D",
            color: "#fff",
            border: 0,
            borderRadius: "4px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(201, 79, 13, 0.4)",
          }}
        >
          + Add New Product
        </button>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: "20px",
          }}
          onClick={() => setShowAddProduct(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              maxWidth: "580px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "32px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 800 }}>List Item for Sale</h2>
              <button
                onClick={() => setShowAddProduct(false)}
                style={{ background: "none", border: 0, fontSize: "24px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ marginTop: "20px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700 }}>Title (min 3 chars)</label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={100}
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  placeholder="e.g. Engineering Mathematics 4th Edition"
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "0 12px",
                    border: "1px solid #CFCFCF",
                    borderRadius: "4px",
                    marginTop: "6px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "14px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 700 }}>Category</label>
                  <select
                    value={prodCat}
                    onChange={(e) => setProdCat(e.target.value)}
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 10px",
                      border: "1px solid #CFCFCF",
                      borderRadius: "4px",
                      marginTop: "6px",
                      background: "#fff",
                    }}
                  >
                    <option value="Textbooks">Textbooks</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Food">Food</option>
                    <option value="Thrift">Thrift</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "13px", fontWeight: 700 }}>Condition</label>
                  <select
                    value={prodCond}
                    onChange={(e) => setProdCond(e.target.value as ProductCondition)}
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 10px",
                      border: "1px solid #CFCFCF",
                      borderRadius: "4px",
                      marginTop: "6px",
                      background: "#fff",
                    }}
                  >
                    <option value="USED">Pre-owned / Used</option>
                    <option value="NEW">Brand New</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <label style={{ fontSize: "13px", fontWeight: 700 }}>Price in Ghana Cedis (GH₵)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min="0.5"
                  value={prodPriceGhs}
                  onChange={(e) => setProdPriceGhs(e.target.value)}
                  placeholder="e.g. 85 or 120.50"
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "0 12px",
                    border: "1px solid #CFCFCF",
                    borderRadius: "4px",
                    marginTop: "6px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginTop: "14px" }}>
                <label style={{ fontSize: "13px", fontWeight: 700 }}>Description (min 10 chars)</label>
                <textarea
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Describe condition, specifications, and meetup preferences..."
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #CFCFCF",
                    borderRadius: "4px",
                    marginTop: "6px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginTop: "14px" }}>
                <label style={{ fontSize: "13px", fontWeight: 700 }}>Product Images (up to 5 images)</label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files) {
                      setProdImages(Array.from(e.target.files).slice(0, 5));
                    }
                  }}
                  style={{
                    width: "100%",
                    marginTop: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  disabled={isCreatingProduct}
                  style={{
                    flex: 1,
                    height: "48px",
                    background: "#C94F0D",
                    color: "#fff",
                    border: 0,
                    borderRadius: "4px",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: isCreatingProduct ? "not-allowed" : "pointer",
                  }}
                >
                  {isCreatingProduct ? "Uploading & Publishing..." : "Publish Listing"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  style={{
                    padding: "0 20px",
                    height: "48px",
                    border: "1px solid #CFCFCF",
                    background: "#fff",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Published Products Section */}
      <div style={{ marginTop: "40px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 800, borderLeft: "4px solid #F26A21", paddingLeft: "12px" }}>
          My Active Listings ({myProducts.length})
        </h3>

        {myProducts.length === 0 ? (
          <div style={{ padding: "36px 0", color: "#5F5F5F" }}>
            You haven't listed any items yet. Click "+ Add New Product" to start selling.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {myProducts.map((p) => {
              const priceGhs = (p.price / 100).toLocaleString("en-GH", {
                minimumFractionDigits: p.price % 100 === 0 ? 0 : 2,
                maximumFractionDigits: 2,
              });
              return (
                <div
                  key={p.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #E2E2E2",
                    borderRadius: "6px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#C94F0D" }}>
                    {p.category} · {p.condition}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "16px", marginTop: "4px" }}>{p.title}</div>
                  <div style={{ fontWeight: 800, fontSize: "18px", color: "#1F1F1F", marginTop: "6px" }}>
                    GH₵ {priceGhs}
                  </div>
                  <div style={{ marginTop: "auto", paddingTop: "14px", display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#FDE8E8",
                        color: "#9B1C1C",
                        border: "1px solid #F98080",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Delete Listing
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Incoming Orders for this Vendor */}
      <div style={{ marginTop: "56px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 800, borderLeft: "4px solid #F26A21", paddingLeft: "12px" }}>
          Orders Received as Seller ({myVendorOrders.length})
        </h3>
        <div style={{ marginTop: "20px" }}>
          {myVendorOrders.length === 0 ? (
            <div style={{ color: "#5F5F5F" }}>No orders received yet.</div>
          ) : (
            myVendorOrders.map((o) => (
              <OrderStepper
                key={o.id}
                order={o}
                onRefresh={loadVendorData}
                onOpenReview={onOpenReview}
                onOpenReport={onOpenReport}
                onShowAlert={onShowAlert}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
