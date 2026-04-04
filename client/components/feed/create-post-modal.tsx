"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useCreatePost } from "@/hooks/use-post-mutations";
import { useCurrentUser } from "@/hooks/use-current-user";
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

  if (!isOpen) return null;

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
      toast.error(
        err instanceof Error ? err.message : "Failed to create post",
      );
    }
  };

  const canPost = content.trim() || imageFile;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-(--bg2) w-full max-w-lg mx-auto my-auto rounded-lg shadow-xl flex flex-col max-h-[90vh] max-lg:max-w-none max-lg:max-h-none max-lg:h-full max-lg:rounded-none max-lg:my-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--bcolor1) shrink-0">
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-(--bg3) flex items-center justify-center border-none text-(--color7) hover:bg-(--bg4) transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M13 1L1 13M1 1l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
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

        {/* User info + visibility */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.image || "/default-avatar.png"}
            alt="Avatar"
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
                {visibility === "PUBLIC" ? "Public" : "Private"}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {showVisibilityMenu && (
                <div className="absolute top-full left-0 mt-1 bg-(--bg2) border border-(--bcolor1) rounded-md shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => { setVisibility("PUBLIC"); setShowVisibilityMenu(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs border-none cursor-pointer transition-all ${
                      visibility === "PUBLIC" ? "bg-(--color9) text-(--color5)" : "bg-transparent text-(--color6) hover:bg-(--bg3)"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    Public
                  </button>
                  <button
                    onClick={() => { setVisibility("PRIVATE"); setShowVisibilityMenu(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs border-none cursor-pointer transition-all ${
                      visibility === "PRIVATE" ? "bg-(--color9) text-(--color5)" : "bg-transparent text-(--color6) hover:bg-(--bg3)"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Private
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div className="flex-1 overflow-y-auto px-4">
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent border-none resize-none min-h-40 text-base text-(--color6) focus:outline-none placeholder:text-(--color7)"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Image preview */}
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

        {/* Bottom toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-(--bcolor1) shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent border-none text-(--color7) hover:bg-(--bg3) transition-all cursor-pointer"
            title="Add photo"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path fill="currentColor" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent border-none text-(--color7) transition-all opacity-50 cursor-not-allowed"
            disabled
            title="Add video"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 22 24">
              <path fill="currentColor" d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
