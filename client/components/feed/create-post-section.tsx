"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import CreatePostModal from "./create-post-modal";

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
    <path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z"/>
  </svg>
);

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
    <path fill="#666" d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z"/>
  </svg>
);

const EventIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
    <path fill="#666" d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698z"/>
  </svg>
);

const ArticleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="none" viewBox="0 0 18 20">
    <path fill="#666" d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056z"/>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
    <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88z" clipRule="evenodd"/>
  </svg>
);

export default function CreatePostSection() {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePostClick = () => {
    if (!content.trim() && !imageFile) {
      return;
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="bg-(--bg2) rounded-md mb-4 overflow-hidden">
        <div className="pt-6 px-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10">
              <Image
                src="/images/txt_img.png"
                alt="Image"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1 relative">
              <div className="flex items-center">
                <textarea
                  className="w-full bg-transparent border-none resize-none h-15 text-base text-(--color7) focus:outline-none"
                  placeholder="Write something ..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="24"
                  fill="none"
                  viewBox="0 0 23 24"
                  className="shrink-0 ml-2"
                >
                  <path
                    fill="#666"
                    d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Image preview */}
          {imagePreview && (
            <div className="mt-3 relative">
              <Image
                src={imagePreview}
                alt="Preview"
                width={400}
                height={200}
                className="w-full max-h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center border-none text-xs hover:bg-black/80"
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

        {/* Action buttons - Desktop */}
        <div className="flex items-center justify-between bg-(--reaction-bg) px-6 m-4 rounded-sm py-3 max-lg:hidden">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-transparent border-none text-sm text-(--color7) py-2 px-3 rounded-md hover:bg-(--bg3) transition-all duration-200"
            >
              <span className="text-(--color7)"><PhotoIcon /></span>
              Photo
            </button>
            {[
              { label: "Video", icon: <VideoIcon /> },
              { label: "Event", icon: <EventIcon /> },
              { label: "Article", icon: <ArticleIcon /> },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex items-center gap-2 bg-transparent border-none text-sm text-(--color7) py-2 px-3 rounded-md hover:bg-(--bg3) transition-all duration-200 opacity-50 cursor-not-allowed"
                disabled
              >
                <span className="text-(--color7)">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handlePostClick}
            className="bg-(--color5) border border-transparent rounded-md py-2 px-5 flex items-center gap-2 text-white text-sm font-medium hover:shadow-[rgba(149,157,165,0.2)_0px_8px_24px] transition-all"
          >
            <SendIcon />
            <span>Post</span>
          </button>
        </div>

        {/* Action buttons - Mobile */}
        <div className="hidden max-lg:block bg-(--reaction-bg) px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-transparent border-none p-1 text-(--color7)"
              >
                <PhotoIcon />
              </button>
              {[<VideoIcon key="v" />, <EventIcon key="e" />, <ArticleIcon key="a" />].map(
                (icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="bg-transparent border-none p-1 text-(--color7) opacity-50 cursor-not-allowed"
                    disabled
                  >
                    {icon}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              onClick={handlePostClick}
              className="bg-(--color5) border border-transparent rounded-md py-2 px-5 flex items-center gap-2 text-white text-sm font-medium"
            >
              <SendIcon />
              <span>Post</span>
            </button>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={showModal}
        onClose={handleModalClose}
        content={content}
        imageFile={imageFile}
      />
    </>
  );
}
