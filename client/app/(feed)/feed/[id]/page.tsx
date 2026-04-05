import PostDetail from "@/components/feed/single-post/post-detail";
import type { Post } from "@/hooks/use-feed";
import { apiProxy } from "@/lib/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

async function getPost(id: string): Promise<Post | null> {
  const res = await apiProxy<Post>(`/api/v1/posts/${id}`);
  if (!res.success || !res.data) return null;
  return res.data;
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post?.id) {
    return {
      title: "Post Not Found - Buddy Script",
    };
  }

  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const description = post.content
    ? post.content.slice(0, 160)
    : `Post by ${authorName} on Buddy Script`;
  const title = `${authorName} on Buddy Script`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(post.image && {
        images: [
          {
            url: post.image,
            width: 1200,
            height: 630,
            alt: description,
          },
        ],
      }),
    },
    twitter: {
      card: post.image ? "summary_large_image" : "summary",
      title,
      description,
      ...(post.image && { images: [post.image] }),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post?.id) {
    notFound();
  }

  return (
    <div className="w-full max-w-170 mx-auto lg:w-1/2 lg:px-2">
      <div className="h-[calc(100vh-75px)] max-lg:h-full overflow-y-auto overflow-x-hidden pt-6">
        <PostDetail post={post} />
      </div>
    </div>
  );
}
