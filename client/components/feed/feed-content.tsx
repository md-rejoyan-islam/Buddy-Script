import Image from "next/image";

const PhotoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      fill="#666"
      d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z"
    />
  </svg>
);

const VideoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="24"
    fill="none"
    viewBox="0 0 22 24"
  >
    <path
      fill="#666"
      d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z"
    />
  </svg>
);

const EventIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="24"
    fill="none"
    viewBox="0 0 22 24"
  >
    <path
      fill="#666"
      d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698zm3.546 8.283H4.004l.001 6.621c0 2.325 1.137 3.616 3.183 3.697l.207.004h7.132c2.184 0 3.39-1.271 3.39-3.63v-6.692zm-3.202 5.853c.349 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.237-.645.546-.692l.094-.006zm-3.742 0c.35 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.238-.645.546-.692l.094-.006zm-3.75 0c.35 0 .633.312.633.698 0 .353-.238.645-.547.691l-.093.006c-.35 0-.633-.312-.633-.697 0-.354.238-.645.547-.692l.094-.006zm7.492-3.615c.349 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.237-.645.546-.691l.094-.006zm-3.742 0c.35 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.238-.645.546-.691l.094-.006zm-3.75 0c.35 0 .633.312.633.697 0 .354-.238.645-.547.692l-.093.006c-.35 0-.633-.312-.633-.698 0-.353.238-.645.547-.691l.094-.006zm6.515-7.657H8.192v.895c0 .385-.283.698-.633.698-.32 0-.584-.263-.626-.603l-.006-.095v-.874c-1.886.173-2.922 1.422-2.922 3.6v.402h13.912v-.403c.007-2.181-1.024-3.427-2.914-3.599v.874c0 .385-.283.698-.632.698-.32 0-.585-.263-.627-.603l-.005-.095v-.895z"
    />
  </svg>
);

const ArticleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="20"
    fill="none"
    viewBox="0 0 18 20"
  >
    <path
      fill="#666"
      d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056zm-.008 1.457H5.434c-2.244 0-3.381 1.263-3.381 3.752v9.582c0 2.489 1.137 3.752 3.38 3.752h7.049c2.242 0 3.372-1.263 3.372-3.752V5.209c0-2.489-1.13-3.752-3.372-3.752zm-.239 12.053c.36 0 .652.324.652.724 0 .4-.292.724-.652.724H5.656c-.36 0-.652-.324-.652-.724 0-.4.293-.724.652-.724h6.587zm0-4.239a.643.643 0 01.632.339.806.806 0 010 .78.643.643 0 01-.632.339H5.656c-.334-.042-.587-.355-.587-.729s.253-.688.587-.729h6.587zM8.17 5.042c.335.041.588.355.588.729 0 .373-.253.687-.588.728H5.665c-.336-.041-.589-.355-.589-.728 0-.374.253-.688.589-.729H8.17z"
    />
  </svg>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="13"
    fill="none"
    viewBox="0 0 14 13"
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
      clipRule="evenodd"
    />
  </svg>
);

function StoryCard({
  img,
  name,
  isYourStory,
}: {
  img: string;
  name: string;
  isYourStory?: boolean;
}) {
  return (
    <div className="w-1/4 px-1.5">
      <div className="rounded-md relative overflow-hidden group cursor-pointer">
        <div className="relative">
          <Image
            src={img}
            alt="Image"
            width={150}
            height={200}
            className="w-full h-auto rounded-md"
          />
          {/* Shared dark overlay — darker by default, lighter on hover */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-200 pointer-events-none" />
          {isYourStory ? (
            <>
              <div className="absolute rounded-t-2xl bottom-0 left-0 right-0 h-12 bg-(--bg5) flex items-end justify-center pb-2">
                <p className="text-white text-xs font-medium">Your Story</p>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <button className="w-7 h-7 rounded-full bg-(--color5) border-2 border-(--bg5) flex items-center justify-center shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    fill="none"
                    viewBox="0 0 10 10"
                  >
                    <path
                      stroke="#fff"
                      strokeLinecap="round"
                      d="M.5 4.884h9M4.884 9.5v-9"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Centered name */}
              <div className="absolute bottom-2 inset-x-0 flex items-center justify-center px-2">
                <p className="text-white text-sm  font-semibold text-center drop-shadow-lg">
                  {name}
                </p>
              </div>
              <div className="absolute top-2 right-2">
                <Image
                  src="/images/mini_pic.png"
                  alt="Image"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* Mobile Story Item */
function MobileStoryItem({
  img,
  name,
  isYourStory,
  variant,
}: {
  img: string;
  name: string;
  isYourStory?: boolean;
  variant?: "active" | "inactive";
}) {
  const borderClass =
    variant === "active"
      ? "border-[3px] border-(--color5)"
      : variant === "inactive"
        ? "border-[3px] border-[#C5C5C5]"
        : "";

  return (
    <li className="shrink-0 basis-17.5 flex justify-center">
      <a href="#0" className="block text-center">
        <div className="relative w-15 h-15 mx-auto">
          <Image
            src={img}
            alt="Image"
            width={60}
            height={60}
            className={`w-15 h-15 rounded-full object-cover ${borderClass}`}
          />
          {/* Overlay */}
          <div className="absolute top-0 left-0 w-15 h-15 bg-linear-to-b from-transparent to-[#112032] opacity-50 rounded-full pointer-events-none"></div>
          {isYourStory && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <button
                type="button"
                className="bg-(--color5) border border-white rounded-full w-6 h-6 flex items-center justify-center outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 2.5v7M2.5 6h7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        {isYourStory ? (
          <p className="font-medium text-xs leading-[1.2] text-(--color5) text-center mt-3">
            Your Story
          </p>
        ) : (
          <p className="font-medium text-xs leading-[1.2] text-(--color7) text-center mt-3 w-15 overflow-hidden text-ellipsis whitespace-nowrap mx-auto">
            {name}
          </p>
        )}
      </a>
    </li>
  );
}

function PostCard() {
  return (
    <div className="bg-(--bg2) rounded-md pb-6 pt-6 mb-4">
      <div className="px-6">
        {/* Post header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="mr-3">
              <Image
                src="/images/post_img.png"
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium text-sm leading-[1.4] text-(--color6) hover:text-(--color5) cursor-pointer">
                Karim Saif
              </h4>
              <p className="font-normal text-xs leading-[1.4] text-(--color7)">
                5 minute ago .{" "}
                <a href="#0" className="text-(--color5)">
                  Public
                </a>
              </p>
            </div>
          </div>
          <div>
            <button className="border-none bg-transparent p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="4"
                height="17"
                fill="none"
                viewBox="0 0 4 17"
              >
                <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
              </svg>
            </button>
          </div>
        </div>
        <h4 className="font-medium text-base leading-[1.4] text-(--color6) mb-4">
          -Healthy Tracking App
        </h4>
        <div className="mb-6">
          <Image
            src="/images/timeline_img.png"
            alt=""
            width={600}
            height={400}
            className="w-full h-auto rounded-md"
          />
        </div>
      </div>

      {/* Reactions summary */}
      <div className="flex items-center justify-between px-6 mb-6.5">
        <div className="flex items-center">
          <div className="flex -space-x-4 cursor-pointer">
            {[
              "/images/react_img1.png",
              "/images/react_img2.png",
              "/images/react_img3.png",
              "/images/react_img4.png",
              "/images/react_img5.png",
            ].map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Image"
                width={32}
                height={32}
                className={`w-8 h-8 rounded-full object-cover border border-white bg-(--color3) ${i >= 2 ? "max-sm:hidden" : ""}`}
              />
            ))}
            <div className="w-8 h-8 rounded-full bg-(--color5) border-2 border-white flex items-center justify-center text-sm font-normal text-white">
              9+
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-(--color7)">
            <span className="font-medium">12</span> Comment
          </p>
          <p className="text-sm text-(--color7)">
            <span className="font-medium">122</span> Share
          </p>
        </div>
      </div>

      {/* Reaction buttons */}
      <div className="flex items-center bg-(--reaction-bg) rounded-md p-2 mx-6">
        <button className="flex-1 flex items-center justify-center h-11 gap-2 text-sm font-normal text-(--color6) bg-(--color9) rounded-md border-none mr-1 transition-all duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            fill="none"
            viewBox="0 0 19 19"
          >
            <path
              fill="#FFCC4D"
              d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
            />
            <path
              fill="#664500"
              d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
            />
            <path
              fill="#fff"
              d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
            />
            <path
              fill="#664500"
              d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
            />
          </svg>
          Haha
        </button>
        <button className="flex-1 flex items-center justify-center h-12 gap-2 text-sm font-normal text-(--color6) bg-transparent rounded-md border-none mr-1 transition-all duration-200 hover:bg-(--color9)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            fill="none"
            viewBox="0 0 21 21"
          >
            <path
              stroke="currentColor"
              d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.938 9.313h7.125M10.5 14.063h3.563"
            />
          </svg>
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center h-12 gap-2 text-sm font-normal text-(--color6) bg-transparent rounded-md border-none transition-all duration-200 hover:bg-(--color9)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="21"
            fill="none"
            viewBox="0 0 24 21"
          >
            <path
              stroke="currentColor"
              strokeLinejoin="round"
              d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
            />
          </svg>
          Share
        </button>
      </div>

      {/* Comment area */}
      <div className="px-6 pt-6 pb-2.5">
        <div className="bg-(--comment-bg) rounded-[18px] py-1 px-2.5">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-1">
              <Image
                src="/images/comment_img.png"
                alt=""
                width={26}
                height={26}
                className="w-6.5 h-6.5 rounded-full object-cover shrink-0"
              />
              <input
                type="text"
                className="bg-transparent border-none w-full h-10 px-2 text-sm text-(--color6) focus:outline-none placeholder:text-(--color7)"
                placeholder="Write a comment"
              />
            </div>
            <div className="flex items-center shrink-0 text-(--color5)">
              <button className="border-none bg-transparent mx-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="border-none bg-transparent mx-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="px-6 pt-4">
        <div className="mb-3">
          <button
            type="button"
            className="text-(--color5) text-sm font-medium bg-transparent border-none"
          >
            View 4 previous comments
          </button>
        </div>
        <div className="flex gap-3">
          <div className="shrink-0">
            <a href="#">
              <Image
                src="/images/txt_img.png"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            </a>
          </div>
          <div className="flex-1 min-w-0">
            <div className="relative mb-4">
              <div className="bg-(--comment-bg) rounded-xl p-3">
                <a href="#">
                  <h4 className="font-medium text-sm text-(--color6) mb-1">
                    Radovan SkillArena
                  </h4>
                </a>
                <p className="text-sm text-(--color7)">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
              </div>
              <div className="absolute -bottom-3 right-3 flex items-center gap-0.5 bg-(--bg2) rounded-full shadow-sm px-1.5 py-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#1890FF"
                  stroke="#1890FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#E74C3C"
                  stroke="#E74C3C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span className="text-xs text-(--color7) ml-0.5">198</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-xs font-medium text-(--color7) cursor-pointer">
                Like.
              </span>
              <span className="text-xs font-medium text-(--color7) cursor-pointer">
                Reply.
              </span>
              <span className="text-xs font-medium text-(--color7) cursor-pointer">
                Share
              </span>
              <span className="text-xs text-(--color5)">.21m</span>
            </div>
            {/* Reply box */}
            <div className="mt-3">
              <div className="bg-(--comment-bg) rounded-[18px] py-1 px-2.5">
                <div className="flex items-center">
                  <Image
                    src="/images/comment_img.png"
                    alt=""
                    width={26}
                    height={26}
                    className="w-6.5 h-6.5 rounded-full object-cover shrink-0"
                  />
                  <input
                    type="text"
                    className="bg-transparent border-none w-full h-10 px-2 text-sm text-(--color6) focus:outline-none placeholder:text-(--color7)"
                    placeholder="Write a comment"
                  />
                  <div className="flex items-center shrink-0 text-(--color5)">
                    <button className="border-none bg-transparent mx-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="border-none bg-transparent mx-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PostCard };

// Re-export for backward compat — icons are used in create-post-section
export { ArticleIcon, EventIcon, PhotoIcon, SendIcon, VideoIcon };

import CreatePostSection from "./create-post-section";
import FeedPosts from "./feed-posts";

export default function FeedContent() {
  return (
    <div className="w-full max-w-170 mx-auto lg:w-1/2 lg:px-2">
      <div className="flex flex-col h-[calc(100vh-75px)] max-lg:h-full flex-1 overflow-y-auto overflow-x-hidden pt-2">
        <div className="max-lg:h-full flex flex-col flex-1 pt-2 max-lg:pb-20">
          {/* Stories - Desktop */}
          <div className="mb-4 relative max-lg:hidden">
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-(--color5) flex items-center justify-center border-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="9"
                  height="8"
                  fill="none"
                  viewBox="0 0 9 8"
                >
                  <path
                    fill="#fff"
                    d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex -mx-1.5">
              <StoryCard img="/images/card_ppl1.png" name="" isYourStory />
              <StoryCard img="/images/card_ppl2.png" name="Ryan Roslansky" />
              <StoryCard img="/images/card_ppl3.png" name="Ryan Roslansky" />
              <StoryCard img="/images/card_ppl4.png" name="Ryan Roslansky" />
            </div>
          </div>

          {/* Stories - Mobile */}
          <div className="mb-4 hidden max-lg:block">
            <div className="overflow-x-auto overflow-y-hidden">
              <ul className="flex items-center gap-0 py-2">
                <MobileStoryItem
                  img="/images/mobile_story_img.png"
                  name="Your Story"
                  isYourStory
                />
                <MobileStoryItem
                  img="/images/mobile_story_img1.png"
                  name="Ryan..."
                  variant="active"
                />
                <MobileStoryItem
                  img="/images/mobile_story_img2.png"
                  name="Ryan..."
                  variant="inactive"
                />
                <MobileStoryItem
                  img="/images/mobile_story_img1.png"
                  name="Ryan..."
                  variant="active"
                />
                <MobileStoryItem
                  img="/images/mobile_story_img2.png"
                  name="Ryan..."
                  variant="inactive"
                />
                <MobileStoryItem
                  img="/images/mobile_story_img1.png"
                  name="Ryan..."
                  variant="active"
                />
                <MobileStoryItem
                  img="/images/mobile_story_img.png"
                  name="Ryan..."
                />
                <MobileStoryItem
                  img="/images/mobile_story_img1.png"
                  name="Ryan..."
                  variant="active"
                />
              </ul>
            </div>
          </div>

          {/* Create Post */}
          <CreatePostSection />

          {/* Real Posts from API */}
          <FeedPosts />
        </div>
      </div>
    </div>
  );
}
