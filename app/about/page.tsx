"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AboutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
 useEffect(() => {
    if (status === "unauthenticated") {
        router.push("/login");
    }
 }, [session, status])

  return (
    <div>
      <h1>TEST ABOUT PAGE PROTECTION</h1>
    </div>
  );
}
