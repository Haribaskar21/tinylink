'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import LinkForm from './components/LinkForm';
import LinkTable from './components/LinkTable';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/links');
      setLinks(res.data);
    } catch {
      setLinks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (code) => {
    if (!confirm('Delete this link?')) return;
    try {
      await axios.delete(`/api/links/${code}`);
      fetchLinks();
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">TinyLink Dashboard</h1>
      <LinkForm onAdd={fetchLinks} />

      {loading ? (
        <p className="text-center mt-6">Loading links...</p>
      ) : links.length === 0 ? (
        <p className="text-center mt-6">No links found</p>
      ) : (
        <LinkTable links={links} onDelete={handleDelete} />
      )}
    </div>
  );
}