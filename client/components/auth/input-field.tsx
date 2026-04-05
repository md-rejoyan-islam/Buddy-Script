import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

const InputField = ({
  label,
  type = "text",
  registration,
  error,
}: {
  label: string;
  type?: string;
  registration?: UseFormRegisterReturn;
  error?: FieldError;
}) => {
  return (
    <div className="mb-3.5">
      <label className="font-medium text-base leading-[1.4] text-(--color4) mb-2 block">
        {label}
      </label>
      <input
        type={type}
        {...registration}
        className={`w-full bg-(--bg2) border border-solid rounded-md h-12 px-3 text-[13px] text-(--color) focus:outline-none focus:border-(--color5) transition-all duration-200 box-border ${
          error ? "border-red-500" : "border-(--bcolor1)"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;
