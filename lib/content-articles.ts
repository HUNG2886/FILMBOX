export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
};

export const articles: Article[] = [
  {
    slug: "huong-dan-xem-phim-ngan",
    title: "Hướng dẫn xem phim ngắn trên FilmBox",
    excerpt: "Làm quen giao diện và các tính năng xem phim ngắn trên FilmBox.",
    date: "2026-04-01",
    tag: "Hướng dẫn",
  },
  {
    slug: "bang-xep-hang-thang-4",
    title: "Bảng xếp hạng phim ngắn tháng 4",
    excerpt: "Những bộ phim ngắn được xem nhiều nhất trên FilmBox trong tháng 4.",
    date: "2026-04-15",
    tag: "Bài viết",
  },
  {
    slug: "the-loai-romance-va-billionaire",
    title: "Romance & Billionaire: các motif quen thuộc",
    excerpt: "Tóm tắt các motif thường gặp trong phim ngắn hiện đại.",
    date: "2026-04-10",
    tag: "Phân tích",
  },
];
