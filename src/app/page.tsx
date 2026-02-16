import Hero from '@/components/home/Hero';
import BuildersHubSection from '@/components/home/BuildersHubSection';
import SharkTankSection from '@/components/home/SharkTankSection';
import SectionDivider from '@/components/home/SectionDivider';
import StatsBar from '@/components/home/StatsBar';

export default function Home() {
  return (
    <div>
      <Hero />
      <StatsBar />
      <BuildersHubSection />
      <SectionDivider />
      <SharkTankSection />
    </div>
  );
}