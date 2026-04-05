import { SadFaceIcon } from "@/lib/svg";
import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className="w-full  max-w-170 mx-auto lg:w-1/2 lg:px-2 py-6">
      <div>
        <div className="bg-(--bg2)   rounded-md py-16 px-6 flex flex-col items-center text-center">
          <SadFaceIcon size={64} className="text-(--color7) mb-4" />
          <h2 className="text-xl font-semibold text-(--color6) mb-2">
            Post Not Found
          </h2>
          <p className="text-sm text-(--color7) mb-6">
            This post may have been deleted or you don&apos;t have permission to
            view it.
          </p>
          <Link
            href="/"
            className="bg-(--color5) text-white text-sm font-medium py-2.5 px-6 rounded-md hover:shadow-md transition-all"
          >
            Back to Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
