import useIsMobile from '../../hooks/useIsMobile.ts';
import HomeMobile from './HomeMobile.tsx';
import HomeDesktop from './HomeDesktop';

export default function Home() {
  const isMobile = useIsMobile();

  return isMobile ? <HomeMobile /> : <HomeDesktop />;
}
