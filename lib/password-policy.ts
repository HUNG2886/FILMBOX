/** Chính sách tối thiểu cho mật khẩu admin (áp dụng khi tạo/đổi user — seed có thể nới lỏng trong dev). */

export const PASSWORD_MIN_LENGTH = 10;

export function validatePasswordStrength(password: string): { ok: true } | { ok: false; code: "short" | "weak" } {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, code: "short" };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  if (!hasLetter || !hasDigit) {
    return { ok: false, code: "weak" };
  }
  return { ok: true };
}
