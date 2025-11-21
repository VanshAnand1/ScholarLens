import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/home" className="text-2xl font-bold">
            ScholarLens
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/home" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link
              href="/scholarships"
              className="hover:text-primary transition-colors"
            >
              Scholarships
            </Link>
            <Link
              href="/profile"
              className="hover:text-primary transition-colors"
            >
              Profile
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-muted-foreground">
          ScholarLens - AI-Powered Scholarship Matching
        </div>
      </footer>
    </div>
  );
}
