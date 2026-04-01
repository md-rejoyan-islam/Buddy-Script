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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              fill="none"
              viewBox="0 0 17 17"
            >
              <circle cx="7" cy="7" r="6" stroke="currentColor" />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                d="M16 16l-3-3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
