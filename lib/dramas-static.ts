/**
 * Dữ liệu demo gốc — dùng cho seed DB và tham chiếu thứ tự kệ.
 */
import { slugify } from "@/lib/slug";
import type { Drama } from "@/lib/dramas-types";

const p = (seed: string, w = 400, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

function drama(
  id: string,
  bookId: string,
  title: string,
  rest: Omit<Drama, "id" | "bookId" | "slug" | "title"> & { slug?: string },
): Drama {
  return {
    id,
    bookId,
    title,
    slug: rest.slug ?? slugify(title),
    episodes: rest.episodes,
    synopsis: rest.synopsis,
    tag: rest.tag,
    posterSrc: rest.posterSrc,
    exclusive: rest.exclusive,
  };
}

export const featuredCarousel: Drama[] = [
  drama("f1", "42000001001", "Sau Khi Ly Hôn, Chồng Cũ Tôi Hoá Thành Chí Tôn", {
    episodes: 142,
    synopsis:
      "Chí Tôn ẩn danh nâng đỡ cô bước lên đỉnh cao quyền lực. Ngày cô được sắc phong cũng là ngày cô đưa đơn ly hôn.",
    tag: "Ngược tâm",
    posterSrc: p("dramabox-f1"),
    exclusive: true,
  }),
  drama("f2", "42000001002", "Mối Tình Bí Mật", {
    episodes: 53,
    synopsis:
      "Thiên tài máy tính, người thừa kế gia tộc giàu có nhất miền Nam — và mối duyên không thể công khai.",
    tag: "Tình tay ba",
    posterSrc: p("dramabox-f2"),
    exclusive: true,
  }),
  drama("f3", "42000001003", "Yêu Cái Cách Em Nói Dối", {
    episodes: 59,
    synopsis:
      "Mất cả tình lẫn tiền vào tay chị ruột, cô lên kế hoạch trả đũa — và gặp ông chú quyến rũ của người yêu cũ.",
    tag: "Trả thù ngọt",
    posterSrc: p("dramabox-f3"),
    exclusive: true,
  }),
];

export const recommended: Drama[] = [
  drama("r1", "42000002001", "Sau Khi Ly Hôn, Chồng Cũ Tôi Hoá Thành Chí Tôn", {
    episodes: 142,
    synopsis: "",
    posterSrc: p("r1"),
    exclusive: true,
  }),
  drama("r2", "42000002002", "Sau Khi Tôi Bỏ Đi, Hai Trúc Mã Đã Phát Điên", {
    episodes: 80,
    synopsis: "",
    posterSrc: p("r2"),
    exclusive: true,
  }),
  drama("r3", "42000002003", "Lạc Vào Sương Mù, Đánh Mất Em", {
    episodes: 72,
    synopsis: "",
    posterSrc: p("r3"),
    exclusive: true,
  }),
  drama("r4", "42000002004", "Đêm Tân Hôn Là Lúc Ly Hôn", {
    episodes: 45,
    synopsis: "",
    posterSrc: p("r4"),
    exclusive: true,
  }),
  drama("r5", "42000002005", "Anh đã ước đó là em", {
    episodes: 36,
    synopsis: "",
    posterSrc: p("r5"),
    exclusive: true,
  }),
  drama("r6", "42000002006", "Thân Phận Bị Che Giấu Của Chàng Rể Phế Vật", {
    episodes: 99,
    synopsis: "",
    posterSrc: p("r6"),
    exclusive: true,
  }),
];

export const trending: Drama[] = [
  drama("t1", "42000003001", "Người đẹp và Ông Trùm", {
    episodes: 64,
    synopsis: "",
    posterSrc: p("t1"),
    exclusive: true,
  }),
  drama("t2", "42000003002", "Đêm định mệnh cùng Tổng tài", {
    episodes: 48,
    synopsis: "",
    posterSrc: p("t2"),
    exclusive: true,
  }),
  drama("t3", "42000003003", "Rồng Vàng Đổi Vận", {
    episodes: 55,
    synopsis: "",
    posterSrc: p("t3"),
    exclusive: true,
  }),
  drama("t4", "42000003004", "Chiến Đấu Vì Em", {
    episodes: 70,
    synopsis: "",
    posterSrc: p("t4"),
    exclusive: true,
  }),
];

export const featuredEpisodes: Drama[] = [
  drama("e1", "42000004001", "Ngang Qua Thế Giới Của Anh", {
    episodes: 40,
    synopsis: "",
    posterSrc: p("e1"),
    exclusive: true,
  }),
  drama("e2", "42000004002", "Nữ Vương", {
    episodes: 88,
    synopsis: "",
    posterSrc: p("e2"),
    exclusive: true,
  }),
  drama("e3", "42000004003", "Đêm định mệnh cùng Tổng tài", {
    episodes: 48,
    synopsis: "",
    posterSrc: p("e3b"),
    exclusive: true,
    slug: "dem-dinh-menh-cung-tong-tai-ban-2",
  }),
];
