import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center max-w-5xl mx-auto">
      <Link href="/">
        <a className="text-2xl font-extrabold text-blue-600">TinyLink</a>
      </Link>
      <div>
        <Link href="/">
          <a className="mr-4 hover:text-blue-700">Dashboard</a>
        </Link>
      </div>
    </nav>
  );
}