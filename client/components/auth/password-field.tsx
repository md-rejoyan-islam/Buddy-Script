"use client";

import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

const PasswordField = ({
  label,
  registration,
  error,
}: {
  label: string;
  registration?: UseFormRegisterReturn;
  error?: FieldError;
}) => {
  const [show, setShow] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="mb-3.5">
      <label className="font-medium text-base leading-[1.4] text-(--color4) mb-2 block">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...registration}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            registration?.onChange(e);
          }}
          className={`w-full bg-(--bg2) border border-solid rounded-md h-12 px-3 pr-10 text-[13px] text-(--color) focus:outline-none focus:border-(--color5) transition-all duration-200 box-border ${
            error ? "border-red-500" : "border-(--bcolor1)"
          }`}
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-(--color6) hover:text-(--color)"
          >
            {show ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default PasswordField;
