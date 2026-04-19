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
    title: "Hướng dẫn xem phim ngắn trên web demo",
    excerpt: "Giao diện được lấy cảm hứng từ các nền tảng phim ngắn phổ biến.",
    date: "2026-04-01",
    tag: "Hướng dẫn",
  },
  {
    slug: "bang-xep-hang-thang-4",
    title: "Bảng xếp hạng phim ngắn tháng 4 (demo)",
    excerpt: "Dữ liệu minh họa, không phản ánh bảng xếp hạng thật.",
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
