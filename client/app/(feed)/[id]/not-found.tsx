import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className="w-full max-w-170 mx-auto lg:w-1/2 lg:px-2 pt-6">
      <div className="bg-(--bg2) rounded-md py-16 px-6 flex flex-col items-center text-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-(--color7) mb-4"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" strokeLinecap="round" />
          <line
            x1="9"
            y1="9"
            x2="9.01"
            y2="9"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <line
            x1="15"
            y1="9"
            x2="15.01"
            y2="9"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
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
  );
}
