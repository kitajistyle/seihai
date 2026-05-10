import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { getAnnouncements } from '@/lib/db/queries';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const announcements = await getAnnouncements(true);

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <AnnouncementBanner announcements={announcements} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
