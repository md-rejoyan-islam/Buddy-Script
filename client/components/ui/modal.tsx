"use client";

import { CloseIcon } from "@/lib/svg";
import { useEffect } from "react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  /** Make modal full-screen on mobile */
  fullScreenOnMobile?: boolean;
  /** Show the default close button in the header */
  showCloseButton?: boolean;
  /** Close when clicking the backdrop */
  closeOnBackdropClick?: boolean;
  /** Close when pressing Escape */
  closeOnEscape?: boolean;
  /** Extra class for the modal content wrapper */
  className?: string;
  /** Custom header (replaces default title + close layout) */
  header?: React.ReactNode;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-4xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  fullScreenOnMobile = false,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = "",
  header,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const mobileFull = fullScreenOnMobile
    ? "max-lg:max-w-none max-lg:max-h-none max-lg:h-full max-lg:rounded-none max-lg:my-0"
    : "";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      <div
        className={`relative bg-(--bg2) rounded-lg w-full ${sizeClasses[size]} mx-4 shadow-xl flex flex-col max-h-[90vh] ${mobileFull} ${className}`}
      >
        {header ? (
          header
        ) : (title || showCloseButton) ? (
          <div className="flex items-center justify-between p-4 border-b border-(--bcolor1) shrink-0">
            {title ? (
              <h3 className="text-lg font-semibold text-(--color6)">{title}</h3>
            ) : (
              <span />
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-(--bg3) flex items-center justify-center border-none text-(--color7) hover:bg-(--bg4) transition-all cursor-pointer"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <div className="border-t border-(--bcolor1) shrink-0">{footer}</div>
        )}
      </div>
    </div>
  );
}
