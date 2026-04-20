"use client";

import { deleteUserAction } from "@/lib/admin/actions";

type Props = {
  userId: string;
  email: string;
  label: string;
  confirmMessage: string;
};

export function UserDeleteForm({ userId, email, label, confirmMessage }: Props) {
  return (
    <form
      action={deleteUserAction}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage.replace("{email}", email))) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={userId} />
      <button
        type="submit"
        className="rounded-md border border-red-500/40 px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
      >
        {label}
      </button>
    </form>
  );
}
