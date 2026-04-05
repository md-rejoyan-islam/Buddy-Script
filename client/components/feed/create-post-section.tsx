"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import {
  ArticleIcon,
  EditPenIcon,
  EventIcon,
  PhotoIcon,
  SendIcon,
  VideoIcon,
} from "@/lib/svg";
import Image from "next/image";
import { useState } from "react";
import CreatePostModal from "./create-post-modal";

export default function CreatePostSection() {
  const [showModal, setShowModal] = useState(false);
  const { data: user } = useCurrentUser();

  return (
    <>
      <div className="bg-(--bg2) rounded-md mb-4 overflow-hidden">
        <div className="pt-6 px-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10">
              <Image
                src={user?.image || "/images/Avatar.png"}
                alt="Avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1 relative">
              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center bg-transparent border-none cursor-pointer text-left  text-base text-(--color7)"
              >
                <span className="flex-1">Write something ...</span>
                <EditPenIcon className="shrink-0 ml-2 text-(--color7)" />
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons - Desktop */}
        <div className="flex items-center justify-between bg-[#F3F9FF] dark:bg-(--reaction-bg) px-6 m-4 rounded-sm py-3 max-lg:hidden">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-transparent border-none text-sm text-(--color7) py-2 px-3 rounded-md hover:text-(--color5) group transition-all duration-200 cursor-pointer"
            >
              <span className="text-(--color7)">
                <PhotoIcon className="group-hover:text-(--color5)" />
              </span>
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
            onClick={() => setShowModal(true)}
            className="bg-(--color5) border border-transparent rounded-md py-2 px-5 flex items-center gap-2 text-white text-sm font-medium hover:shadow-[rgba(149,157,165,0.2)_0px_8px_24px] transition-all cursor-pointer"
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
                onClick={() => setShowModal(true)}
                className="bg-transparent border-none p-1 text-(--color7) cursor-pointer"
              >
                <PhotoIcon />
              </button>
              {[
                <VideoIcon key="v" />,
                <EventIcon key="e" />,
                <ArticleIcon key="a" />,
              ].map((icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="bg-transparent border-none p-1 text-(--color7) opacity-50 cursor-not-allowed"
                  disabled
                >
                  {icon}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-(--color5) border border-transparent rounded-md py-2 px-5 flex items-center gap-2 text-white text-sm font-medium cursor-pointer"
            >
              <SendIcon />
              <span>Post</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <CreatePostModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
