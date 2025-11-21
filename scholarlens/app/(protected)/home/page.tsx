import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="text-7xl font-bold hover:underline">
        Welcome to ScholarLens
      </div>
      <Link className="hover:underline text-2xl" href="/scholarships">
        Training Data
      </Link>
    </main>
  );
}
