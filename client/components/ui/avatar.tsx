type AvatarUser = {
  id: string;
  src: string | null;
  alt?: string;
};

type AvatarGroupProps = {
  users: AvatarUser[];
  max?: number;
  total: number;
  className?: string;
  onClick?: () => void;
};

export function AvatarGroup({
  users,
  max = 5,
  total,
  className = "",
  onClick,
}: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const remaining = total - visible.length;

  return (
    <button
      onClick={onClick}
      className={`flex items-center mr-5 bg-transparent border-none cursor-pointer p-0 ${className}`}
    >
      {visible.map((user, i) => (
        <span
          key={user.id}
          style={{ zIndex: i }}
          className="inline-flex shrink-0 items-center justify-center border-2 border-white rounded-full h-8 ring-offset-1 w-8 -mr-4 overflow-hidden bg-gray-200"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.src || "/default-avatar.png"}
            alt={user.alt?.split("")[0].toLocaleUpperCase() || ""}
            className="w-full h-full object-cover"
          />
        </span>
      ))}
      {remaining > 0 && (
        <span
          style={{ zIndex: visible.length - 1 }}
          className="flex items-center justify-center bg-(--color5) text-white text-xs font-semibold border-2 border-white rounded-full h-8 w-8 -mr-4"
        >
          +{remaining}
        </span>
      )}
    </button>
  );
}
