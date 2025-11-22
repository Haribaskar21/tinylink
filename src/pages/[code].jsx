import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Redirect() {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (!code) return;

    async function fetchRedirect() {
      const res = await fetch(`/api/links/${code}`);

      if (res.status === 404) {
        router.replace('/404');
        return;
      }

      const link = await res.json();
      window.location.href = link.url; // THIS triggers the click update
    }

    fetchRedirect();
  }, [code]);

  return <p className="text-center mt-20">Redirecting...</p>;
}
