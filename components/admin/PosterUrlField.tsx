"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  id?: string;
  name?: string;
  required?: boolean;
  defaultValue?: string;
  label: string;
  placeholder?: string;
  hint?: string;
  previewAlt: string;
};

function isPreviewable(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (v.startsWith("/")) return true;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function PosterUrlField({
  id = "posterSrc",
  name = "posterSrc",
  required,
  defaultValue = "",
  label,
  placeholder,
  hint,
  previewAlt,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const canPreview = isPreviewable(value);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium" htmlFor={id}>
        {label}
        {required ? " *" : null}
      </label>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <input
            id={id}
            name={name}
            required={required}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={(e) => setValue(e.currentTarget.value)}
            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm"
          />
          {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
        </div>
        {canPreview ? (
          <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md border border-card-border">
            <Image
              src={value.trim()}
              alt={previewAlt}
              fill
              sizes="64px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
