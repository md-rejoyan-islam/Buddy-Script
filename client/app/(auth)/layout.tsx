import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="relative z-1 bg-(--bg1) py-25 max-md:py-12.5 min-h-screen overflow-hidden">
      {/* Shape decorations */}
      <div className="absolute top-0 left-0 z-[-1] max-lg:hidden xl:w-auto lg:w-37.5">
        <Image
          src="/images/shape1.svg"
          alt=""
          width={176}
          height={540}
          className="block w-full h-auto"
        />
      </div>
      <div className="absolute top-0 right-5 z-[-1] max-lg:hidden xl:w-auto lg:w-112.5">
        <Image
          src="/images/shape2.svg"
          alt=""
          width={568}
          height={400}
          className="block w-full h-auto"
        />
      </div>
      <div className="absolute bottom-0 z-[-1] max-lg:hidden right-81.75 min-[1500px]:right-56.5 min-[1500px]:w-100 lg:right-0 lg:w-123.5 xl:right-81.75 xl:w-auto">
        <Image
          src="/images/shape3.svg"
          alt=""
          width={568}
          height={548}
          className="block w-full h-auto"
        />
      </div>
      <div className="lg:max-w-330 sm:max-w-2xl md:max-w-3xl   mx-auto px-4 sm:px-10 xl:px-3">
        <div className="flex flex-wrap items-center">{children}</div>
      </div>
    </section>
  );
}
