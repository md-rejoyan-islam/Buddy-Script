const SubmitButton = ({
  label,
  isLoading,
}: {
  label: string;
  isLoading?: boolean;
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-3 bg-(--color5) border border-solid border-transparent rounded-md font-medium text-base text-white cursor-pointer hover:shadow-[rgba(149,157,165,0.2)_0px_8px_24px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isLoading ? "Please wait..." : label}
    </button>
  );
};

export default SubmitButton;
