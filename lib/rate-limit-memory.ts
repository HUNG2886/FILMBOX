/**
 * Rate limiter in-memory (theo tiến trình). Trên môi trường nhiều instance / serverless
 * mỗi instance có bộ đếm riêng — production lớn nên chuyển Redis / Upstash sau.
 */
type Bucket = number[];

const buckets = new Map<string, Bucket>();

function prune(bucket: Bucket, windowMs: number, now: number) {
  const cutoff = now - windowMs;
  while (bucket.length > 0 && bucket[0]! < cutoff) {
    bucket.shift();
  }
}

/** Trả về false nếu đã vượt giới hạn (không ghi thêm lần thử). */
export function allowRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? [];
  prune(bucket, windowMs, now);
  if (bucket.length >= max) {
    return false;
  }
  bucket.push(now);
  buckets.set(key, bucket);
  return true;
}
