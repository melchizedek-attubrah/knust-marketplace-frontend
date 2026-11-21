import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  MapPin,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Clock,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import type { ChatConversation, ChatMessage, Product } from "../types";
import { INITIAL_CONVERSATIONS, SAFE_MEETUP_SPOTS } from "../data/mockData";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetProduct?: Product | null;
  onShowAlert: (type: "success" | "error" | "info", msg: string) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  targetProduct,
  onShowAlert,
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState("");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If a targetProduct is passed when opened, switch or create a conversation for that seller!
  useEffect(() => {
    if (targetProduct) {
      const existing = conversations.find(
        (c) => c.productId === targetProduct.id || c.participantName === targetProduct.vendor?.shopName,
      );
      if (existing) {
        setActiveConvId(existing.id);
      } else {
        const newConv: ChatConversation = {
          id: `conv-auto-${Date.now()}`,
          participantId: targetProduct.vendorId || "v-1",
          participantName: targetProduct.vendor?.shopName || "Student Seller",
          participantRole: "Student",
          isVerified: true,
          productId: targetProduct.id,
          productTitle: targetProduct.title,
          productPrice: targetProduct.price,
          productImage: targetProduct.images?.[0]?.imageUrl,
          lastMessage: `Hi, is "${targetProduct.title}" still available?`,
          lastMessageTime: "Just now",
          unreadCount: 0,
          messages: [
            {
              id: `m-init-${Date.now()}`,
              senderId: "me",
              senderName: "Me",
              isMe: true,
              text: `Hello! I'm interested in "${targetProduct.title}". Is it still available for safe meetup on campus?`,
              timestamp: "Just now",
              read: true,
            },
          ],
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConvId(newConv.id);
      }
    }
  }, [targetProduct]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      senderName: "Me",
      isMe: true,
      text: inputText.trim(),
      timestamp: "Just now",
      read: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: inputText.trim(),
            lastMessageTime: "Just now",
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      }),
    );
    setInputText("");

    // Simulate friendly seller reply after 1.5s
    setTimeout(() => {
      const sellerReplies = [
        "Sure, that works for me! I will bring it over.",
        "Yes, absolutely. Let's meet at the porters' lodge.",
        "Got it! I can be there in 20 minutes.",
        "Deal! Let's do cash or MoMo after you inspect it.",
      ];
      const randomReply = sellerReplies[Math.floor(Math.random() * sellerReplies.length)];

      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: activeConversation?.participantId || "seller",
        senderName: activeConversation?.participantName || "Seller",
        isMe: false,
        text: randomReply,
        timestamp: "Just now",
        read: true,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: "Just now",
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        }),
      );
    }, 1500);
  };

  const handleSuggestLocation = (locationName: string) => {
    setInputText(`Can we meet safely at ${locationName}?`);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerAmount || !activeConvId) return;

    const offerText = `🤝 Offer: I'd like to offer GH₵ ${Number(offerAmount).toLocaleString()} for this item. Are you open to that?`;
    setInputText(offerText);
    setShowOfferModal(false);
    setOfferAmount("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="relative w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col overflow-hidden"
          >
            {/* Top Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    Campus In-App Chat
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      Live
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct communication between verified students
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Selector Strip */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto bg-slate-50/30 dark:bg-slate-900/60">
              {conversations.map((c) => {
                const isSelected = c.id === activeConvId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{c.participantName.split(" ")[0]}</span>
                    {c.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Active Chat Header with Product Snippet */}
            {activeConversation && (
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  {activeConversation.productImage && (
                    <img
                      src={activeConversation.productImage}
                      alt="Product"
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="overflow-hidden">
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {activeConversation.productTitle || "Campus Item"}
                    </p>
                    {activeConversation.productPrice && (
                      <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                        GH₵ {(activeConversation.productPrice / 100).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowOfferModal(true)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 shadow-sm hover:scale-105 transition-all flex items-center gap-1 flex-shrink-0"
                >
                  <DollarSign className="w-4 h-4" /> Make Offer
                </button>
              </div>
            )}

            {/* Message History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/20 dark:bg-slate-950/20">
              {activeConversation?.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                      m.isMe
                        ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700 shadow-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Meetup Suggestions */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Quick Meetup Location:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {SAFE_MEETUP_SPOTS.slice(0, 3).map((spot) => (
                  <button
                    key={spot.name}
                    onClick={() => handleSuggestLocation(spot.name)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 whitespace-nowrap flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <span>{spot.name.split("(")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type a message or meetup request..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 btn-primary-glow flex items-center justify-center cursor-pointer transition-transform active:scale-90"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Make an Offer Modal */}
            <AnimatePresence>
              {showOfferModal && (
                <div className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-2xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span>Propose Counter-Offer</span>
                      </h4>
                      <button
                        onClick={() => setShowOfferModal(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSendOffer} className="mt-4 space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Your Proposed Price (GH₵)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 280"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold dark:text-white"
                          autoFocus
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer"
                      >
                        Send Offer in Chat
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
