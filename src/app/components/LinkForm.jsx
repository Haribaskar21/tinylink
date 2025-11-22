import { useState } from 'react';

export default function LinkForm({ onAdd }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Validate URL
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      setError('Code must be alphanumeric and 6 to 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, code: code || generateCode() }),
      });
      if (res.status === 409) {
        setError('Code already exists');
      } else if (res.ok) {
        const data = await res.json();
        onAdd(data);
        setUrl('');
        setCode('');
        setSuccess('Link added successfully!');
      } else {
        setError('Something went wrong');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  }

  // Generates random 6 char alphanumeric code
  function generateCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
      <div className="mb-4">
        <label className="block font-semibold mb-1">Long URL</label>
        <input
          type="url"
          className="w-full border rounded p-2"
          placeholder="https://example.com/long-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Custom Code (optional)</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          placeholder="6-8 letters or numbers"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={loading}
          maxLength={8}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Create Short Link'}
      </button>
      {error && <p className="mt-2 text-red-600">{error}</p>}
      {success && <p className="mt-2 text-green-600">{success}</p>}
    </form>
  );
}