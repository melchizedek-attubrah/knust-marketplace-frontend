import React, { useEffect, useState } from "react";
import type { AdminStats, Product, Report, User, Vendor } from "../types";
import { api, ApiError } from "../services/api";

interface AdminPanelProps {
  onShowAlert: (type: "success" | "error" | "info", msg: string) => void;
}

type AdminTab = "stats" | "vendors" | "products" | "reports" | "users";

export const AdminPanel: React.FC<AdminPanelProps> = ({ onShowAlert }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("stats");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "stats") {
        const res = await api.admin.getStats();
        setStats(res.data);
      } else if (activeTab === "vendors") {
        const res = await api.admin.listVendors({ status: "PENDING" });
        setVendors(res.vendors);
      } else if (activeTab === "products") {
        const res = await api.admin.listProducts({ limit: 50 });
        setProducts(res.data.products);
      } else if (activeTab === "reports") {
        const res = await api.admin.listReports({ limit: 50 });
        setReports(res.data.reports);
      } else if (activeTab === "users") {
        const res = await api.admin.listUsers({ limit: 50 });
        setUsers(res.data.users);
      }
    } catch (err: any) {
      onShowAlert(
        "error",
        err instanceof ApiError ? err.message : "Failed to load admin data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleApproveVendor = async (vendorId: string) => {
    try {
      await api.admin.approveVendor(vendorId);
      onShowAlert("success", "Vendor shop approved!");
      loadData();
    } catch (err: any) {
      onShowAlert("error", err instanceof ApiError ? err.message : "Approval failed.");
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    try {
      await api.admin.rejectVendor(vendorId);
      onShowAlert("info", "Vendor application rejected.");
      loadData();
    } catch (err: any) {
      onShowAlert("error", err instanceof ApiError ? err.message : "Rejection failed.");
    }
  };

  const handleModerateProduct = async (productId: string) => {
    if (!window.confirm("Moderator action: Remove this product from the platform?")) return;
    try {
      await api.admin.moderateRemoveProduct(productId);
      onShowAlert("success", "Product removed by administrator.");
      loadData();
    } catch (err: any) {
      onShowAlert("error", err instanceof ApiError ? err.message : "Removal failed.");
    }
  };

  const handleUpdateReportStatus = async (
    reportId: string,
    status: "RESOLVED" | "DISMISSED" | "REVIEWED",
  ) => {
    try {
      await api.admin.updateReportStatus(reportId, status);
      onShowAlert("success", `Report marked as ${status.toLowerCase()}.`);
      loadData();
    } catch (err: any) {
      onShowAlert("error", err instanceof ApiError ? err.message : "Failed to update report.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        maxWidth: "1280px",
        margin: "32px auto",
        minHeight: "650px",
        background: "#fff",
        border: "1px solid #E2E2E2",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Sidebar Navigation */}
      <div
        style={{
          width: "240px",
          background: "#2B2B2B",
          padding: "24px 16px",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: "17px",
            color: "#F26A21",
            marginBottom: "20px",
            padding: "0 8px",
          }}
        >
          Admin Console
        </div>

        {[
          { id: "stats", label: "📊 Overview Stats" },
          { id: "vendors", label: "🏪 Vendor Approvals" },
          { id: "products", label: "📦 Product Moderation" },
          { id: "reports", label: "🚩 Reports & Safety" },
          { id: "users", label: "👥 Registered Students" },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                border: 0,
                borderRadius: "4px",
                background: isSelected ? "rgba(255, 255, 255, 0.15)" : "transparent",
                color: isSelected ? "#fff" : "#D9D9D9",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {isLoading && (
          <div style={{ color: "#5F5F5F", marginBottom: "16px", fontSize: "14px" }}>
            Loading data...
          </div>
        )}

        {/* TAB 1: OVERVIEW STATS */}
        {activeTab === "stats" && stats && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Platform Statistics</h2>
            <p style={{ color: "#5F5F5F", marginTop: "4px" }}>
              Live aggregate figures for KNUST Marketplace.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginTop: "24px",
              }}
            >
              {[
                { title: "Registered Users", val: stats.totalUsers, color: "#2B2B2B" },
                { title: "Pending Vendors", val: stats.pendingVendors, color: "#C94F0D" },
                { title: "Approved Vendors", val: stats.approvedVendors, color: "#0E9F6E" },
                { title: "Active Listings", val: stats.activeProducts, color: "#2B2B2B" },
                { title: "Total Orders", val: stats.totalOrders, color: "#2B2B2B" },
                { title: "Completed Orders", val: stats.completedOrders, color: "#0E9F6E" },
                { title: "Open Reports", val: stats.openReports, color: "#9B1C1C" },
              ].map((s) => (
                <div
                  key={s.title}
                  style={{
                    background: "#F9F9F9",
                    border: "1px solid #E2E2E2",
                    borderRadius: "6px",
                    padding: "20px",
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#5F5F5F" }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: s.color, marginTop: "6px" }}>
                    {s.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: VENDOR APPROVALS */}
        {activeTab === "vendors" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Pending Vendor Approvals</h2>
            <p style={{ color: "#5F5F5F", marginTop: "4px" }}>
              Review student merchant applications before their shops go live.
            </p>

            {vendors.length === 0 ? (
              <div style={{ marginTop: "32px", color: "#5F5F5F" }}>
                No pending vendor applications at this time.
              </div>
            ) : (
              <div style={{ marginTop: "24px" }}>
                {vendors.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #E2E2E2",
                      borderRadius: "6px",
                      padding: "20px",
                      marginBottom: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: 700 }}>{v.shopName}</div>
                      <div style={{ fontSize: "14px", color: "#5F5F5F", marginTop: "4px" }}>
                        {v.description}
                      </div>
                      <div style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
                        Applicant: {v.user?.fullName} ({v.user?.email}) · Applied:{" "}
                        {new Date(v.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleApproveVendor(v.id)}
                        style={{
                          height: "40px",
                          padding: "0 18px",
                          background: "#0E9F6E",
                          color: "#fff",
                          border: 0,
                          borderRadius: "4px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectVendor(v.id)}
                        style={{
                          height: "40px",
                          padding: "0 18px",
                          background: "#FDE8E8",
                          color: "#9B1C1C",
                          border: "1px solid #F98080",
                          borderRadius: "4px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCT MODERATION */}
        {activeTab === "products" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Product Moderation</h2>
            <p style={{ color: "#5F5F5F", marginTop: "4px" }}>
              Inspect platform listings and remove inappropriate or prohibited items.
            </p>

            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {products.map((p) => {
                const priceGhs = (p.price / 100).toLocaleString("en-GH", {
                  minimumFractionDigits: p.price % 100 === 0 ? 0 : 2,
                  maximumFractionDigits: 2,
                });
                return (
                  <div
                    key={p.id}
                    style={{
                      border: "1px solid #E2E2E2",
                      borderRadius: "6px",
                      padding: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "16px" }}>{p.title}</div>
                      <div style={{ fontSize: "13px", color: "#5F5F5F", marginTop: "2px" }}>
                        Category: {p.category} · Condition: {p.condition} · Status: {p.status} · GH₵{" "}
                        {priceGhs}
                      </div>
                    </div>

                    {p.status === "ACTIVE" && (
                      <button
                        onClick={() => handleModerateProduct(p.id)}
                        style={{
                          padding: "8px 16px",
                          background: "#FDE8E8",
                          color: "#9B1C1C",
                          border: "1px solid #F98080",
                          borderRadius: "4px",
                          fontWeight: 600,
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        Remove Listing
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: REPORTS & SAFETY */}
        {activeTab === "reports" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Student Reports & Moderation</h2>
            <p style={{ color: "#5F5F5F", marginTop: "4px" }}>
              Review reports filed by students regarding suspicious activities, fraud, or violations.
            </p>

            {reports.length === 0 ? (
              <div style={{ marginTop: "32px", color: "#5F5F5F" }}>No reports filed.</div>
            ) : (
              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {reports.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      border: "1px solid #E2E2E2",
                      borderRadius: "6px",
                      padding: "20px",
                      background: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          background: r.status === "OPEN" ? "#FDE8E8" : "#EDEFF2",
                          color: r.status === "OPEN" ? "#9B1C1C" : "#374151",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        STATUS: {r.status}
                      </span>
                      <span style={{ fontSize: "12px", color: "#888" }}>
                        {new Date(r.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: "16px", marginTop: "8px" }}>
                      Reason: {r.reason}
                    </div>
                    <p style={{ fontSize: "14px", color: "#4A4A4A", marginTop: "6px" }}>
                      "{r.description}"
                    </p>

                    <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                      {r.status === "OPEN" && (
                        <>
                          <button
                            onClick={() => handleUpdateReportStatus(r.id, "RESOLVED")}
                            style={{
                              padding: "6px 14px",
                              background: "#0E9F6E",
                              color: "#fff",
                              border: 0,
                              borderRadius: "4px",
                              fontWeight: 600,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            Mark Resolved
                          </button>
                          <button
                            onClick={() => handleUpdateReportStatus(r.id, "DISMISSED")}
                            style={{
                              padding: "6px 14px",
                              background: "#F3F4F6",
                              color: "#374151",
                              border: "1px solid #D1D5DB",
                              borderRadius: "4px",
                              fontWeight: 600,
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: USERS */}
        {activeTab === "users" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Student Accounts</h2>
            <p style={{ color: "#5F5F5F", marginTop: "4px" }}>
              Verified KNUST university accounts.
            </p>

            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {users.map((u) => (
                <div
                  key={u.id}
                  style={{
                    border: "1px solid #E2E2E2",
                    borderRadius: "6px",
                    padding: "14px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>{u.fullName}</div>
                    <div style={{ fontSize: "13px", color: "#5F5F5F" }}>{u.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: u.emailVerified ? "#DEF7EC" : "#FEF08A",
                        color: u.emailVerified ? "#03543F" : "#854D0E",
                      }}
                    >
                      {u.emailVerified ? "Verified Email" : "Unverified"}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: u.role === "ADMIN" ? "#E1EFFE" : "#EDEFF2",
                        color: u.role === "ADMIN" ? "#1E429F" : "#374151",
                      }}
                    >
                      {u.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
