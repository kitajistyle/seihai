import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Nav />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
