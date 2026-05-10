import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getAnnouncements } from '@/lib/db/queries';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const announcements = await getAnnouncements(true);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Fixed Background Image (Global to public pages) */}
      <div className="fixed inset-0 z-[-1] bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/seisai-bg.jpg"
          className="w-220 object-contain mx-auto"
          alt="Background"
        />
      </div>

      {/* Wafu Kasumi & Shigure Lines Background (Global to public pages) */}
      <div className="wafu-lines-bg">
        {/* Horizontal drifting mist (Kasumi) */}
        <div className="wafu-kasumi-line" />
        <div className="wafu-kasumi-line" />
        <div className="wafu-kasumi-line" />
        <div className="wafu-kasumi-line" />
        <div className="wafu-kasumi-line" />
        <div className="wafu-kasumi-line" />
        
        {/* Vertical falling rain (Shigure) */}
        <div className="wafu-shigure-line" />
        <div className="wafu-shigure-line" />
        <div className="wafu-shigure-line" />
      </div>

      <Nav />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
