import {
  BookmarksIcon,
  FindFriendsIcon,
  GamingIcon,
  GroupsIcon,
  InsightsIcon,
  LearningIcon,
  SavePostIcon,
  SettingsIcon,
} from "@/lib/svg";
import Image from "next/image";
import Link from "next/link";

const exploreItems = [
  { label: "Learning", badge: "New", href: "#0", icon: <LearningIcon className="text-(--color7)" /> },
  { label: "Insights", href: "#0", icon: <InsightsIcon className="text-(--color7)" /> },
  { label: "Find friends", href: "#0", icon: <FindFriendsIcon className="text-(--color7)" /> },
  { label: "Bookmarks", href: "#0", icon: <BookmarksIcon className="text-(--color7)" /> },
  { label: "Groups", href: "#0", icon: <GroupsIcon className="text-(--color7)" /> },
  { label: "Gaming", badge: "New", href: "#0", icon: <GamingIcon className="text-(--color7)" /> },
  { label: "Settings", href: "#0", icon: <SettingsIcon className="text-(--color7)" /> },
  { label: "Save post", href: "#0", icon: <SavePostIcon className="text-(--color7)" /> },
];

const suggestedPeople = [
  { name: "Steve Jobs", role: "CEO of Apple", img: "/images/people1.png" },
  {
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    img: "/images/people2.png",
  },
  { name: "Dylan Field", role: "CEO of Figma", img: "/images/people3.png" },
];

export default function LeftSidebar() {
  return (
    <div className="w-full lg:w-1/4 max-lg:hidden lg:px-2">
      <div className="h-[calc(100vh-75px)] flex flex-col overflow-auto flex-1 pt-4.5">
        {/* Explore */}
        <div className="bg-(--bg2) rounded-md mb-4 transition-all duration-200 pt-6 pb-1.5 px-6">
          <h4 className="font-medium text-xl leading-[1.4] text-(--color6) mb-6">
            Explore
          </h4>
          <ul>
            {exploreItems.map((item, i) => (
              <li
                key={i}
                className="mb-6 flex items-center justify-between relative"
              >
                <Link
                  href={item.href}
                  className="font-medium text-base leading-[1.4] text-(--color7) flex items-center transition-all duration-200 w-full hover:text-(--color5)"
                >
                  <span className="mr-3.5">{item.icon}</span>
                  {item.label}
                </Link>
                {item.badge && (
                  <span className="font-normal text-[13px] leading-[1.4] text-white bg-(--color8) border-2 border-(--color8) rounded-lg w-9 h-6 flex items-center justify-center absolute right-0">
                    {item.badge}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested People */}
        <div className="bg-(--bg2) rounded-md mb-4 transition-all duration-200 pt-6 pb-1.5 px-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-medium text-xl leading-[1.4] text-(--color6)">
              Suggested People
            </h4>
            <Link
              href="#0"
              className="font-medium text-xs leading-4.5 text-(--color5)"
            >
              See All
            </Link>
          </div>
          {suggestedPeople.map((person, i) => (
            <div
              key={i}
              className="flex items-center justify-between mb-6 flex-wrap"
            >
              <div className="flex items-center flex-1">
                <div className="mr-4">
                  <Link href="#">
                    <Image
                      src={person.img}
                      alt="Image"
                      width={37}
                      height={37}
                      className="w-9.25 h-9.25 object-cover rounded-full"
                    />
                  </Link>
                </div>
                <div className="flex-1">
                  <Link href="#">
                    <h4 className="font-medium text-sm leading-[1.1] text-(--color6)">
                      {person.name}
                    </h4>
                  </Link>
                  <p className="font-light text-[11px] leading-[1.4] text-(--color6)">
                    {person.role}
                  </p>
                </div>
              </div>
              <div>
                <Link
                  href="#0"
                  className="bg-(--bg2) border border-(--color5) rounded-sm font-medium text-xs leading-[1.4] text-(--color7) py-1.75 px-1.75 block transition-all duration-200 hover:text-white hover:bg-(--color5) hover:border-(--color5)"
                >
                  Connect
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Events */}
        <div className="bg-(--bg2) rounded-md mb-4 transition-all duration-200 pt-6 pb-1.5 px-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-medium text-xl leading-[1.4] text-(--color6)">
              Events
            </h4>
            <Link
              href="#"
              className="font-medium text-xs leading-4.5 text-(--color5) block cursor-pointer py-1.25 px-px"
            >
              See all
            </Link>
          </div>
          {[1, 2].map((_, i) => (
            <Link key={i} href="#" className="block">
              <div className="bg-(--bg2) shadow-[0px_4px_8px_rgba(0,0,0,0.08)] rounded-md mb-4 cursor-pointer">
                <div>
                  <Image
                    src="/images/feed_event1.png"
                    alt="Image"
                    width={300}
                    height={150}
                    className="rounded-md w-full h-auto"
                  />
                </div>
                <div className="p-[20px_16px_14px_16px] flex items-center">
                  <div className="bg-(--color8) rounded-sm w-fit p-2 text-center">
                    <p className="font-bold text-lg leading-[1.1] text-white">
                      10
                    </p>
                    <p className="font-normal text-lg leading-[1.1] text-white">
                      Jul
                    </p>
                  </div>
                  <div className="py-1.25 pl-2">
                    <h4 className="font-medium text-base leading-[1.4] text-(--color6)">
                      No more terrorism no more cry
                    </h4>
                  </div>
                </div>
                <hr className="bg-(--bg4) my-1 mx-0 border-0 h-px" />
                <div className="flex items-center justify-between px-4 pb-3 pt-0.5">
                  <p className="font-medium text-xs leading-4.5 text-(--color7) opacity-70">
                    17 People Going
                  </p>
                  <span className="font-medium text-xs leading-4.5 text-(--color5) block bg-transparent border border-(--color5) rounded-sm py-0.75 px-3.5 transition-all duration-200 hover:text-white hover:bg-(--color5)">
                    Going
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
