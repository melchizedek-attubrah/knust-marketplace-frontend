import React from "react";
import type { ProductCondition } from "../types";

export const CATEGORIES = [
  "All",
  "Textbooks",
  "Electronics",
  "Hostel",
  "Food",
  "Thrift",
  "Other",
];

interface CategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedCondition: ProductCondition | "ALL";
  onSelectCondition: (cond: ProductCondition | "ALL") => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedCondition,
  onSelectCondition,
}) => {
  return (
    <div style={{ padding: "48px 48px 0" }}>
      {/* Category Section Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div
          style={{
            borderLeft: "4px solid #F26A21",
            paddingLeft: "12px",
            fontWeight: 800,
            fontSize: "26px",
            color: "#1F1F1F",
          }}
        >
          Explore Categories
        </div>

        {/* Condition Filter Chips */}
        <div style={{ display: "flex", gap: "8px" }}>
          {(["ALL", "NEW", "USED"] as const).map((cond) => {
            const isSelected = selectedCondition === cond;
            const label =
              cond === "ALL" ? "All Conditions" : cond === "NEW" ? "Brand New" : "Used";
            return (
              <button
                key={cond}
                onClick={() => onSelectCondition(cond)}
                style={{
                  height: "36px",
                  padding: "0 14px",
                  borderRadius: "20px",
                  border: isSelected ? "1px solid #C94F0D" : "1px solid #E2E2E2",
                  background: isSelected ? "#C94F0D" : "#F8F8F8",
                  color: isSelected ? "#fff" : "#5F5F5F",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                height: "44px",
                padding: "0 22px",
                borderRadius: "4px",
                border: isSelected ? "1px solid #2B2B2B" : "1px solid #CFCFCF",
                background: isSelected ? "#2B2B2B" : "#fff",
                color: isSelected ? "#fff" : "#1F1F1F",
                cursor: "pointer",
                font: "600 14px 'Open Sans', sans-serif",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
