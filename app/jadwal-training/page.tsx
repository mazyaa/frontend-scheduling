import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function JadwalTrainingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/jadwal-training");
  }

  const role = session.user?.role;

  const redirectMap: Record<string, string> = {
    peserta: "/peserta/jadwal-training",
    instruktur: "/instruktur/jadwal-training",
    asesor: "/asesor/jadwal-training",
    admin: "/admin/kelola-jadwal-training",
    direktur: "/direktur/dashboard",
  };

  redirect(redirectMap[role ?? ""] || "/login?callbackUrl=/jadwal-training");
}
