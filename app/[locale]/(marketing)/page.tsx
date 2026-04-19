import { HeroCarousel } from "@/components/marketing/HeroCarousel";
import { SectionFeaturedEpisodes } from "@/components/marketing/SectionFeaturedEpisodes";
import { SectionRecommended } from "@/components/marketing/SectionRecommended";
import { SectionTrending } from "@/components/marketing/SectionTrending";
import {
  getFeaturedCarousel,
  getFeaturedEpisodes,
  getRecommended,
  getTrending,
} from "@/lib/dramas";

export default async function MarketingHomePage() {
  const [carousel, recommended, trending, hidden] = await Promise.all([
    getFeaturedCarousel(),
    getRecommended(),
    getTrending(),
    getFeaturedEpisodes(),
  ]);

  return (
    <>
      <HeroCarousel items={carousel} />
      <SectionRecommended items={recommended} />
      <SectionTrending items={trending} />
      <SectionFeaturedEpisodes items={hidden} />
    </>
  );
}
