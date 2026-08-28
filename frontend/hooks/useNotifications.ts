"use client";

import { useCallback, useState } from "react";
import { type NotificationItem, type NotificationType } from "@/components/NotificationToast";

let _id = 0;
function nextId() { return `notif-${++_id}-${Date.now()}`; }

/* ─────────────────────────────────────────────
   Preset factories — call these instead of
   building notification objects by hand.
───────────────────────────────────────────── */
export const Notifications = {
  auctionWon: (assetName: string, bid: number): Omit<NotificationItem, "id"> => ({
    type: "auction_won",
    title: `You won "${assetName}"!`,
    message: `Congratulations! Your bid of ${bid.toLocaleString()} CR was the highest. The asset has been added to your portfolio.`,
    duration: 8000,
  }),

  outbid: (assetName: string, newBid: number): Omit<NotificationItem, "id"> => ({
    type: "outbid",
    title: "You've been outbid!",
    message: `Another team just placed ${newBid.toLocaleString()} CR on "${assetName}". Raise your bid before the timer ends.`,
    duration: 6000,
  }),

  marketEvent: (headline: string, detail: string): Omit<NotificationItem, "id"> => ({
    type: "market_event",
    title: headline,
    message: detail,
    duration: 7000,
  }),

  marketplaceClosing: (minutesLeft: number): Omit<NotificationItem, "id"> => ({
    type: "marketplace_closing",
    title: `Marketplace closing in ${minutesLeft} min`,
    message: "All open auctions will be finalized when the market closes. Place your final bids now.",
    duration: 10000,
  }),

  submissionReminder: (deadline: string): Omit<NotificationItem, "id"> => ({
    type: "submission_reminder",
    title: "Submission deadline approaching",
    message: `Your business plan must be submitted by ${deadline}. Head to the Dashboard to upload now.`,
    duration: 9000,
  }),
};

/* ─────────────────────────────────────────────
   Hook
───────────────────────────────────────────── */
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const push = useCallback((partial: Omit<NotificationItem, "id">) => {
    const item: NotificationItem = { ...partial, id: nextId() };
    setNotifications(prev => [...prev, item]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const pushType = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    duration?: number,
  ) => {
    push({ type, title, message, duration });
  }, [push]);

  return { notifications, push, pushType, dismiss };
}
