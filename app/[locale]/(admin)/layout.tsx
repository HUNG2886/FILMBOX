import { setRequestLocale } from "next-intl/server";
import { AdminHeader } from "@/components/admin/AdminHeader";

/** Prisma cần DB lúc render — không pre-render tại build (tránh thiếu DATABASE_URL trên CI/Vercel). */
export const dynamic = "force-dynamic";

export default async function AdminGroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-full bg-background">
      <AdminHeader />
      {children}
    </div>
  );
}
