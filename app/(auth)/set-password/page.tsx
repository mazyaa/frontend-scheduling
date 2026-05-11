import { Metadata } from "next";
import { Suspense } from "react";

import AuthLayout from "@/components/layouts/AuthLayout";
import SetPassword from "@/components/features/SetPassword/SetPassword";

export const metadata: Metadata = {
  title: "Set Password",
  description: "Atur kata sandi akun Anda",
  icons: { icon: "/images/general/veritrust-logo.png" },
};

export default function SetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <SetPassword />
      </Suspense>
    </AuthLayout>
  );
}
