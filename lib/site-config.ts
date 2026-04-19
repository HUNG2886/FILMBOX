/**
 * Public contact & social URLs. Override via .env (NEXT_PUBLIC_*).
 * Empty social URL → footer shows label without external link until configured.
 */

function trimOrEmpty(v: string | undefined) {
  return v?.trim() ?? "";
}

export const siteEmails = {
  feedback: trimOrEmpty(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "contact@example.com",
  jobs: trimOrEmpty(process.env.NEXT_PUBLIC_JOBS_EMAIL) || "careers@example.com",
  dpo: trimOrEmpty(process.env.NEXT_PUBLIC_DPO_EMAIL) || "dpo@example.com",
} as const;

export type SocialNetwork = "facebook" | "youtube" | "tiktok";

export function getSocialUrls(): Record<SocialNetwork, string | null> {
  return {
    facebook: trimOrEmpty(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL) || null,
    youtube: trimOrEmpty(process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL) || null,
    tiktok: trimOrEmpty(process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL) || null,
  };
}
