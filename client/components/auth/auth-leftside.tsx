import Image from "next/image";

const AuthLeftside = ({ url, from }: { url: string; from: string }) => {
  return (
    <div className="w-full lg:w-2/3 lg:pr-8">
      <div>
        <Image
          src={url}
          alt="Image"
          width={from === "login" ? 620 : 856}
          height={500}
          priority
          className={`w-full h-auto ${from === "login" ? "max-w-158" : "max-w-214"}`}
        />
      </div>
    </div>
  );
};

export default AuthLeftside;
