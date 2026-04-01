import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen bg-(--bg1) flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-[120px] font-bold text-(--color5) leading-none mb-2">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-(--color6) mb-4">
          Page Not Found
        </h2>
        <p className="text-base text-(--color7) mb-8">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link
          href="/"
          className="inline-block py-3 px-8 bg-(--color5) text-white font-medium text-base rounded-md hover:shadow-[rgba(149,157,165,0.2)_0px_8px_24px] transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
