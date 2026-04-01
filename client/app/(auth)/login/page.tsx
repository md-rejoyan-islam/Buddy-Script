import AuthFormCard from "@/components/auth/auth-form-card";
import AuthLeftside from "@/components/auth/auth-leftside";
import LoginForm from "@/components/auth/form/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Buddy Script",
  description:
    "Login to your Buddy Script account. Connect with friends, share updates, and stay in touch with your community.",
  keywords: ["login", "sign in", "buddy script", "social media"],
  openGraph: {
    title: "Login - Buddy Script",
    description:
      "Login to your Buddy Script account. Connect with friends, share updates, and stay in touch.",
    type: "website",
  },
};

export default function LoginPage() {
  return (
    <>
      <AuthLeftside url="/images/login.png" from="login" />
      <AuthFormCard
        title="Welcome back"
        subtitle="Login to your account"
        from="login"
      >
        <LoginForm />
      </AuthFormCard>
    </>
  );
}
