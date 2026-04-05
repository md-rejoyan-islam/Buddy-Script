"use client";

import Modal from "@/components/ui/modal";
import { useShareUsers, useSharePost } from "@/hooks/use-share";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  mode: "share" | "list";
};

export default function ShareModal({ isOpen, onClose, postId, mode }: Props) {
  const [copied, setCopied] = useState(false);
  const sharePost = useSharePost();
  const { data: shareUsers, isLoading } = useShareUsers(
    postId,
    isOpen && mode === "list",
  );

  const postLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/${postId}`
      : `/${postId}`;

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "share" ? "Share Post" : "Shared By"}
      size="md"
    >
      {mode === "share" ? (
        <div className="p-4">
          <p className="text-sm text-(--color7) mb-3">
            Copy the link to share this post
          </p>
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
        <div className="p-4">
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
            <p className="text-sm text-(--color7) text-center py-4">
              No shares yet
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
