import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getTournamentsCount, getOrganizers, getReports, getAnnouncements } from '@/lib/db/queries';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tournamentsCount, organizers, reports, announcements] = await Promise.all([
    getTournamentsCount(),
    getOrganizers(),
    getReports(1),
    getAnnouncements(true), // activeOnly = true
  ]);

  const hasTournaments = tournamentsCount > 0;
  const hasOrganizers = organizers.length > 0;
  const hasReports = reports.length > 0;
  const hasAnnouncements = announcements.length > 0;

  return (
    <div className="flex flex-col min-h-screen relative">
      <Nav 
        hasTournaments={hasTournaments}
        hasOrganizers={hasOrganizers}
        hasReports={hasReports}
        hasAnnouncements={hasAnnouncements}
      />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
