"use client";

import { AvatarGroup } from "@/components/ui/avatar";
import {
  useComments,
  useCreateComment,
  useCreateReply,
  useDeleteComment,
  useDeleteReply,
  useLikeComment,
  useLikeReply,
  useReplies,
  useUpdateComment,
  useUpdateReply,
  type Comment,
  type Reply,
} from "@/hooks/use-comments";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useFeed, type Post } from "@/hooks/use-feed";
import {
  useDeletePost,
  useLikePost,
  useUpdateVisibility,
} from "@/hooks/use-post-mutations";
import { formatDistanceToNow } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LikesModal from "./likes-modal";
import ShareModal from "./share-modal";

const REACTIONS: Record<string, string> = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  sad: "😢",
  wow: "😮",
  angry: "😡",
};

/* ─── Reply Item ────────────────────────────────── */

function ReplyItem({
  reply,
  commentId,
  postId,
  currentUserId,
}: {
  reply: Reply;
  commentId: string;
  postId: string;
  currentUserId?: string;
}) {
  const likeReply = useLikeReply(commentId);
  const deleteReply = useDeleteReply(commentId, postId);
  const updateReply = useUpdateReply(commentId);
  const isLiked = reply.likes.length > 0;
  const currentReaction = reply.likes[0]?.reaction || "like";
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOwner = currentUserId === reply.author.id;
  const authorName = `${reply.author.firstName} ${reply.author.lastName}`;
  const authorImage = reply.author.image || "/default-avatar.png";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setShowMenu(false);
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const handleDelete = () => {
    setShowMenu(false);
    deleteReply.mutate(reply.id);
    toast.success("Reply deleted");
  };

  const handleEditSubmit = () => {
    if (!editText.trim() || editText.trim() === reply.content) {
      setIsEditing(false);
      return;
    }
    updateReply.mutate({ replyId: reply.id, content: editText.trim() });
    setIsEditing(false);
    toast.success("Reply updated");
  };

  return (
    <div className="flex gap-2.5 mb-3">
      <div className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={authorImage}
          alt={authorName}
          className="w-7 h-7 rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1">
          <div className="flex-1 bg-(--comment-bg) rounded-xl p-2.5">
            <h4 className="font-medium text-xs text-(--color6) mb-0.5">
              {authorName}
            </h4>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditSubmit();
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                  className="w-full bg-transparent border-none text-xs text-(--color6) focus:outline-none"
                  autoFocus
                />
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={handleEditSubmit}
                    className="text-[10px] text-(--color5) bg-transparent border-none cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(reply.content);
                    }}
                    className="text-[10px] text-(--color7) bg-transparent border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-(--color7)">{reply.content}</p>
            )}
          </div>
          {isOwner && !isEditing && (
            <div className="relative shrink-0" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-transparent border-none text-(--color7) hover:bg-(--bg3) cursor-pointer"
              >
                <svg
                  width="12"
                  height="4"
                  viewBox="0 0 14 4"
                  fill="currentColor"
                >
                  <circle cx="2" cy="2" r="1.5" />
                  <circle cx="7" cy="2" r="1.5" />
                  <circle cx="12" cy="2" r="1.5" />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-(--bg2) border border-(--bcolor1) rounded-lg shadow-lg py-1 w-28 z-50">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setIsEditing(true);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-(--color6) bg-transparent border-none hover:bg-(--bg3) cursor-pointer flex items-center gap-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-500 bg-transparent border-none hover:bg-(--bg3) cursor-pointer flex items-center gap-2"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 px-1">
          <div className="relative group">
            <div className="absolute bottom-full left-0 mb-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-(--bg2) rounded-full shadow-lg border border-(--bcolor1) px-1.5 py-1 flex items-center gap-0.5">
                {Object.entries(REACTIONS).map(([key, emoji]) => (
                  <button
                    key={key}
                    onClick={() =>
                      likeReply.mutate({ replyId: reply.id, reaction: key })
                    }
                    title={key}
                    className="text-base hover:scale-125 transition-transform duration-150 bg-transparent border-none cursor-pointer p-0.5"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() =>
                likeReply.mutate({
                  replyId: reply.id,
                  reaction: currentReaction,
                })
              }
              className={`text-xs border-none bg-transparent cursor-pointer hover:underline ${isLiked ? "text-(--color5) font-medium" : "text-(--color7)"}`}
            >
              {isLiked ? `${REACTIONS[currentReaction] || "👍"} ` : ""}
              {isLiked
                ? currentReaction.charAt(0).toUpperCase() +
                  currentReaction.slice(1)
                : "Like"}
              {reply._count.likes > 0 && ` · ${reply._count.likes}`}
            </button>
          </div>
          <span className="text-xs text-(--color7)">
            {formatDistanceToNow(reply.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Comment Item ──────────────────────────────── */

function CommentItem({
  comment,
  postId,
  currentUserId,
}: {
  comment: Comment;
  postId: string;
  currentUserId?: string;
}) {
  const likeComment = useLikeComment(postId);
  const deleteComment = useDeleteComment(postId);
  const updateComment = useUpdateComment(postId);
  const isLiked = comment.likes.length > 0;
  const currentReaction = comment.likes[0]?.reaction || "like";
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const menuRef = useRef<HTMLDivElement>(null);
  const createReply = useCreateReply(comment.id, postId);
  const { data: replies, isLoading: repliesLoading } = useReplies(
    comment.id,
    showReplies,
  );
  const isOwner = currentUserId === comment.author.id;

  const authorName = `${comment.author.firstName} ${comment.author.lastName}`;
  const authorImage = comment.author.image || "/default-avatar.png";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setShowMenu(false);
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    await createReply.mutateAsync(replyText.trim());
    setReplyText("");
    setShowReplies(true);
  };

  const handleDelete = () => {
    setShowMenu(false);
    deleteComment.mutate(comment.id);
    toast.success("Comment deleted");
  };

  const handleEditSubmit = () => {
    if (!editText.trim() || editText.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    updateComment.mutate({ commentId: comment.id, content: editText.trim() });
    setIsEditing(false);
    toast.success("Comment updated");
  };

  return (
    <div className="flex gap-3 mb-4 group/comment">
      <div className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={authorImage}
          alt={authorName}
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-1">
          <div className="flex-1 bg-(--comment-bg) rounded-xl p-3">
            <h4 className="font-medium text-sm text-(--color6) mb-1">
              {authorName}
            </h4>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditSubmit();
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                  className="w-full bg-transparent border-none text-sm text-(--color6) focus:outline-none"
                  autoFocus
                />
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={handleEditSubmit}
                    className="text-xs text-(--color5) bg-transparent border-none cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(comment.content);
                    }}
                    className="text-xs text-(--color7) bg-transparent border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-(--color7) whitespace-pre-line">
                {comment.content}
              </p>
            )}
          </div>
          {isOwner && !isEditing && (
            <div className="relative shrink-0" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-transparent border-none text-(--color7) hover:bg-(--bg3) cursor-pointer"
              >
                <svg
                  width="14"
                  height="4"
                  viewBox="0 0 14 4"
                  fill="currentColor"
                >
                  <circle cx="2" cy="2" r="1.5" />
                  <circle cx="7" cy="2" r="1.5" />
                  <circle cx="12" cy="2" r="1.5" />
                </svg>
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-(--bg2) border border-(--bcolor1) rounded-lg shadow-lg py-1 w-32 z-50">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setIsEditing(true);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-(--color6) bg-transparent border-none hover:bg-(--bg3) cursor-pointer flex items-center gap-2"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-3 py-2 text-sm text-red-500 bg-transparent border-none hover:bg-(--bg3) cursor-pointer flex items-center gap-2"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 px-1">
          <div className="relative group">
            <div className="absolute bottom-full left-0 mb-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-(--bg2) rounded-full shadow-lg border border-(--bcolor1) px-1.5 py-1 flex items-center gap-0.5">
                {Object.entries(REACTIONS).map(([key, emoji]) => (
                  <button
                    key={key}
                    onClick={() =>
                      likeComment.mutate({
                        commentId: comment.id,
                        reaction: key,
                      })
                    }
                    title={key}
                    className="text-base hover:scale-125 transition-transform duration-150 bg-transparent border-none cursor-pointer p-0.5"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() =>
                likeComment.mutate({
                  commentId: comment.id,
                  reaction: currentReaction,
                })
              }
              className={`text-xs border-none bg-transparent cursor-pointer hover:underline ${isLiked ? "text-(--color5) font-medium" : "text-(--color7)"}`}
            >
              {isLiked ? `${REACTIONS[currentReaction] || "👍"} ` : ""}
              {isLiked
                ? currentReaction.charAt(0).toUpperCase() +
                  currentReaction.slice(1)
                : "Like"}
              {comment._count.likes > 0 && ` · ${comment._count.likes}`}
            </button>
          </div>
          <button
            onClick={() => {
              setShowReplyInput(!showReplyInput);
              if (!showReplies && comment._count.replies > 0)
                setShowReplies(true);
            }}
            className="text-xs text-(--color7) border-none bg-transparent cursor-pointer hover:underline"
          >
            Reply
          </button>
          <span className="text-xs text-(--color7)">
            {formatDistanceToNow(comment.createdAt)}
          </span>
        </div>

        {/* View replies toggle */}
        {comment._count.replies > 0 && !showReplies && (
          <button
            onClick={() => setShowReplies(true)}
            className="text-xs text-(--color5) mt-2 px-1 border-none bg-transparent cursor-pointer hover:underline"
          >
            View {comment._count.replies}{" "}
            {comment._count.replies === 1 ? "reply" : "replies"}
          </button>
        )}

        {/* Replies list */}
        {showReplies && (
          <div className="mt-3 pl-2">
            {repliesLoading && (
              <div className="flex py-2">
                <div className="w-4 h-4 border-2 border-(--color5) border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {replies?.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                commentId={comment.id}
                postId={postId}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}

        {/* Reply input */}
        {showReplyInput && (
          <form onSubmit={handleReplySubmit} className="mt-2">
            <div className="bg-(--comment-bg) rounded-[18px] py-1 px-2.5">
              <div className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/txt_img.png"
                  alt="You"
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
                <input
                  type="text"
                  className="bg-transparent border-none w-full h-8 px-2 text-xs text-(--color6) focus:outline-none placeholder:text-(--color7)"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={createReply.isPending || !replyText.trim()}
                  className="shrink-0 border-none bg-transparent text-(--color5) disabled:opacity-40"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 14 13">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Comment Section ───────────────────────────── */

function CommentSection({ postId }: { postId: string }) {
  const { data: comments, isLoading } = useComments(postId);
  const { data: currentUser } = useCurrentUser();
  const createComment = useCreateComment(postId);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await createComment.mutateAsync(newComment.trim());
    setNewComment("");
  };

  return (
    <div className="px-6 pt-4 pb-2">
      {/* Write comment input */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="bg-(--comment-bg) rounded-[18px] py-1 px-2.5">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUser?.image || "/default-avatar.png"}
              alt="You"
              className="w-6.5 h-6.5 rounded-full object-cover shrink-0"
            />
            <input
              type="text"
              className="bg-transparent border-none w-full h-10 px-2 text-sm text-(--color6) focus:outline-none placeholder:text-(--color7)"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={createComment.isPending || !newComment.trim()}
              className="shrink-0 border-none bg-transparent text-(--color5) disabled:opacity-40"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 14 13">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {isLoading && (
        <div className="flex justify-center py-3">
          <div className="w-5 h-5 border-2 border-(--color5) border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {comments?.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUserId={currentUser?.id}
        />
      ))}

      {comments && comments.length === 0 && (
        <p className="text-xs text-(--color7) text-center py-2">
          No comments yet
        </p>
      )}
    </div>
  );
}

/* ─── Post Card ─────────────────────────────────── */

export function FeedPostCard({
  post,
  currentUserId,
}: {
  post: Post;
  currentUserId?: string;
}) {
  const likePost = useLikePost();
  const deletePost = useDeletePost();
  const updateVisibility = useUpdateVisibility();
  const isLiked = post.likes.length > 0;
  const currentReaction = post.likes[0]?.reaction || "like";
  const isOwner = currentUserId === post.author.id;
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareModalMode, setShareModalMode] = useState<"share" | "list">(
    "share",
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const authorImage = post.author.image || "/images/post_img.png";
  const timeAgo = formatDistanceToNow(post.createdAt);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  const handleToggleVisibility = () => {
    const newVisibility = post.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC";
    updateVisibility.mutate({ postId: post.id, visibility: newVisibility });
    setShowMenu(false);
  };

  const handleDelete = () => {
    setShowMenu(false);
    toast("Are you sure you want to delete this post?", {
      action: {
        label: "Delete",
        onClick: () => {
          deletePost.mutate(post.id, {
            onSuccess: () => toast.success("Post deleted"),
            onError: () => toast.error("Failed to delete post"),
          });
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      duration: 10000,
    });
  };

  return (
    <div className="bg-(--bg2) rounded-md pb-6 pt-6 mb-4">
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="mr-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={authorImage}
                alt={authorName}
                className="w-11 h-11 rounded-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-normal text-base leading-[1.1] text-(--color6) cursor-pointer hover:underline">
                {authorName}
              </h4>
              <p className="font-normal text-sm leading-[1.2] text-(--color)">
                {timeAgo} .{" "}
                <span>
                  {post.visibility === "PUBLIC" ? "Public" : "Private"}
                </span>
              </p>
            </div>
          </div>
          {/* 3-dot menu — only for post owner */}
          {isOwner && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="border-none bg-transparent p-2 text-(--color6)"
              >
                <svg width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle
                    cx="2"
                    cy="2"
                    r="2"
                    fill="currentColor"
                    opacity=".4"
                  />
                  <circle
                    cx="2"
                    cy="8"
                    r="2"
                    fill="currentColor"
                    opacity=".4"
                  />
                  <circle
                    cx="2"
                    cy="15"
                    r="2"
                    fill="currentColor"
                    opacity=".4"
                  />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-(--bg2) border border-(--bcolor1) rounded-lg shadow-lg py-1 w-48 z-50">
                  <button
                    onClick={handleToggleVisibility}
                    className="w-full text-left px-4 py-2.5 text-sm text-(--color6) bg-transparent border-none hover:bg-(--bg3) transition-all flex items-center gap-2.5"
                  >
                    {post.visibility === "PUBLIC" ? (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Make Private
                      </>
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        Make Public
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 bg-transparent border-none hover:bg-(--bg3) transition-all flex items-center gap-2.5"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                    </svg>
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {post.content && (
          <p className="font-normal text-sm leading-5.25 text-(--color6) mb-4 whitespace-pre-line">
            {post.content}
          </p>
        )}

        {post.image && (
          <div className="mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt="Post"
              className="w-full h-auto rounded-md object-cover"
            />
          </div>
        )}
      </div>

      {/* Reactions summary */}
      <div className="flex items-center justify-between px-6 mb-4">
        {post._count.likes > 0 && post.recentLikers?.length > 0 ? (
          <AvatarGroup
            users={post.recentLikers.map((u) => ({
              id: u.id,
              src: u.image,
              alt: `${u.firstName} ${u.lastName}`,
            }))}
            max={5}
            total={post._count.likes}
            onClick={() => setShowLikesModal(true)}
          />
        ) : (
          <span />
        )}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-(--color) bg-transparent border-none cursor-pointer hover:underline"
          >
            {post._count.comments} Comment{post._count.comments !== 1 && "s"}
          </button>
          <button
            onClick={() => {
              if (post._count.shares > 0) {
                setShareModalMode("list");
                setShowShareModal(true);
              }
            }}
            className="text-sm text-(--color) bg-transparent border-none cursor-pointer hover:underline"
          >
            {post._count.shares} Share{post._count.shares !== 1 && "s"}
          </button>
        </div>
      </div>

      {/* Reaction buttons */}
      <div className="flex items-center bg-(--reaction-bg) rounded-md p-2 mx-6">
        <div className="flex-1 relative group mr-1">
          {/* Reaction popup — visible on hover/focus */}
          <div className="absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="bg-(--bg2) rounded-full shadow-lg border border-(--bcolor1) px-2 py-1.5 flex items-center gap-1">
              {Object.entries(REACTIONS).map(([key, emoji]) => (
                <button
                  key={key}
                  onClick={() =>
                    likePost.mutate({ postId: post.id, reaction: key })
                  }
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="text-2xl hover:scale-125 transition-transform duration-150 bg-transparent border-none cursor-pointer p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() =>
              likePost.mutate({ postId: post.id, reaction: currentReaction })
            }
            className={`w-full flex items-center justify-center h-11 gap-2 text-sm font-normal rounded-md border-none transition-all duration-200 ${
              isLiked
                ? "text-(--color5) bg-(--color9)"
                : "text-(--color6) bg-transparent hover:bg-(--color9)"
            }`}
          >
            {isLiked ? (
              <span className="text-lg">
                {REACTIONS[currentReaction] || "👍"}
              </span>
            ) : (
              <svg
                width="19"
                height="19"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            )}
            {isLiked
              ? currentReaction.charAt(0).toUpperCase() +
                currentReaction.slice(1)
              : "Like"}
          </button>
        </div>
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 flex items-center justify-center h-11 gap-2 text-sm font-normal rounded-md border-none mr-1 transition-all duration-200 ${
            showComments
              ? "text-(--color5) bg-(--color9)"
              : "text-(--color6) bg-transparent hover:bg-(--color9)"
          }`}
        >
          <svg width="21" height="21" fill="none" viewBox="0 0 21 21">
            <path
              stroke="currentColor"
              d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.938 9.313h7.125M10.5 14.063h3.563"
            />
          </svg>
          Comment
        </button>
        <button
          onClick={() => {
            setShareModalMode("share");
            setShowShareModal(true);
          }}
          className="flex-1 flex items-center justify-center h-11 gap-2 text-sm font-normal text-(--color6) bg-transparent rounded-md border-none transition-all duration-200 hover:bg-(--color9) cursor-pointer"
        >
          <svg width="24" height="21" fill="none" viewBox="0 0 24 21">
            <path
              stroke="currentColor"
              strokeLinejoin="round"
              d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
            />
          </svg>
          Share
        </button>
      </div>

      {showComments && <CommentSection postId={post.id} />}

      <LikesModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        type="post"
        id={post.id}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={post.id}
        mode={shareModalMode}
      />
    </div>
  );
}

/* ─── Feed Posts List ───────────────────────────── */

export default function FeedPosts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useFeed();
  const { data: currentUser } = useCurrentUser();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage)
          fetchNextPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-(--color5) border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-(--bg2) rounded-md p-6 text-center mb-4">
        <p className="text-(--color7)">
          Failed to load posts. Please try again.
        </p>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (posts.length === 0) {
    return (
      <div className="bg-(--bg2) rounded-md p-8 text-center mb-4">
        <p className="text-(--color7) text-base">
          No posts yet. Be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <FeedPostCard
          key={post.id}
          post={post}
          currentUserId={currentUser?.id}
        />
      ))}
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-(--color5) border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </>
  );
}
