import { OnlineDotIcon, SearchIcon } from "@/lib/svg";
import Image from "next/image";
import Link from "next/link";

const friends = [
  {
    name: "Steve Jobs",
    role: "CEO of Apple",
    img: "/images/people1.png",
    online: false,
    lastSeen: "5 minute ago",
  },
  {
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    img: "/images/people2.png",
    online: true,
  },
  {
    name: "Dylan Field",
    role: "CEO of Figma",
    img: "/images/people3.png",
    online: true,
  },
  {
    name: "Steve Jobs",
    role: "CEO of Apple",
    img: "/images/people1.png",
    online: false,
    lastSeen: "5 minute ago",
  },
  {
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    img: "/images/people2.png",
    online: true,
  },
  {
    name: "Dylan Field",
    role: "CEO of Figma",
    img: "/images/people3.png",
    online: true,
  },
  {
    name: "Dylan Field",
    role: "CEO of Figma",
    img: "/images/people3.png",
    online: true,
  },
  {
    name: "Steve Jobs",
    role: "CEO of Apple",
    img: "/images/people1.png",
    online: false,
    lastSeen: "5 minute ago",
  },
];

export default function RightSidebar() {
  return (
    <div className="w-full lg:w-1/4 max-lg:hidden lg:px-2">
      <div className="h-[calc(100vh-75px)] flex flex-col overflow-auto flex-1 pt-4.5">
        {/* You Might Like */}
        <div className="bg-(--bg2) rounded-md mb-4 transition-all duration-200 pt-6 pb-6 px-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-medium text-xl leading-[1.4] text-(--color6)">
              You Might Like
            </h4>
            <Link
              href="#0"
              className="font-medium text-xs leading-4.5 text-(--color5)"
            >
              See All
            </Link>
          </div>
          <hr className="bg-(--bg4) my-1 mx-0 border-0 h-px" />
          <div className="my-6">
            <div className="flex items-center mb-4">
              <div className="mr-5">
                <Link href="#">
                  <Image
                    src="/images/Avatar.png"
                    alt="Image"
                    width={50}
                    height={50}
                    className="w-12.5 h-12.5 rounded-full object-cover"
                  />
                </Link>
              </div>
              <div>
                <Link href="#">
                  <h4 className="font-medium text-base leading-6 text-(--color6)">
                    Radovan SkillArena
                  </h4>
                </Link>
                <p className="font-normal text-xs leading-4.5 text-(--color7)">
                  Founder & CEO at Trophy
                </p>
              </div>
            </div>
            <div className="flex w-full gap-2">
              <button
                type="button"
                className="flex-1 rounded-md py-2.25 border border-(--color5) bg-transparent font-medium text-sm leading-5.5 text-(--color7) transition-all duration-200 hover:bg-(--color5) hover:text-white"
              >
                Ignore
              </button>
              <button
                type="button"
                className="flex-1 rounded-md py-2.25 border border-(--color5) bg-(--color5) font-medium text-sm leading-5.5 text-white transition-all duration-200 hover:bg-(--color5) hover:text-white"
              >
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Your Friends */}
        <div className="bg-(--bg2) rounded-md mb-4 transition-all duration-200 pt-6 pb-1.5 px-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-medium text-xl leading-[1.4] text-(--color6)">
              Your Friends
            </h4>
            <Link
              href="#"
              className="font-medium text-xs leading-4.5 text-(--color5)"
            >
              See All
            </Link>
          </div>
          {/* Search */}
          <form className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color7)" />
            <input
              className="bg-(--bg3) border border-(--bg3) rounded-4xl w-full h-10 py-1.75 px-10 transition-all duration-200 hover:border-(--color5) text-sm placeholder:text-sm placeholder:text-(--color7) focus:outline-none"
              type="search"
              placeholder="input search text"
            />
          </form>

          {/* Friends list */}
          {friends.map((friend, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-3 px-2 rounded-md transition-all duration-200 cursor-pointer hover:bg-(--bg3) ${!friend.online ? "opacity-70" : ""}`}
            >
              <div className="flex items-center flex-1">
                <div className="mr-3 shrink-0">
                  <Link href="#">
                    <Image
                      src={friend.img}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href="#">
                    <h4 className="font-medium text-sm leading-[1.4] text-(--color6) truncate">
                      {friend.name}
                    </h4>
                  </Link>
                  <p className="font-normal text-[11px] leading-[1.4] text-(--color7) truncate">
                    {friend.role}
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-2">
                {friend.online ? (
                  <OnlineDotIcon />
                ) : (
                  <span className="text-xs text-(--color7)">
                    {friend.lastSeen}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
