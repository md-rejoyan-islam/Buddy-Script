"use client";

import { registerAction } from "@/app/actions/auth";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../input-field";
import SubmitButton from "../submit-button";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerAction(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="First Name"
        type="text"
        registration={register("firstName")}
        error={errors.firstName}
      />
      <InputField
        label="Last Name"
        type="text"
        registration={register("lastName")}
        error={errors.lastName}
      />
      <InputField
        label="Email"
        type="email"
        registration={register("email")}
        error={errors.email}
      />
      <InputField
        label="Password"
        type="password"
        registration={register("password")}
        error={errors.password}
      />
      <InputField
        label="Repeat Password"
        type="password"
        registration={register("confirmPassword")}
        error={errors.confirmPassword}
      />

      {/* Terms checkbox */}
      <div className="max-lg:justify-center">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            {...register("terms")}
            className="w-4 h-4 accent-(--color5) mr-2 shrink-0 cursor-pointer"
          />
          <label
            htmlFor="terms"
            className="text-sm font-normal text-(--color) leading-[1.4] max-2xl:text-xs cursor-pointer"
          >
            I agree to terms & conditions
          </label>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>
        )}
      </div>

      {/* Register button */}
      <div className="mt-10 mb-15">
        <SubmitButton label="Register now" isLoading={isSubmitting} />
      </div>
    </form>
  );
}
