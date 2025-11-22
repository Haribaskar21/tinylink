import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../app/components/Layout';
import { formatIST } from '../../lib/formatTime';


export default function CodeStats() {
  const router = useRouter();
  const { code } = router.query;
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    async function fetchStats() {
      const res = await fetch(`/api/links/${code}`);
      if (res.status === 404) {
        setLink(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLink(data);
      setLoading(false);
    }
    fetchStats();
  }, [code]);

  if (loading) return <Layout><p>Loading stats...</p></Layout>;
  if (!link) return <Layout><p>Link not found.</p></Layout>;

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
        <h1 className="text-xl font-bold mb-4">Stats for {link.code}</h1>
        <p><strong>Original URL:</strong> <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-600">{link.url}</a></p>
        <p><strong>Created At:</strong> {formatIST(link.created_at)
}</p>
        <p><strong>Total Clicks:</strong> {link.click_count}</p>
        <p><strong>Last Clicked:</strong> {link.last_clicked ? formatIST(link.last_clicked)
 : 'Never'}</p>
      </div>
    </Layout>
  );
}