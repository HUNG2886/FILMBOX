import { logoutUserAction } from "@/lib/user/actions";

type Props = {
  label: string;
};

export function LogoutButton({ label }: Props) {
  return (
    <form action={logoutUserAction}>
      <button
        type="submit"
        className="w-full rounded-full border border-card-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-card"
      >
        {label}
      </button>
    </form>
  );
}
