import AuthFormCard from "@/components/auth/auth-form-card";
import AuthLeftside from "@/components/auth/auth-leftside";
import RegisterForm from "@/components/auth/form/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration - Buddy Script",
  description:
    "Create your Buddy Script account. Join our community, connect with friends, and share your moments.",
  keywords: [
    "register",
    "sign up",
    "create account",
    "buddy script",
    "social media",
  ],
  openGraph: {
    title: "Registration - Buddy Script",
    description:
      "Create your Buddy Script account. Join our community, connect with friends, and share your moments.",
    type: "website",
  },
};

export default function RegistrationPage() {
  return (
    <>
      <AuthLeftside url="/images/registration.png" from="registration" />
      <AuthFormCard
        title="Get Started Now"
        subtitle="Registration"
        from="registration"
      >
        <RegisterForm />
      </AuthFormCard>
    </>
  );
}
