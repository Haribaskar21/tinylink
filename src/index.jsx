import { useEffect, useState } from 'react';
import LinkTable from '../components/LinkTable';
import LinkForm from '../components/LinkForm';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLinks() {
    setLoading(true);
    let res = await fetch('/api/links');
    let data = await res.json();
    setLinks(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function handleAddLink(newLink) {
    setLinks([newLink, ...links]);
  }

  async function handleDelete(code) {
    await fetch(`/api/links/${code}`, { method: 'DELETE' });
    setLinks(links.filter(link => link.code !== code));
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">TinyLink Dashboard</h1>
        <LinkForm onAdd={handleAddLink} />
        {loading ? (
          <p>Loading links...</p>
        ) : (
          <LinkTable links={links} onDelete={handleDelete} />
        )}
      </div>
    </Layout>
  );
}