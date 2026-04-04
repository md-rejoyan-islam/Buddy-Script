"use client";

import { loginAction } from "@/app/actions/auth";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../input-field";
import PasswordField from "../password-field";
import SubmitButton from "../submit-button";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await loginAction(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result?.message);
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="Email"
        type="email"
        registration={register("email")}
        error={errors.email}
      />
      <PasswordField
        label="Password"
        registration={register("password")}
        error={errors.password}
      />

      {/* Remember me & Forgot password */}
      <div className="flex items-center gap-2 justify-between">
        <div className="shrink-0">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 accent-(--color5) mr-2 shrink-0 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-sm font-normal text-(--color) leading-[1.4] max-2xl:text-xs cursor-pointer whitespace-nowrap"
            >
              Remember me
            </label>
          </div>
        </div>
        <div className="shrink-0">
          <p className="text-(--color5) text-sm leading-[1.4] cursor-pointer max-2xl:text-xs whitespace-nowrap">
            Forgot password?
          </p>
        </div>
      </div>

      {/* Login button */}
      <div className="mt-10 mb-15">
        <SubmitButton label="Login now" isLoading={isSubmitting} />
      </div>
    </form>
  );
}
