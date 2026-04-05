import { SearchIcon } from "@/lib/svg";
import Image from "next/image";

export default function MobileHeader() {
  return (
    <div className="hidden max-lg:block fixed top-0 right-0 left-0 z-1030 bg-(--bg2) px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <a href="/feed">
            <Image
              src="/images/logo.svg"
              alt="Image"
              width={169}
              height={40}
              className="max-w-42.25 h-auto"
            />
          </a>
        </div>
        <div className="flex items-center">
          <a href="#0" className="block mr-4 cursor-pointer text-(--color7)">
            <SearchIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
