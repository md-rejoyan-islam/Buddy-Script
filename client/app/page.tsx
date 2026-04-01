import FeedContent from "@/components/feed/feed-content";
import FeedLayout from "@/components/feed/feed-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed - Buddy Script",
  description:
    "Stay connected with friends, share updates, photos, and moments. Explore your personalized feed on Buddy Script.",
  keywords: [
    "social media",
    "feed",
    "buddy script",
    "posts",
    "friends",
    "community",
  ],
  openGraph: {
    title: "Feed - Buddy Script",
    description:
      "Stay connected with friends, share updates, photos, and moments on Buddy Script.",
    type: "website",
  },
};

export default async function HomePage() {
  return (
    <FeedLayout>
      <FeedContent />
    </FeedLayout>
  );
}
