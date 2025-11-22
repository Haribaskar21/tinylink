import Nav from './Nav';

export default function Layout({ children }) {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gray-50">{children}</main>
      <footer className="text-center p-4 text-sm text-gray-400">© TinyLink 2024</footer>
    </>
  );
}