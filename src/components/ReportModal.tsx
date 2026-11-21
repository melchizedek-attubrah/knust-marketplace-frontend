import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { ReportReason } from "../types";
import { api, ApiError } from "../services/api";

interface ReportModalProps {
  productId?: string;
  reportedUserId?: string;
  onClose: () => void;
  onShowAlert: (type: "success" | "error" | "info", msg: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  productId,
  reportedUserId,
  onClose,
  onShowAlert,
}) => {
  const [reason, setReason] = useState<ReportReason>("SCAM");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 10) {
      onShowAlert("error", "Description must be at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.reports.create({
        productId: productId || undefined,
        reportedUserId: reportedUserId || undefined,
        reason,
        description: description.trim(),
      });
      onShowAlert(
        "success",
        "Report submitted. KNUST Marketplace administrators will review it promptly.",
      );
      onClose();
    } catch (err: any) {
      onShowAlert("error", err instanceof ApiError ? err.message : "Failed to submit report.");
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Submit Safety Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Help keep the KNUST student community safe. Please describe the issue clearly.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Reason for report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="SCAM">Scam / Fraud attempt</option>
              <option value="INAPPROPRIATE_CONTENT">Inappropriate or counterfeit item</option>
              <option value="HARASSMENT">Harassment or rude behavior</option>
              <option value="SUSPICIOUS_ACTIVITY">Suspicious activity or meetup no-show</option>
              <option value="OTHER">Other violation of campus rules</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Description (min 10 characters)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details of what occurred..."
              rows={4}
              required
              minLength={10}
              maxLength={2000}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/25 cursor-pointer transition-all"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
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
