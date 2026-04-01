import Header from "@/components/feed/header";
import LeftSidebar from "@/components/feed/left-sidebar";
import MobileBottomNav from "@/components/feed/mobile-bottom-nav";
import MobileHeader from "@/components/feed/mobile-header";
import RightSidebar from "@/components/feed/right-sidebar";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col max-lg:h-full">
      <div className="w-full h-screen bg-(--bcolor1) overflow-hidden max-lg:h-full">
        <ThemeToggle />
        <Header />
        <MobileHeader />
        <MobileBottomNav />

        <div className="max-w-330 mx-auto px-3">
          <div className="relative pt-17.5 max-lg:pt-14 overflow-hidden">
            <div className="flex flex-wrap lg:-mx-2">
              <LeftSidebar />
              {children}
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
