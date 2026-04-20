import { getUserSession } from "@/lib/user-session";
import { isVipActive } from "@/lib/vip";
import { SiteHeaderClient } from "./SiteHeaderClient";

export async function SiteHeader() {
  const session = await getUserSession();
  const user = session
    ? { email: session.email, isVip: isVipActive(session) }
    : null;
  return <SiteHeaderClient user={user} />;
}
