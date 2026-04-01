"use client";

import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function GoogleButton({ from }: { from: "login" | "registration" }) {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/v1/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="border border-solid border-[#F0F2F5] bg-white rounded-md py-3 px-15 flex items-center justify-center mb-10 w-full max-xl:px-10 cursor-pointer"
    >
      <Image
        src="/images/google.svg"
        alt="Image"
        width={20}
        height={20}
        className="max-w-5 h-5 mr-2"
      />
      <span className="font-medium text-base leading-[1.4] text-(--color2) shrink-0 max-xl:text-[13px]">
        {from === "login"
          ? "Or sign-in with google"
          : "Register with google"}
      </span>
    </button>
  );
}
