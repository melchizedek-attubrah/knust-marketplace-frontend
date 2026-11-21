import React, { useState } from "react";
import { X, Star } from "lucide-react";
import type { Order } from "../types";
import { api, ApiError } from "../services/api";

interface ReviewModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
  onShowAlert: (type: "success" | "error" | "info", msg: string) => void;
}

const TAG_OPTIONS = [
  "Item as described",
  "On time at pickup point",
  "Friendly and polite",
  "Fair price",
  "Great condition",
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  order,
  onClose,
  onSuccess,
  onShowAlert,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    let updated: string[];
    if (selectedTags.includes(tag)) {
      updated = selectedTags.filter((t) => t !== tag);
    } else {
      updated = [...selectedTags, tag];
    }
    setSelectedTags(updated);

    if (!comment) {
      setComment(updated.join(". ") + ".");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalComment = comment.trim() || selectedTags.join(", ") || "Great transaction!";
    if (finalComment.length < 3) {
      onShowAlert("error", "Comment must be at least 3 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.reviews.create({
        orderId: order.id,
        rating,
        comment: finalComment,
      });
      onShowAlert("success", "Review submitted! Thank you for supporting the campus community.");
      onSuccess();
      onClose();
    } catch (err: any) {
      onShowAlert("error", err instanceof ApiError ? err.message : "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl z-10 text-slate-900 dark:text-slate-100">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Rate Your Deal</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
          For <strong className="text-slate-800 dark:text-slate-200">{order.product?.title || "your item"}</strong>
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Star Rating */}
          <div className="flex gap-2 justify-center my-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-115 active:scale-95 cursor-pointer"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-center text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            {rating === 5
              ? "Excellent"
              : rating === 4
              ? "Good"
              : rating === 3
              ? "Average"
              : rating === 2
              ? "Below Average"
              : "Poor"}
          </div>

          {/* Quick Tags */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
              Quick Feedback Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment text area */}
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
              Review Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other students about your experience..."
              rows={3}
              required
              minLength={3}
              maxLength={1000}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 btn-primary-glow cursor-pointer transition-all"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
