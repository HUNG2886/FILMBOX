"use client";

import type { FormEvent } from "react";
import { deleteMovieAction } from "@/lib/admin/actions";

type Props = {
  movieId: string;
  title: string;
  label: string;
  confirmMessage: string;
};

export function MovieDeleteForm({ movieId, title, label, confirmMessage }: Props) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const msg = confirmMessage.replace("{title}", title);
    if (!window.confirm(msg)) {
      event.preventDefault();
    }
  }

  return (
    <form
      action={deleteMovieAction}
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl border-t border-card-border py-6"
    >
      <input type="hidden" name="id" value={movieId} />
      <button
        type="submit"
        className="text-sm font-semibold text-red-500 hover:underline"
      >
        {label}
      </button>
    </form>
  );
}
