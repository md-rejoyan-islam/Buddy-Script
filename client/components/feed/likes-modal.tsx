"use client";

import Modal from "@/components/ui/modal";
import { useLikeUsers } from "@/hooks/use-like-users";
import Image from "next/image";
import { useState } from "react";

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

  const filteredLikes =
    filter === "all" ? likes : likes?.filter((l) => l.reaction === filter);

  const reactionCounts: Record<string, number> = {};
  likes?.forEach((l) => {
    reactionCounts[l.reaction] = (reactionCounts[l.reaction] || 0) + 1;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reactions" size="sm">
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
      <div className="p-4">
        {isLoading && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-(--color5) border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {filteredLikes?.map((like) => (
          <div
            key={like.id}
            className="flex items-center justify-between py-2.5"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  width={40}
                  height={40}
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

        {filteredLikes && filteredLikes.length === 0 && !isLoading && (
          <p className="text-sm text-(--color7) text-center py-4">
            No reactions yet
          </p>
        )}
      </div>
    </Modal>
  );
}
