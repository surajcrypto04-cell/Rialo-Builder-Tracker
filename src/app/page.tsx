import Hero from '@/components/home/Hero';
import BuildersHubSection from '@/components/home/BuildersHubSection';
import SharkTankSection from '@/components/home/SharkTankSection';
import SectionDivider from '@/components/home/SectionDivider';
import StatsBar from '@/components/home/StatsBar';
import BuilderOfTheWeek from '@/components/home/BuilderOfTheWeek';

export default function Home() {
  return (
    <div>
      <Hero />
      <BuilderOfTheWeek />
      <StatsBar />
      <BuildersHubSection />
      <SectionDivider />
      <SharkTankSection />
    </div>
  );
}