import React from "react";

export const CAMPUS_PICKUP_POINTS = [
  "All pickup points",
  "Independence",
  "Unity",
  "Queens",
  "Commercial area",
];

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedPickup: string;
  onPickupChange: (point: string) => void;
  sortOrder: "newest" | "price_asc" | "price_desc";
  onSortChange: (sort: "newest" | "price_asc" | "price_desc") => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedPickup,
  onPickupChange,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div
      style={{
        margin: "-36px 48px 0",
        position: "relative",
        background: "#fff",
        border: "1px solid #E2E2E2",
        borderRadius: "4px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px",
        flexWrap: "wrap",
        zIndex: 10,
      }}
    >
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search textbooks, laptops, hostel appliances, past questions..."
        style={{
          flex: "1 1 300px",
          height: "48px",
          border: "1px solid #CFCFCF",
          borderRadius: "4px",
          padding: "0 16px",
          font: "400 15px 'Open Sans', sans-serif",
          color: "#1F1F1F",
          outline: "none",
        }}
      />

      {/* Pickup Point Filter */}
      <select
        value={selectedPickup}
        onChange={(e) => onPickupChange(e.target.value)}
        style={{
          height: "48px",
          padding: "0 16px",
          borderRadius: "4px",
          border: "1px solid #CFCFCF",
          background: "#fff",
          color: "#1F1F1F",
          cursor: "pointer",
          font: "600 14px 'Open Sans', sans-serif",
          minWidth: "210px",
          outline: "none",
        }}
      >
        {CAMPUS_PICKUP_POINTS.map((pt) => (
          <option key={pt} value={pt}>
            {pt === "All pickup points" ? "📍 All pickup points" : `📍 ${pt}`}
          </option>
        ))}
      </select>

      {/* Sorting Dropdown */}
      <select
        value={sortOrder}
        onChange={(e) =>
          onSortChange(e.target.value as "newest" | "price_asc" | "price_desc")
        }
        style={{
          height: "48px",
          padding: "0 16px",
          borderRadius: "4px",
          border: "1px solid #CFCFCF",
          background: "#fff",
          color: "#1F1F1F",
          cursor: "pointer",
          font: "600 14px 'Open Sans', sans-serif",
          minWidth: "180px",
          outline: "none",
        }}
      >
        <option value="newest">🕒 Sort: Newest</option>
        <option value="price_asc">💰 Price: Low to High</option>
        <option value="price_desc">💎 Price: High to Low</option>
      </select>
    </div>
  );
};
