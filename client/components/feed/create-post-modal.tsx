"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useCreatePost } from "@/hooks/use-post-mutations";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  imageFile: File | null;
};

export default function CreatePostModal({
  isOpen,
  onClose,
  content,
  imageFile,
}: Props) {
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const createPost = useCreatePost();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Please write something");
      return;
    }

    const formData = new FormData();
    formData.append("content", content.trim());
    formData.append("visibility", visibility);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await createPost.mutateAsync(formData);
      toast.success("Post created successfully!");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create post",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-(--bg2) rounded-lg w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--bcolor1)">
          <h3 className="text-lg font-semibold text-(--color6)">Create Post</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-(--bg3) flex items-center justify-center border-none text-(--color7) hover:bg-(--bg4) transition-all"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 1L1 13M1 1l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Content preview */}
        <div className="p-4">
          <p className="text-sm text-(--color6) whitespace-pre-wrap mb-3">
            {content}
          </p>

          {imageFile && (
            <div className="mb-4 rounded-lg overflow-hidden max-h-60">
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                width={400}
                height={300}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          )}

          {/* Visibility selector */}
          <div className="mb-4">
            <label className="text-sm font-medium text-(--color6) block mb-2">
              Who can see this post?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVisibility("PUBLIC")}
                className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                  visibility === "PUBLIC"
                    ? "bg-(--color5) text-white border-(--color5)"
                    : "bg-transparent text-(--color7) border-(--bcolor1) hover:border-(--color5)"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
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
                  Public
                </div>
              </button>
              <button
                type="button"
                onClick={() => setVisibility("PRIVATE")}
                className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                  visibility === "PRIVATE"
                    ? "bg-(--color5) text-white border-(--color5)"
                    : "bg-transparent text-(--color7) border-(--bcolor1) hover:border-(--color5)"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Private
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-(--bcolor1)">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-md text-sm font-medium text-(--color7) border border-(--bcolor1) bg-transparent hover:bg-(--bg3) transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={createPost.isPending}
            className="py-2 px-5 rounded-md text-sm font-medium text-white bg-(--color5) border border-transparent hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createPost.isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
