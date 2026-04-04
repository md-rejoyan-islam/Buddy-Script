"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useShareUsers, useSharePost } from "@/hooks/use-share";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  mode: "share" | "list";
};

export default function ShareModal({ isOpen, onClose, postId, mode }: Props) {
  const [copied, setCopied] = useState(false);
  const sharePost = useSharePost();
  const { data: shareUsers, isLoading } = useShareUsers(postId, isOpen && mode === "list");

  if (!isOpen) return null;

  const postLink = `${window.location.origin}/${postId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postLink);
      setCopied(true);
      toast.success("Link copied!");
      sharePost.mutate(postId);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-(--bg2) rounded-lg w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--bcolor1)">
          <h3 className="text-lg font-semibold text-(--color6)">
            {mode === "share" ? "Share Post" : "Shared By"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-(--bg3) flex items-center justify-center border-none text-(--color7) hover:bg-(--bg4) transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {mode === "share" ? (
          <div className="p-4">
            <p className="text-sm text-(--color7) mb-3">Copy the link to share this post</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={postLink}
                readOnly
                className="flex-1 bg-(--bg3) border border-(--bcolor1) rounded-md h-10 px-3 text-sm text-(--color) focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`shrink-0 h-10 px-4 rounded-md text-sm font-medium border-none cursor-pointer transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-(--color5) text-white hover:shadow-md"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-(--color5) border-t-transparent rounded-full animate-spin" />
              </div>
            ) : shareUsers && shareUsers.length > 0 ? (
              <div className="flex flex-col gap-3">
                {shareUsers.map((share) => (
                  <div key={share.id} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={share.user.image || "/default-avatar.png"}
                      alt={`${share.user.firstName} ${share.user.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-(--color6)">
                      {share.user.firstName} {share.user.lastName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-(--color7) text-center py-4">No shares yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
