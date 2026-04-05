"use client";

import { logoutAction } from "@/app/actions/auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  BellIcon,
  ChatBubbleIcon,
  DropdownChevronIcon,
  FriendsIcon,
  HomeIcon,
  LogOutIcon,
  SearchIcon,
} from "@/lib/svg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const DesktopMenuItem = ({
  link,
  icon,
  label,
  isActive = false,
}: {
  link: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}) => {
  return (
    <li className="mx-2 block h-full  group relative">
      <Link href={link} className="py-3.5 block">
        <span className="relative block px-4 py-3 cursor-pointer">
          {icon}
          {label && (
            <span className="absolute bg-(--color5) border border-(--bg2) rounded-[9px] min-w-4.25 h-4.25 text-[11px] leading-[1.4] text-center text-white top-1 right-1 p-0.75 flex items-center justify-center">
              {label}
            </span>
          )}
        </span>
      </Link>
      <div
        className={`absolute left-0 top-full  w-full h-[2.5px] block  bg-(--color5)   rounded-t-md shadow-lg ${isActive ? "opacity-100" : "opacity-0 group-hover:visible invisible"} group-hover:opacity-100   transition-opacity duration-200`}
      ></div>
    </li>
  );
};

export default function Header() {
  const { data: user } = useCurrentUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const userName = user ? `${user.firstName} ${user.lastName}` : "Loading...";
  const userImage = user?.image || "/images/profile.png";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  const handleLogout = async () => {
    const result = await logoutAction();
    if (result.success) {
      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  return (
    <nav className="bg-(--bg2) fixed top-0 right-0 left-0 z-1030 transition-all duration-200 max-lg:hidden">
      <div className="max-w-330 mx-auto px-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="Image"
                width={137}
                height={40}
                className="max-w-42.25 h-auto"
              />
            </Link>
          </div>

          {/* Search */}
          <div className="ml-auto my-3 text-(--color7)">
            <form className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                className="bg-(--bg3) border border-(--bg3) rounded-4xl w-106 h-10 py-1.75 px-11.75 transition-all duration-200 hover:border-(--color5) text-base text-(--color6) placeholder:text-gray-400/70  focus:outline-none"
                type="search"
                placeholder="input search text"
              />
            </form>
          </div>

          {/* Nav Items */}
          <ul className="flex items-center ml-auto h-full  mr-2 text-(--color6)">
            {/* Home */}

            <DesktopMenuItem
              link="/"
              icon={<HomeIcon className="text-(--color5)" />}
              label=""
              isActive={true}
            />
            {/* Friends */}
            <DesktopMenuItem
              link="#"
              icon={<FriendsIcon className="group-hover:text-(--color5)" />}
              label=""
            />
            {/* Notifications */}
            <DesktopMenuItem
              link="#"
              icon={<BellIcon className="group-hover:text-(--color5)" />}
              label="6"
            />
            {/* Messages */}
            <DesktopMenuItem
              link="#"
              icon={<ChatBubbleIcon className="group-hover:text-(--color5)" />}
              label="2"
            />
          </ul>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center cursor-pointer border-none bg-transparent"
            >
              <div className="mr-2 w-6 h-6 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={userImage}
                  alt="Profile"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-normal text-base leading-6 text-(--color6)">
                {userName}
              </span>
              <span
                className={`ml-2 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
              >
                <DropdownChevronIcon />
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-(--bg2) border border-(--bcolor1) rounded-lg shadow-lg w-56 z-50">
                {/* User info */}
                <div className="p-4 border-b border-(--bcolor1)">
                  <div className="flex items-center gap-3">
                    <Image
                      src={userImage}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-(--color6)">
                        {userName}
                      </p>
                      <p className="text-[10px] text-(--color7)">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 bg-transparent border-none hover:bg-(--bg3) transition-all flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOutIcon />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
