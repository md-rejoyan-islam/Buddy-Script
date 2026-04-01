"use client";

import { useState } from "react";
import { useLikeUsers } from "@/hooks/use-like-users";

const REACTIONS: Record<string, string> = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  sad: "😢",
  wow: "😮",
  angry: "😡",
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  type: "post" | "comment" | "reply";
  id: string;
};

export default function LikesModal({ isOpen, onClose, type, id }: Props) {
  const { data: likes, isLoading } = useLikeUsers(type, id, isOpen);
  const [filter, setFilter] = useState<string>("all");

  if (!isOpen) return null;

  const filteredLikes =
    filter === "all"
      ? likes
      : likes?.filter((l) => l.reaction === filter);

  // Get unique reactions with counts
  const reactionCounts: Record<string, number> = {};
  likes?.forEach((l) => {
    reactionCounts[l.reaction] = (reactionCounts[l.reaction] || 0) + 1;
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-(--bg2) rounded-lg w-full max-w-sm mx-4 shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--bcolor1)">
          <h3 className="text-lg font-semibold text-(--color6)">Reactions</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-(--bg3) flex items-center justify-center border-none text-(--color7) hover:bg-(--bg4) transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-(--bcolor1) overflow-x-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-sm border-none cursor-pointer transition-all ${
              filter === "all"
                ? "bg-(--color5) text-white"
                : "bg-(--bg3) text-(--color7) hover:bg-(--bg4)"
            }`}
          >
            All {likes?.length || 0}
          </button>
          {Object.entries(reactionCounts).map(([reaction, count]) => (
            <button
              key={reaction}
              onClick={() => setFilter(reaction)}
              className={`px-3 py-1.5 rounded-full text-sm border-none cursor-pointer transition-all flex items-center gap-1 ${
                filter === reaction
                  ? "bg-(--color5) text-white"
                  : "bg-(--bg3) text-(--color7) hover:bg-(--bg4)"
              }`}
            >
              <span>{REACTIONS[reaction] || "👍"}</span>
              {count}
            </button>
          ))}
        </div>

        {/* Users list */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-(--color5) border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {filteredLikes?.map((like) => (
            <div key={like.id} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={like.user.image || "/images/post_img.png"}
                    alt={`${like.user.firstName} ${like.user.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 text-sm">
                    {REACTIONS[like.reaction] || "👍"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-(--color6)">
                    {like.user.firstName} {like.user.lastName}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredLikes && filteredLikes.length === 0 && (
            <p className="text-sm text-(--color7) text-center py-4">No reactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
