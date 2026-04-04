"use client";

import { FeedPostCard } from "@/components/feed/feed-posts";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { Post } from "@/hooks/use-feed";

export default function PostDetail({ post }: { post: Post }) {
  const { data: currentUser } = useCurrentUser();

  return <FeedPostCard post={post} currentUserId={currentUser?.id} />;
}
