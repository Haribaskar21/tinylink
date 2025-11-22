import { useEffect, useState } from 'react';
import LinkTable from '../components/LinkTable';
import LinkForm from '../components/LinkForm';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all links from API
  async function fetchLinks() {
    setLoading(true);
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error('Failed to fetch links:', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  // Add a new link to the list
  function handleAddLink(newLink) {
    setLinks([newLink, ...links]);
  }

  // Delete a link by code
  async function handleDelete(code) {
    await fetch(`/api/links/${code}`, { method: 'DELETE' });
    setLinks(links.filter(link => link.code !== code));
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Dashboard Header */}
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          TinyLink Dashboard
        </h1>

        {/* Link Form */}
        <section className="mb-12">
          <LinkForm onAdd={handleAddLink} />
        </section>

        {/* Links Table */}
        <section>
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
            <LinkTable
              links={links}
              onDelete={handleDelete}
              onRefresh={fetchLinks}
              loading={loading}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
