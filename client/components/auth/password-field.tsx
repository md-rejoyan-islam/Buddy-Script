"use client";

import { EyeIcon, EyeOffIcon } from "@/lib/svg";
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
            {show ? <EyeOffIcon /> : <EyeIcon />}
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
