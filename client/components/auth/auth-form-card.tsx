import Image from "next/image";
import Link from "next/link";

const AuthFormCard = ({
  title,
  subtitle,
  from,
  children,
}: {
  title: string;
  subtitle: string;
  from: "login" | "registration";
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full lg:w-1/3 lg:max-w-104">
      <div className="bg-white p-12 rounded-md max-lg:mt-8 max-lg:text-center">
        {/* Logo */}
        <div className="mb-7">
          <Image
            src="/images/logo.svg"
            alt="Image"
            width={161}
            height={40}
            className="max-w-40.25 h-auto mx-auto"
          />
        </div>

        {/* Get Started text */}
        <p className="font-normal text-base leading-[1.4] text-(--color) text-center mb-2">
          {title}
        </p>
        <h4 className="text-[28px] text-center font-medium text-(--color2) leading-[1.2] mb-12.5 max-2xl:text-[22px]">
          {subtitle}
        </h4>

        {/* Google register button */}
        <button
          type="button"
          className="border border-solid border-[#F0F2F5] bg-white rounded-md py-3 px-15 flex items-center justify-center mb-10 w-full max-xl:px-10"
        >
          <Image
            src="/images/google.svg"
            alt="Image"
            width={20}
            height={20}
            className="max-w-5 h-5 mr-2"
          />
          <span className="font-medium text-base leading-[1.4] text-(--color2) shrink-0 max-xl:text-[13px]">
            {from === "login"
              ? "Or sign-in with google"
              : "Register with google"}
          </span>
        </button>

        {/* Or divider */}
        <div className="text-center relative mb-10 flex items-center justify-center">
          <div className="flex-1 h-px bg-(--bg4)"></div>
          <span className="font-normal text-sm leading-[1.4] text-(--color3) px-3">
            Or
          </span>
          <div className="flex-1 h-px bg-(--bg4)"></div>
        </div>

        {/*  form */}
        {children}

        {/* Bottom text */}
        <div className="text-center">
          <p className="text-sm text-[#767676] ">
            {from === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Link
              href={`/${from === "login" ? "registration" : "login"}`}
              className="text-(--color5)"
            >
              {from === "login" ? "Create New Account" : "Login now"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthFormCard;
