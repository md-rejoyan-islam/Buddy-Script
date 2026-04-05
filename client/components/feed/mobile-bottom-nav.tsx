import {
  BellIcon,
  ChatBubbleIcon,
  FriendsIcon,
  HamburgerMenuIcon,
  HomeIcon,
} from "@/lib/svg";
import Link from "next/link";

export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-1030 bg-(--bg2) border-t border-(--bcolor1) hidden max-lg:block">
      <div className="px-4">
        <ul className="flex items-center justify-between py-3">
          {/* Home */}
          <li>
            <Link href="/feed" className="flex items-center justify-center p-2">
              <HomeIcon className="text-(--color5)" />
            </Link>
          </li>
          {/* Friends */}
          <li>
            <Link href="#" className="flex items-center justify-center p-2">
              <FriendsIcon className="text-(--color6)" />
            </Link>
          </li>
          {/* Notifications */}
          <li>
            <span className="relative flex items-center justify-center p-2 cursor-pointer">
              <BellIcon className="text-(--color6)" />
              <span className="absolute bg-(--color5) border border-white rounded-[9px] min-w-4.25 h-4.25 text-[11px] leading-[1.4] text-center text-white top-1 right-0 p-0.75 flex items-center justify-center">
                6
              </span>
            </span>
          </li>
          {/* Messages */}
          <li>
            <Link
              href="#"
              className="relative flex items-center justify-center p-2"
            >
              <ChatBubbleIcon className="text-(--color6)" />
              <span className="absolute bg-(--color5) border border-white rounded-[9px] min-w-4.25 h-4.25 text-[11px] leading-[1.4] text-center text-white top-1 right-0 p-0.75 flex items-center justify-center">
                2
              </span>
            </Link>
          </li>
          {/* Menu */}
          <li>
            <button
              type="button"
              className="flex items-center justify-center p-2 border-none bg-transparent"
            >
              <HamburgerMenuIcon className="text-(--color7)" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
