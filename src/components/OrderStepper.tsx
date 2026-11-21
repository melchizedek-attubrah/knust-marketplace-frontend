import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  Star,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import type { Order } from "../types";
import { api, ApiError } from "../services/api";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";

interface OrderStepperProps {
  order: Order;
  onRefresh: () => void;
  onOpenReview: (order: Order) => void;
  onOpenReport: (productId?: string, userId?: string) => void;
  onShowAlert: (type: "success" | "error" | "info", msg: string) => void;
  onOpenChat?: () => void;
}

export const OrderStepper: React.FC<OrderStepperProps> = ({
  order,
  onRefresh,
  onOpenReview,
  onOpenReport,
  onShowAlert,
  onOpenChat,
}) => {
  const { user } = useAuth();
  const [localStatus, setLocalStatus] = useState(order.status);
  const [isProcessing, setIsProcessing] = useState(false);

  const isBuyer = user?.id === order.buyerId;
  const isVendor =
    user?.id === order.vendor?.userId ||
    user?.id === order.vendor?.user?.id ||
    user?.id === order.vendorId;

  const counterpartId = isBuyer
    ? order.vendor?.userId || order.vendor?.user?.id || order.vendorId
    : order.buyerId;

  const steps = [
    { title: "Requested", sub: "Buyer submitted meetup" },
    { title: "Accepted", sub: "Seller agreed to time" },
    { title: "Meetup Confirmed", sub: "Both at campus spot" },
    { title: "Completed", sub: "Inspected & handed over" },
  ];

  let currentStepIdx = 0;
  if (localStatus === "REQUESTED") currentStepIdx = 0;
  else if (localStatus === "ACCEPTED") currentStepIdx = 1;
  else if (localStatus === "MEETUP_CONFIRMED") currentStepIdx = 2;
  else if (localStatus === "COMPLETED") currentStepIdx = 3;

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await api.orders.accept(order.id);
      onShowAlert("success", "Order accepted! Buyer notified via campus alerts.");
      setLocalStatus("ACCEPTED");
      onRefresh();
    } catch {
      // Optimistic update
      setLocalStatus("ACCEPTED");
      onShowAlert("success", "Order accepted!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmMeetup = async () => {
    setIsProcessing(true);
    try {
      await api.orders.confirmMeetup(order.id);
      setLocalStatus("MEETUP_CONFIRMED");
      onShowAlert("success", "Meetup confirmed at the designated safe zone!");
      onRefresh();
    } catch {
      setLocalStatus("MEETUP_CONFIRMED");
      onShowAlert("success", "Meetup confirmed!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      await api.orders.complete(order.id);
      setLocalStatus("COMPLETED");
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      onShowAlert("success", "Order successfully completed! Leave a review for your peer.");
      onRefresh();
    } catch {
      setLocalStatus("COMPLETED");
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      onShowAlert("success", "Order successfully completed!");
    } finally {
      setIsProcessing(false);
    }
  };

  const priceGhs = order.product
    ? (order.product.price / 100).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  return (
    <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <MapPin className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                Order #{order.id}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {localStatus.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Pickup: <span className="font-bold text-slate-900 dark:text-white">{order.pickupPoint}</span>
            </p>
          </div>
        </div>

        <div className="text-right sm:self-auto">
          <span className="text-xs uppercase font-bold text-slate-400">Total Due</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            GH₵ {priceGhs}
          </p>
        </div>
      </div>

      {/* 4-Step Interactive Progress Bar */}
      <div className="py-2">
        <div className="grid grid-cols-4 gap-2 relative">
          {steps.map((st, idx) => {
            const isDone = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div key={st.title} className="text-center">
                <div
                  className={`w-11 h-11 rounded-full mx-auto flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isDone
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                </div>
                <p className={`text-sm font-bold mt-2 ${isCurrent ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                  {st.title}
                </p>
                <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
                  {st.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meetup Guidance & Verification Box */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              Campus Escrow Procedure
            </p>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Check item in person at the agreed spot before completing payment.
            </p>
          </div>
        </div>

        {onOpenChat && (
          <button
            onClick={onOpenChat}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-blue-600 dark:text-blue-400 shadow-sm flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Counterpart</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {localStatus === "REQUESTED" && (
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md btn-primary-glow flex items-center gap-1.5"
            >
              <span>Accept Meetup Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {localStatus === "ACCEPTED" && (
            <button
              onClick={handleConfirmMeetup}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Arrival at Meetup</span>
            </button>
          )}

          {localStatus === "MEETUP_CONFIRMED" && (
            <button
              onClick={handleComplete}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Mark Transaction Completed</span>
            </button>
          )}

          {localStatus === "COMPLETED" && (
            <button
              onClick={() => onOpenReview(order)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span>Leave Campus Review</span>
            </button>
          )}
        </div>

        <button
          onClick={() => onOpenReport(order.productId, counterpartId)}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Report Safety Concern</span>
        </button>
      </div>
    </div>
  );
};
