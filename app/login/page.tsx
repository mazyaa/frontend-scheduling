import { Metadata } from "next";
import { Suspense } from "react";

import AuthLayout from "@/components/layouts/AuthLayout";
import Login from "@/components/views/Login/Login";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke akun",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <Login />
      </Suspense>
    </AuthLayout>
  );
}
