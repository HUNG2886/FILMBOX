import { setRequestLocale } from "next-intl/server";
import { AdminHeader } from "@/components/admin/AdminHeader";

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
