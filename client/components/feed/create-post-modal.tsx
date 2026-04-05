"use client";

import Modal from "@/components/ui/modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCreatePost } from "@/hooks/use-post-mutations";
import {
  ChevronDownIcon,
  CloseIcon,
  PhotoIcon,
  PrivateLockIcon,
  PublicGlobeIcon,
  VideoIcon,
} from "@/lib/svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreatePostModal({ isOpen, onClose }: Props) {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const createPost = useCreatePost();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    setVisibility("PUBLIC");
    setShowVisibilityMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) {
      toast.error("Please write something or add an image");
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
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  const canPost = content.trim() || imageFile;

  const customHeader = (
    <div className="flex items-center justify-between p-4 border-b border-(--bcolor1) shrink-0">
      <button
        onClick={handleClose}
        className="w-8 h-8 rounded-full bg-(--bg3) flex items-center justify-center border-none text-(--color7) hover:bg-(--bg4) transition-all cursor-pointer"
      >
        <CloseIcon />
      </button>
      <h3 className="text-lg font-semibold text-(--color6)">Create Post</h3>
      <button
        onClick={handleSubmit}
        disabled={!canPost || createPost.isPending}
        className={`py-1.5 px-5 rounded-md text-sm font-semibold border-none transition-all ${
          canPost
            ? "bg-(--color5) text-white cursor-pointer hover:shadow-md"
            : "bg-(--bg3) text-(--color7) cursor-not-allowed"
        } disabled:opacity-60`}
      >
        {createPost.isPending ? "Posting..." : "Post"}
      </button>
    </div>
  );

  const footer = (
    <div className="flex items-center gap-2 px-4 py-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent border-none text-(--color7) hover:bg-(--bg3) transition-all cursor-pointer"
        title="Add photo"
      >
        <PhotoIcon />
      </button>
      <button
        type="button"
        className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent border-none text-(--color7) transition-all opacity-50 cursor-not-allowed"
        disabled
        title="Add video"
      >
        <VideoIcon size={20} />
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      fullScreenOnMobile
      header={customHeader}
      footer={footer}
    >
      {/* User info + visibility */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
        <Image
          src={user?.image || "/images/Avatar.png"}
          alt="Avatar"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-(--color6)">
            {user?.firstName} {user?.lastName}
          </p>
          <div className="relative">
            <button
              onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
              className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full border border-(--bcolor1) bg-transparent text-xs font-medium text-(--color5) cursor-pointer hover:bg-(--bg3) transition-all"
            >
              {visibility === "PUBLIC" ? (
                <PublicGlobeIcon size={12} />
              ) : (
                <PrivateLockIcon size={12} />
              )}
              {visibility === "PUBLIC" ? "Public" : "Private"}
              <ChevronDownIcon />
            </button>
            {showVisibilityMenu && (
              <div className="absolute top-full left-0 mt-1 bg-(--bg2) border border-(--bcolor1) rounded-md shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setVisibility("PUBLIC");
                    setShowVisibilityMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs border-none cursor-pointer transition-all ${
                    visibility === "PUBLIC"
                      ? "bg-(--color9) text-(--color5)"
                      : "bg-transparent text-(--color6) hover:bg-(--bg3)"
                  }`}
                >
                  <PublicGlobeIcon />
                  Public
                </button>
                <button
                  onClick={() => {
                    setVisibility("PRIVATE");
                    setShowVisibilityMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs border-none cursor-pointer transition-all ${
                    visibility === "PRIVATE"
                      ? "bg-(--color9) text-(--color5)"
                      : "bg-transparent text-(--color6) hover:bg-(--bg3)"
                  }`}
                >
                  <PrivateLockIcon />
                  Private
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div className="px-4">
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent border-none resize-none min-h-40 text-base text-(--color6) focus:outline-none placeholder:text-(--color7)"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {imagePreview && (
          <div className="relative mb-4">
            <Image
              src={imagePreview}
              alt="Preview"
              width={500}
              height={300}
              className="w-full h-auto max-h-60 object-cover rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center border-none text-xs hover:bg-black/80 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleImageSelect}
      />
    </Modal>
  );
}
